import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiError,
  Content,
  FunctionCallingConfigMode,
  FunctionDeclaration,
  GoogleGenAI,
  Type
} from '@google/genai';
import { DbAssistantMessageEntity, DbAssistantRole } from '../infrastructure/db-assistant-message.entity';
import { DbAssistantSessionEntity } from '../infrastructure/db-assistant-session.entity';

const DEFAULT_MODEL = 'gemini-2.0-flash';
const SCHEMA_CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_TOOL_CALLS = 4;
const MAX_RESULT_ROWS = 200;
const MAX_RESULT_JSON_CHARS = 20_000;
const QUERY_TIMEOUT_MS = 5000;

/** Per-admin sliding window: each Gemini call costs tokens/money, so cap how often one admin can ask. */
const RATE_LIMIT_MAX_MESSAGES = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/** Auth secret — never a legitimate target for a CRM question. */
const TABLE_DENYLIST = ['refresh_tokens'];

/**
 * Staff (not customer) personal/contact info. Customer data on `deals` (name, phone, price,
 * payments, ...) is intentionally NOT masked here — that's the core of what this CRM tracks and
 * the whole reason an admin would ask this assistant anything. `payment_adjustments` (staff
 * bonus/penalty amounts) is also intentionally left visible — only admins can use this tool, and
 * admins already manage payroll directly in this CRM, so there's no new exposure.
 */
const COLUMN_DENYLIST: Record<string, string[]> = {
  users: ['passwordHash', 'email', 'phone', 'address', 'photoUrl', 'socialHandle', 'bio']
};

const RUN_SQL_QUERY_TOOL: FunctionDeclaration = {
  name: 'run_sql_query',
  description:
    'Execute a single read-only PostgreSQL SELECT (or WITH ... SELECT) statement against the CRM database ' +
    "and return the resulting rows as JSON. Call this whenever you need real data to answer the admin's question. " +
    'You may call it more than once if you need to refine a query.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description:
          'A single valid PostgreSQL SELECT or WITH...SELECT statement. No trailing semicolon, no write statements, no multiple statements.'
      }
    },
    required: ['query']
  }
};

function buildSystemInstruction(schemaContext: string): string {
  return (
    'You are a data analyst assistant embedded in the MyTeacher Office CRM admin panel. You help admins ' +
    "understand the CRM's Postgres database by answering questions in plain language.\n\n" +
    'You have exactly one tool, "run_sql_query", which runs a single read-only SELECT statement and returns ' +
    'the resulting rows. Use it whenever an answer depends on real data (deal counts, revenue, stage ' +
    'breakdowns, manager performance, lost-deal reasons, etc). Never guess or fabricate numbers — always ' +
    'query for them.\n\n' +
    'Rules for the SQL you write:\n' +
    '- Only SELECT or WITH ... SELECT statements. Never write INSERT/UPDATE/DELETE/DROP/ALTER/TRUNCATE or any other mutating statement.\n' +
    '- One statement only, no trailing semicolon.\n' +
    '- Column names in this database are camelCase (e.g. customerName, createdAt, ownerId) and MUST be ' +
    'double-quoted in every reference (e.g. SELECT "customerName", "createdAt" FROM deals) — Postgres folds ' +
    'unquoted identifiers to lowercase, so an unquoted camelCase column will silently resolve to the wrong ' +
    'name and fail. Table names are already lowercase/snake_case and do not need quoting.\n' +
    '- Never use SELECT *. Avoid selecting large jsonb columns ("comments", "events", "payments", "fullCalls", ' +
    '"stats") in bulk unless the question is specifically about their content — pulling them wholesale gets your result truncated.\n' +
    `- Prefer explicit column lists and reasonable LIMITs; the system enforces a hard cap of ${MAX_RESULT_ROWS} rows regardless.\n` +
    '- Deal stages ("stageId" on the deals table) are free-form ids defined in the stages table — join to it ' +
    'for human-readable stage names rather than guessing what a stageId string means.\n' +
    '- Some tables (like refresh_tokens) and some columns on `users` (passwordHash, email, phone, address, ' +
    'photoUrl, socialHandle, bio — staff personal info) are intentionally not exposed to you and cannot be queried.\n' +
    '- Enum columns are listed as enum(value1|value2|...) — use those exact values in comparisons, never guess.\n\n' +
    'Tool-call discipline (important):\n' +
    '- You get at most a handful of run_sql_query calls per question. Budget them carefully.\n' +
    '- The overwhelming majority of questions need exactly ONE query. Write it to return everything needed in ' +
    'one shot (joins, aggregates, ORDER BY, LIMIT) rather than probing the schema with separate exploratory counts first.\n' +
    '- As soon as a query returns rows that answer the question, STOP calling the tool and give your final text ' +
    'answer immediately. Do not run additional "just to be sure" or "let me also check" queries.\n' +
    '- Only call the tool again if the previous call actually errored, or its rows are clearly insufficient ' +
    '(e.g. empty when you expected data) — never merely to explore unrelated tables or double-check counts.\n\n' +
    `Database schema (table(column: type, ...)):\n${schemaContext}\n\n` +
    "After you have the data you need, answer the admin's question directly and concisely in prose (use a " +
    'short markdown table only if it genuinely helps). Reply in the same language the admin used in their message.'
  );
}

@Injectable()
export class DbAssistantService {
  private readonly logger = new Logger(DbAssistantService.name);
  private readonly ai: GoogleGenAI;
  private readonly model: string;

  private schemaCache: { text: string; expiresAt: number } | null = null;

  /** In-memory, per-process — fine for a single instance; move to Redis if this ever runs horizontally scaled. */
  private readonly rateLimitLog = new Map<number, number[]>();

  constructor(
    @InjectRepository(DbAssistantSessionEntity) private readonly sessionRepository: Repository<DbAssistantSessionEntity>,
    @InjectRepository(DbAssistantMessageEntity) private readonly messageRepository: Repository<DbAssistantMessageEntity>
  ) {
    if (!process.env.GEMINI_API_KEY) {
      throw new BadRequestException('GEMINI_API_KEY sozlanmagan');
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    this.model = process.env.DB_ASSISTANT_GEMINI_MODEL || DEFAULT_MODEL;
  }

  // ─── Sessions ────────────────────────────────────────────────────────────────

  createSession(userId: number): Promise<DbAssistantSessionEntity> {
    return this.sessionRepository.save(this.sessionRepository.create({ userId }));
  }

  listSessions(userId: number): Promise<DbAssistantSessionEntity[]> {
    return this.sessionRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  // ─── Messages ────────────────────────────────────────────────────────────────

  async sendMessage(
    sessionId: number,
    userId: number,
    content: string
  ): Promise<{ userMessage: DbAssistantMessageEntity; reply: DbAssistantMessageEntity }> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId, userId } });
    if (!session) throw new NotFoundException('Sessiya topilmadi');

    this.checkRateLimit(userId);

    const history = await this.messageRepository.find({ where: { sessionId }, order: { createdAt: 'ASC' } });

    const userMessage = await this.messageRepository.save(
      this.messageRepository.create({ sessionId, role: DbAssistantRole.User, content })
    );

    const { text, lastSql } = await this.callGeminiSafely(history, content);

    const reply = await this.messageRepository.save(
      this.messageRepository.create({ sessionId, role: DbAssistantRole.Model, content: text, sql: lastSql ?? null })
    );

    return { userMessage, reply };
  }

  async listMessages(sessionId: number, userId: number): Promise<DbAssistantMessageEntity[]> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId, userId } });
    if (!session) throw new NotFoundException('Sessiya topilmadi');

    return this.messageRepository.find({ where: { sessionId }, order: { createdAt: 'ASC' } });
  }

  // ─── Rate limiting ───────────────────────────────────────────────────────────

  private checkRateLimit(userId: number): void {
    const now = Date.now();
    const recent = (this.rateLimitLog.get(userId) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recent.length >= RATE_LIMIT_MAX_MESSAGES) {
      throw new ForbiddenException(
        `Juda ko'p so'rov yubordingiz. ${Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)} soniyadan so'ng qayta urinib ko'ring.`
      );
    }

    recent.push(now);
    this.rateLimitLog.set(userId, recent);
  }

  // ─── Gemini error handling ───────────────────────────────────────────────────

  private async callGeminiSafely(
    history: DbAssistantMessageEntity[],
    newUserMessage: string
  ): Promise<{ text: string; lastSql?: string }> {
    try {
      return await this.callGemini(history, newUserMessage);
    } catch (err) {
      if (err instanceof ApiError) {
        this.logger.error(`Gemini ApiError (status ${err.status}): ${err.message}`);
        if (err.status === 429) {
          throw new BadRequestException("AI xizmati vaqtincha band (kvota tugagan). Birozdan so'ng qayta urinib ko'ring.");
        }
        throw new BadRequestException("AI xizmatida xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
      }
      throw err;
    }
  }

  // ─── Gemini agent loop ───────────────────────────────────────────────────────

  private async callGemini(
    history: DbAssistantMessageEntity[],
    newUserMessage: string
  ): Promise<{ text: string; lastSql?: string }> {
    const schemaContext = await this.getSchemaContext();
    const systemInstruction = buildSystemInstruction(schemaContext);

    const contents: Content[] = [
      ...history.map((msg) => ({
        role: msg.role === DbAssistantRole.Model ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: newUserMessage }] }
    ];

    let lastSql: string | undefined;
    let lastRows: unknown[] | undefined;

    for (let attempt = 0; attempt < MAX_TOOL_CALLS; attempt++) {
      const isLastAttempt = attempt === MAX_TOOL_CALLS - 1;

      if (isLastAttempt) {
        contents.push({
          role: 'user',
          parts: [
            {
              text: "You have no more run_sql_query calls available. Answer the admin's question now, in prose, using only the data already retrieved above. Do not attempt another tool call."
            }
          ]
        });
      }

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [RUN_SQL_QUERY_TOOL] }],
          toolConfig: isLastAttempt ? { functionCallingConfig: { mode: FunctionCallingConfigMode.NONE } } : undefined,
          maxOutputTokens: 16384
        }
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const functionCallPart = parts.find((part) => part.functionCall);

      if (!functionCallPart?.functionCall) {
        const text = response.text?.trim();
        if (text) return { text, lastSql };

        this.logger.error(
          `Gemini returned empty response. finishReason=${response.candidates?.[0]?.finishReason}, parts=${JSON.stringify(parts)}`
        );
        break;
      }

      if (isLastAttempt) {
        this.logger.warn('Model called a tool on the forced-final round despite toolConfig NONE; falling back');
        break;
      }

      const { name, args } = functionCallPart.functionCall;
      if (name !== 'run_sql_query') {
        throw new BadRequestException(`Kutilmagan tool chaqiruvi: ${name}`);
      }

      contents.push({ role: 'model', parts });

      const rawQuery = args?.query;
      const query = typeof rawQuery === 'string' ? rawQuery : '';
      let functionResult: Record<string, unknown>;
      try {
        const rows = await this.runReadOnlyQuery(query);
        lastSql = query;
        lastRows = rows;

        const serialized = JSON.stringify(rows);
        if (serialized.length > MAX_RESULT_JSON_CHARS) {
          functionResult = {
            output: rows.slice(0, 5),
            truncated: true,
            note: `Result was ${serialized.length} chars for ${rows.length} rows and got truncated to 5. Select fewer/narrower columns (avoid jsonb blobs like comments/events/payments/stats unless truly needed) or aggregate instead of returning raw rows.`
          };
          this.logger.warn(`[attempt ${attempt}] query OK but truncated (${serialized.length} chars): ${query}`);
        } else {
          functionResult = { output: rows };
          this.logger.debug(`[attempt ${attempt}] query OK (${rows.length} rows): ${query}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "So'rovni bajarib bo'lmadi";
        functionResult = { error: message };
        this.logger.warn(`[attempt ${attempt}] query FAILED: ${query} — ${message}`);
      }

      contents.push({ role: 'user', parts: [{ functionResponse: { name: 'run_sql_query', response: functionResult } }] });
    }

    this.logger.warn(`Gave up after ${MAX_TOOL_CALLS} tool-call rounds; falling back to raw last-query data`);

    if (lastRows) {
      return {
        text:
          "AI javobni matn shaklida yakunlay olmadi, lekin so'nggi bajarilgan so'rov natijalari:\n\n```json\n" +
          JSON.stringify(lastRows, null, 2) +
          '\n```',
        lastSql
      };
    }

    throw new BadRequestException("AI so'rovni yakunlay olmadi (juda ko'p urinish)");
  }

  // ─── Safe SQL execution ──────────────────────────────────────────────────────

  private assertReadOnlySelect(sql: string): string {
    const trimmed = sql.trim().replace(/;+\s*$/, '');

    if (!trimmed) throw new BadRequestException("Bo'sh so'rov");
    if (trimmed.includes(';')) throw new BadRequestException('Faqat bitta SQL statement ruxsat etiladi');
    if (!/^(select|with)\b/i.test(trimmed)) throw new BadRequestException("Faqat SELECT so'rovlariga ruxsat berilgan");

    const forbiddenKeywords =
      /\b(insert|update|delete|drop|alter|truncate|grant|revoke|create|execute|call|copy|vacuum|reindex|refresh|listen|notify|do)\b/i;
    if (forbiddenKeywords.test(trimmed)) {
      throw new BadRequestException("So'rovda ruxsat etilmagan kalit so'z bor");
    }

    for (const table of TABLE_DENYLIST) {
      if (new RegExp(`\\b${table}\\b`, 'i').test(trimmed)) {
        throw new BadRequestException(`"${table}" jadvaliga kirish taqiqlangan`);
      }
    }

    return trimmed;
  }

  private async runReadOnlyQuery(sql: string): Promise<unknown[]> {
    const safeSql = this.assertReadOnlySelect(sql);
    const wrapped = `SELECT * FROM (${safeSql}) AS _db_assistant_query LIMIT ${MAX_RESULT_ROWS}`;

    return this.sessionRepository.manager.transaction(async (manager) => {
      await manager.query('SET TRANSACTION READ ONLY');
      await manager.query(`SET LOCAL statement_timeout = '${QUERY_TIMEOUT_MS}ms'`);
      return manager.query(wrapped);
    });
  }

  // ─── Schema introspection ────────────────────────────────────────────────────

  private async getSchemaContext(): Promise<string> {
    if (this.schemaCache && this.schemaCache.expiresAt > Date.now()) {
      return this.schemaCache.text;
    }

    const [rows, enumRows] = await Promise.all([
      this.sessionRepository.manager.query<Array<{ table_name: string; column_name: string; data_type: string; udt_name: string }>>(
        `SELECT table_name, column_name, data_type, udt_name
         FROM information_schema.columns
         WHERE table_schema = 'public'
         ORDER BY table_name, ordinal_position`
      ),
      this.sessionRepository.manager.query<Array<{ typname: string; labels: string }>>(
        `SELECT t.typname, string_agg(e.enumlabel, '|' ORDER BY e.enumsortorder) AS labels
         FROM pg_type t
         JOIN pg_enum e ON t.oid = e.enumtypid
         GROUP BY t.typname`
      )
    ]);

    const enumLabelsByTypeName = new Map(enumRows.map((row) => [row.typname, row.labels]));

    const resolveType = (dataType: string, udtName: string): string => {
      if (dataType === 'USER-DEFINED') {
        const labels = enumLabelsByTypeName.get(udtName);
        return labels ? `enum(${labels})` : udtName;
      }
      if (dataType === 'ARRAY') {
        return `${udtName.replace(/^_/, '')}[]`;
      }
      return dataType;
    };

    const byTable = new Map<string, string[]>();
    for (const row of rows) {
      if (TABLE_DENYLIST.includes(row.table_name)) continue;
      if (COLUMN_DENYLIST[row.table_name]?.includes(row.column_name)) continue;

      const columns = byTable.get(row.table_name) ?? [];
      columns.push(`${row.column_name}: ${resolveType(row.data_type, row.udt_name)}`);
      byTable.set(row.table_name, columns);
    }

    const text = [...byTable.entries()].map(([table, columns]) => `${table}(${columns.join(', ')})`).join('\n');

    this.schemaCache = { text, expiresAt: Date.now() + SCHEMA_CACHE_TTL_MS };
    return text;
  }
}
