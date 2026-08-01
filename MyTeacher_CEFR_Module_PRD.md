# MyTeacher — CEFR Tayyorlov Moduli
## To'liq Texnik Topshiriq (PRD / TZ) — v1.0

**Hujjat egasi:** Product Management & System Architecture
**Sana:** 2026-07-28
**Status:** Draft for engineering kickoff
**Auditoriya:** Frontend, Backend, AI/ML, UI/UX, QA, DevOps

---

## 0. Executive Summary (Qisqa mazmun)

MyTeacher CEFR moduli — bu MyTeacher mobil ilovasi ichida **WebView** orqali ochiladigan, mustaqil deploy qilinadigan **Web-app** (PWA). Maqsad: foydalanuvchini **A1 → A2 → B1 → B2 → C1** darajalari bo'ylab bosqichma-bosqich, gamifikatsiyalashgan va AI bilan boyitilgan (Speaking/Writing) tarzda olib chiqish.

**North Star Metric:** Weekly Active Learners (WAL) — haftada kamida 3 marta dars tugatgan foydalanuvchilar ulushi.

**Asosiy mahsulot ustunlari:**
1. **Micro-learning** — 5–8 daqiqalik session-lar (dars = "unit" ichidagi "lesson").
2. **Gamification Engine** — Streak, XP, Level, Heart/Energy, League, Badges.
3. **CEFR-aligned curriculum** — har daraja aniq can-do descriptor'lar bilan.
4. **AI Practice** — Speaking (pronunciation + fluency scoring) va Writing (grammatik/leksik feedback).
5. **Mentor layer** — nazoratchi mentor progress'ni ko'radi va individual feedback qoldiradi.

**Muvaffaqiyat mezonlari (birinchi 90 kun):**
- D1 retention ≥ 45%, D7 ≥ 25%, D30 ≥ 12%.
- Median session duration ≥ 6 daqiqa.
- Placement test tugatish darajasi ≥ 80%.
- Speaking practice bir foydalanuvchida haftasiga ≥ 2 marta.

---

## 1. TECHNICAL & ARCHITECTURE REQUIREMENTS

### 1.1 Umumiy arxitektura

```
┌─────────────────────────────────────────────────┐
│  MyTeacher Mobile App (Native iOS / Android)      │
│  ┌───────────────────────────────────────────┐    │
│  │  WebView (CEFR Web-app / PWA)              │    │
│  │  - React (Vite) SPA                        │    │
│  │  - Service Worker + Cache (offline)        │    │
│  │  - IndexedDB (local progress queue)        │    │
│  └───────────────────────────────────────────┘    │
│        ▲ JS Bridge (postMessage)                   │
└────────┼───────────────────────────────────────────┘
         │ HTTPS + JWT
         ▼
┌─────────────────────────────────────────────────┐
│  CEFR Backend (NestJS)                            │
│  - Auth (token exchange, refresh)                 │
│  - Curriculum service                             │
│  - Progress / SRS engine                          │
│  - Gamification engine                            │
│  - Leaderboard (Redis sorted sets)                │
│  - AI Orchestration (Speaking/Writing proxy)      │
│  - Mentor service                                 │
└──────────┬──────────────────────┬─────────────────┘
           ▼                      ▼
     PostgreSQL             AI Providers
     (core data)            - STT / Pronunciation
     Redis                  - LLM (Writing/Grammar)
     (leaderboard, cache)   - TTS (Listening audio)
     Object Storage
     (audio, images)
```

**Tech stack tavsiyasi:**
- **Frontend:** React 18 + Vite + TypeScript, Zustand (state), TanStack Query (server state/cache), Framer Motion (animatsiya), Workbox (SW), IndexedDB via `idb`.
- **Backend:** NestJS (mavjud MyTeacher arxitekturasiga mos — feature-based clean architecture), PostgreSQL + TypeORM, Redis.
- **AI:** STT/pronunciation uchun tashqi API (masalan Azure Pronunciation Assessment yoki ekvivalent), LLM (Claude/OpenAI) Writing/Grammar uchun, TTS listening audio uchun (yoki oldindan generatsiya qilingan static audio).

> **Design tamoyili:** CEFR moduli **alohida repo va alohida backend service** sifatida quriladi (webinar-app pattern'iga o'xshab). MyTeacher CRM/office backend'iga tegmaydi; faqat auth va user identity darajasida integratsiya qiladi.

### 1.2 WebView optimizatsiyasi

**Loading budjeti (Performance Budget):**
| Metrika | Maqsad (3G Fast / mid-range Android) |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Time to Interactive (TTI) | < 3.5s |
| Initial JS bundle (gzip) | < 180 KB |
| Lesson interactive assets | lazy-load, < 300 KB/lesson |
| Lighthouse Performance | ≥ 90 |

**Talablar:**
1. **Code splitting** — route va lesson-type bo'yicha dynamic import (`React.lazy`). Placement test, Speaking, Writing modullari alohida chunk.
2. **PWA / Service Worker (Workbox):**
   - `app-shell` — cache-first (HTML skeleton, JS/CSS, font, iconlar).
   - Lesson content JSON — stale-while-revalidate.
   - Audio/rasm assetlari — cache-first + LRU quota (masalan 50 MB limit).
   - Offline fallback sahifasi.
3. **Asset strategiyasi:** rasm WebP/AVIF, audio Opus/AAC (past bitrate), SVG iconlar inline sprite. Font subset (faqat Latin + kerakli belgilar).
4. **WebView-specific:**
   - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (notch/safe-area support).
   - `-webkit-tap-highlight-color: transparent`, `overscroll-behavior: contain` (bounce'ni o'chirish).
   - `touch-action: manipulation` (300ms tap delay yo'q).
   - Hardware-accelerated animatsiya (`transform`, `opacity` only — layout thrashing yo'q).
   - Prefetch: keyingi lesson kontenti current lesson yakunlanganda oldindan yuklanadi.
5. **Cold start tezlashtirish:** WebView native app ochilganda **pre-warm** qilinadi (native tomonda background'da WebView instance yaratiladi va app-shell yuklanadi), foydalanuvchi modulni bosganda deyarli darhol ko'rinadi.

**Acceptance criteria:**
- [ ] Mid-range Android (Redmi 9 ekvivalenti) da cold start → interaktiv holatga < 4s.
- [ ] Internet uzilganda oxirgi ochilgan lesson va cache'dagi kontent ochiladi.
- [ ] Lighthouse PWA audit'ida "installable" + offline-ready.

### 1.3 Auth & Token Pass-through

**Muammo:** Foydalanuvchi MyTeacher native ilovasida allaqachon login qilgan. WebView'da qayta login qildirish **taqiqlanadi** (UX buziladi). Sessiya uzluksiz o'tishi kerak.

**Yechim — Native → WebView token exchange (eng xavfsiz pattern):**

1. Native app CEFR modulni ochishdan oldin o'zining backend'idan **qisqa muddatli, bir martalik `exchange_code`** (yoki `id_token`) oladi (MyTeacher auth service'dan).
2. Native app WebView'ni ochadi va bu code'ni **JS Bridge orqali** (URL query-string EMAS — memory/log leak xavfi) uzatadi:
   ```js
   // Native → WebView
   window.MyTeacherBridge.onAuthReady({ exchangeCode, locale, theme, platform });
   ```
   iOS: `WKScriptMessageHandler`, Android: `@JavascriptInterface` + `evaluateJavascript`.
3. WebView bu `exchangeCode`ni CEFR backend'ga POST qiladi → CEFR backend uni MyTeacher auth service bilan tekshiradi (server-to-server) va o'zining **access JWT (qisqa, ~15 min) + refresh token (httpOnly, secure cookie yoki secure storage)** ni beradi.
4. Access token expire bo'lganda WebView `/api/auth/refresh` orqali silent refresh qiladi.

**Xavfsizlik talablari:**
- JWT `exp` ≤ 15 min, refresh token rotation (har refresh'da yangi refresh, eskisi bekor).
- `exchange_code` bir martalik, TTL ≤ 60s, faqat bir user'ga bog'langan.
- Token'lar **hech qachon URL query yoki localStorage'da ochiq** saqlanmaydi (XSS xavfi). Access token — memory'da; refresh — httpOnly cookie yoki native secure storage (Keychain/Keystore) orqali.
- CEFR backend va MyTeacher auth o'rtasida shared signing key / JWKS endpoint.
- CORS: faqat WebView origin va approved domainlar.

**Session-lost fallback:** Agar token o'tkazish uzilsa yoki bridge mavjud bo'lmasa (masalan brauzerda ochilsa) — graceful "MyTeacher orqali kiring" ekrani ko'rsatiladi.

**Acceptance criteria:**
- [ ] Foydalanuvchi native app'da login bo'lsa, WebView'da qo'shimcha login **yo'q**.
- [ ] Token URL/query/log'larda ko'rinmaydi (audit).
- [ ] Refresh muvaffaqiyatsiz bo'lsa, foydalanuvchi ma'lumoti yo'qolmaydi (offline queue saqlanadi).

### 1.4 Local State Management & Offline Progress Sync

**Talab:** Foydalanuvchi metro/liftda internetsiz ham dars bajarishi va keyin sync bo'lishi kerak.

**Arxitektura — Offline-first progress queue:**
1. Har bir foydalanuvchi harakati (javob, XP olish, lesson tugatish) — avval **IndexedDB'dagi lokal `event_queue`** ga yoziladi (append-only, `client_event_id` UUID bilan).
2. Online bo'lganda background sync (Workbox Background Sync yoki custom) queue'ni backend'ga **batch** yuboradi.
3. Backend **idempotent** qabul qiladi (`client_event_id` bo'yicha dedupe) — takroriy yuborishda XP ikki marta berilmaydi.
4. Server javob sifatida **canonical state** qaytaradi (server = source of truth); konflikt bo'lsa **server wins**, lekin XP/streak kabi additiv qiymatlar server tomonda hisoblab qo'yiladi (client faqat event yuboradi, XP miqdorini o'zi hal qilmaydi — cheating oldini olish).

**Konflikt qoidalari:**
- Progress (lesson complete) — union (ikkalasida ham complete bo'lsa complete).
- Streak — server timezone va event timestamp'lariga qarab qayta hisoblanadi.
- SRS review holati — oxirgi `reviewed_at` yutadi.

**Xavfsizlik / anti-cheat:** XP, heart, level, streak **hech qachon** client'da yakuniy hisoblanmaydi. Client faqat "shu lesson'ni shu javoblar bilan tugatdim" degan event yuboradi; server validatsiya qiladi (masalan lesson unlock bo'lganmi, timestamp real mi, javoblar to'g'rimi).

**Acceptance criteria:**
- [ ] Airplane mode'da lesson tugatilsa, online bo'lganda progress yo'qolmasdan sync bo'ladi.
- [ ] Bir event 2 marta yuborilsa, XP faqat 1 marta qo'shiladi (idempotency test).
- [ ] Client DevTools orqali XP'ni o'zgartirsa, server rad etadi.

---

## 2. GAMIFICATION & ENGAGEMENT ENGINE

> Falsafa: **Motivatsiya loop** = Trigger → Action → Variable Reward → Investment (Hook model). Har session foydalanuvchida "yana bir dars" istagini uyg'otishi kerak.

### 2.1 Skill Tree / Learning Path (Interaktiv xarita)

- **Vizual model:** vertikal/serpantin (ilon) yo'l — Duolingo-style "path", A1 pastdan C1 tepaga. Har CEFR daraja = **rangli seksiya (zone)**; har zone ichida **Unit**'lar; har Unit ichida **5–7 Lesson node**.
- **Node holatlari:** `locked` (kulrang, qulf), `available` (yorqin, pulsatsiya animatsiyasi), `in_progress` (qisman to'ldirilgan ring), `completed` (yulduzlar 0–3), `mastered` (oltin/legendary).
- **Checkpoint node** — har Unit oxirida (kichik test), har CEFR daraja oxirida **Level Certification Test**.
- **Interaktivlik:** node bosilganda — bottom sheet ochiladi (lesson turi, XP reward, "Start" tugmasi). Path scroll bo'lganda parallax fon (daraja rangi bilan).
- **Progress vizualizatsiyasi:** tepada current CEFR badge + umumiy progress bar (masalan "B1 — 42%").

**Acceptance criteria:**
- [ ] Path 60fps scroll qiladi (past qurilmada ham).
- [ ] Locked node bosilsa — unlock sharti tushuntiriladi ("Avvalgi darsni tugating").
- [ ] Har node holati backend state bilan sinxron.

### 2.2 Streak, XP, Level-up, Heart/Energy

**XP (Experience Points):**
- Har to'g'ri javob: bazaviy XP (masalan +10).
- Lesson tugatish bonusi: +20–50 (turi/qiyinligiga qarab).
- Perfect lesson (0 xato): +bonus.
- Speed bonus / combo (ketma-ket to'g'ri javoblar): multiplikator.
- **Daily XP goal:** foydalanuvchi tanlaydi (Casual 20 / Regular 50 / Serious 100 / Intense 200 XP/kun) — onboarding'da.

**Level (umumiy foydalanuvchi darajasi — CEFR'dan alohida):** XP jamg'arilib "Level 1, 2, 3…" ochiladi. Level-up = katta vizual celebration (confetti + haptic + ovoz). Bu CEFR daraja EMAS — meta-progression.

**Streak (kunlik ketma-ketlik):**
- Har kalendar kun (foydalanuvchi timezone'ida) kamida 1 lesson yoki daily goal bajarilsa +1 kun.
- **Streak freeze** — 1–2 ta "muzlatish" (kun o'tkazib yuborilsa streak saqlanadi), do'kondan XP/gem'ga sotib olinadi.
- **Streak milestones:** 3, 7, 14, 30, 100, 365 kun — badge + reward.
- **Reminder:** kechqurun push (native app orqali) "Streak'ingiz xavf ostida!".
- Streak buzilsa — "Streak Repair" taklifi (kichik to'lov/gem, 1 marta).

**Heart / Energy tizimi (xatolar iqtisodi):**
- Foydalanuvchida **5 heart** (default). Speaking/Writing kabi AI mashqlarida heart ishlatilmasligi mumkin (alohida sozlanadi).
- Har noto'g'ri javob → **-1 heart** (faqat "test/challenge" rejimida; "practice/review" rejimida heart ketmaydi — bu o'rganishni rag'batlantiradi).
- Heart 0 bo'lsa → yangi test lesson boshlab bo'lmaydi. Tiklash yo'llari:
  1. **Vaqt bilan regen** — har N daqiqada +1 (masalan 30 min/heart).
  2. **Practice/Review** qilib heart qaytarish (eski lessonni takrorlash).
  3. **Gem** bilan to'ldirish.
  4. **Unlimited hearts** (premium/subscription) — monetizatsiya nuqtasi.
- **Muhim UX balansi:** heart tizimi **frustratsiya** keltirmasligi kerak. A1 boshlang'ichlarda yumshoqroq (ko'proq heart yoki tezroq regen). A/B test bilan sozlanadi.

**Gem / Coin (virtual valyuta):** lesson, streak, achievement'lardan olinadi; streak freeze, heart refill, kiyim/avatar, "double XP" boost sotib olinadi.

**Data model (soddalashtirilgan):**
```
UserGameState {
  userId, totalXp, level, currentStreak, longestStreak,
  lastActiveDate, hearts, maxHearts, heartsRegenAt,
  gems, streakFreezes, dailyGoal, dailyXpToday, timezone
}
```

**Acceptance criteria:**
- [ ] XP/level/streak server tomonda hisoblanadi va client bilan mos.
- [ ] Timezone chegarasida streak to'g'ri ishlaydi (00:00 test).
- [ ] Heart regen aniq vaqtda ishlaydi (offline'da ham to'g'ri hisoblanadi).

### 2.3 Leaderboard (Haftalik liga) va Badges

**League tizimi (Duolingo-style tiers):**
- Ligalar: Bronze → Silver → Gold → Sapphire → Ruby → Emerald → Diamond (7 tier).
- Har hafta foydalanuvchi **~30 kishilik guruh**ga tasodifiy joylanadi (XP bo'yicha guruhlash — cheating oldini olish uchun shu XP-band).
- Hafta davomida jamlangan **weekly XP** bo'yicha reyting.
- Hafta oxirida: yuqori N (masalan top-7) → keyingi ligaga ko'tariladi; pastki M → tushadi; o'rtadagilar qoladi.
- **Real-time-ish** yangilanish (Redis sorted set `ZADD`, `ZREVRANGE`).
- Anti-abuse: yangi/bot akkauntlar alohida band, XP cap/kun, anomaliya detektsiya.

**Badges / Achievements / Milestones:**
- Kategoriyalar: **Streak** (7/30/100 kun), **Skill** (100 ta so'z o'rgandi), **Perfectionist** (10 perfect lesson), **Speaking** (50 ta AI speaking), **Comeback** (streak tiklandi), **Level** (CEFR A2 tugatildi) va h.k.
- Har badge: locked (silhouette) → unlocked (rangli + celebration). Progress-based badge'larda progress ko'rsatkichi ("7/10").
- Profil sahifasida badge kolleksiyasi (ijtimoiy proof / investment).

**Acceptance criteria:**
- [ ] Leaderboard 30 kishida < 200ms yuklanadi.
- [ ] Hafta yakunida promotion/demotion cron aniq ishlaydi.
- [ ] Badge unlock event real vaqtda triggerlanadi.

### 2.4 Micro-learning (5–8 daqiqalik session)

- **Lesson = 1 session**, 8–15 ta exercise (turlar aralashmasi), o'rtacha **5–8 daqiqa**.
- Har lesson boshida kutilayotgan vaqt ("~6 min") ko'rsatiladi.
- Lesson ichida **progress bar** (nechta savol qoldi) — completion motivatsiyasi.
- **Session end screen:** XP olindi, streak holati, "Continue" — variable reward + darhol keyingisiga o'tish taklifi (loop'ni davom ettirish).
- **Interrupt-safe:** lesson yarmida chiqib ketsa, progress saqlanadi (resume yoki restart tanlovi).

**Acceptance criteria:**
- [ ] Median lesson tugatish vaqti 5–8 min oralig'ida (analytics).
- [ ] Lesson yarmida app yopilsa, qайta ochilganda holat saqlangan.

### 2.5 Immediate Feedback Loop

Har javobda — **darhol, multi-sensor** feedback:
- **Vizual:** to'g'ri = yashil highlight + ✓ + micro-animatsiya (scale/bounce); noto'g'ri = qizil shake + ✗ + to'g'ri javob ko'rsatiladi.
- **Audio:** to'g'ri/noto'g'ri uchun qisqa distinctive tovushlar (sozlanadigan, mute qilinadigan).
- **Haptic:** `navigator.vibrate()` yoki native bridge orqali (to'g'ri = yengil tap, noto'g'ri = double buzz). WebView cheklovlari uchun bridge fallback.
- **Motivatsion mikrotekst:** "Zo'r!", "Ajoyib!", combo'da "3 ketma-ket! 🔥".
- **Explanation on error:** noto'g'ri javobda qisqa grammatik/leksik izoh (nega noto'g'ri).

**Latency talabi:** feedback javob berilgandan < 100ms ichida (perceived instant).

**Acceptance criteria:**
- [ ] Har javob turi uchun to'g'ri/noto'g'ri feedback < 100ms.
- [ ] Ovoz/haptik sozlamalardan o'chirilishi mumkin.
- [ ] WebView'da haptik ishlamasa, graceful degrade.

### 2.6 Spaced Repetition System (SRS)

**Algoritm:** SM-2 (SuperMemo) asosidagi modifikatsiya (yoki FSRS — yangiroq, aniqroq). Har o'rganilgan **so'z / grammatik pattern** = "review item".

**SM-2 modeli (item):**
```
SrsItem {
  userId, itemId (word/grammar), easeFactor (default 2.5),
  intervalDays, repetitions, dueAt, lastReviewedAt, lapses
}
```
- Har review'da foydalanuvchi javob sifatiga qarab (0–5 grade yoki soddalashtirilgan "Again / Hard / Good / Easy"):
  - To'g'ri → interval kengayadi (`interval * easeFactor`), easeFactor moslashadi.
  - Noto'g'ri → interval reset (yoki "lapse"), item qayta ko'proq ko'rsatiladi.
- **Due items** har kun "Review / Kuchaytirish" bo'limida yoki lesson boshida "warm-up" sifatida chiqadi.
- **Interleaving:** yangi material + due review aralashtiriladi (long-term retention).

**UX:** "Bugun 12 ta so'z takrorlash kerak" — alohida daily review CTA + notification. Flashcard va contextual recall (jumlada ishlatish) formatida.

**Acceptance criteria:**
- [ ] Item interval SM-2/FSRS formulasiga mos hisoblanadi (unit test).
- [ ] Due item'lar to'g'ri sanada chiqadi (timezone-aware).
- [ ] Review offline bajarilib, sync bo'ladi.

---

## 3. CEFR CURRICULUM & LESSON STRUCTURE

### 3.1 Daraja tuzilmasi va Can-Do descriptor'lar

Har daraja **CEFR Global Scale** va **Can-Do statement**larга bog'lanadi (o'lchanadigan natijalar):

| Daraja | Fokus (qisqacha) | Namuna Can-Do | Taxminiy hajm |
|---|---|---|---|
| **A1** | Basic survival English | O'zini tanishtirish, oddiy shaxsiy savollar, tanish so'zlar | ~8 Unit, ~500 so'z |
| **A2** | Elementary | Kundalik vaziyatlar, oddiy o'tmish/kelasi zamon, xarid/yo'nalish | ~10 Unit, ~1000 so'z |
| **B1** | Intermediate (Threshold) | Sayohat, fikr bildirish, tajriba/orzu haqida gapirish | ~12 Unit, ~2000 so'z |
| **B2** | Upper-Intermediate (Vantage) | Abstrakt mavzular, argument, ravon muloqot | ~14 Unit, ~4000 so'z |
| **C1** | Advanced (Effective proficiency) | Murakkab matn, nozik ma'no, akademik/professional til | ~14 Unit, ~6000+ so'z |

> Har Unit boshida **learning objectives** (bu Unit oxirida foydalanuvchi nima qila oladi) aniq yoziladi. Kontent metodist tomonidan CEFR companion volume'ga muvofiq yaratiladi.

**Content structure hierarchy:**
```
Level (A1..C1)
 └─ Unit (thematic, e.g. "Shopping")
     └─ Lesson (session, 5–8 min)
         └─ Exercise (8–15 items, mixed skills)
```

### 3.2 Skill'lar nisbati (har lesson ichida)

Har lesson **aralash skill** (integrated approach), lekin daraja bo'yicha og'irlik o'zgaradi:

| Skill | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| Vocabulary | 30% | 25% | 20% | 15% | 15% |
| Grammar | 25% | 25% | 20% | 20% | 15% |
| Listening | 20% | 20% | 20% | 20% | 20% |
| Reading | 15% | 15% | 20% | 20% | 25% |
| AI Speaking | 5% | 10% | 10% | 12% | 12% |
| AI Writing | 5% | 5% | 10% | 13% | 13% |

> Nisbatlar konfiguratsiyalanadi (curriculum config), A/B test bilan sozlanadi. Boshlang'ich darajada speaking/writing kamroq (psixologik bosim past), yuqorida ko'proq produktiv skill.

### 3.3 Lock & Unlock Logic

**Unlock qoidalari:**
- **Lesson N+1** ochiladi ↔ Lesson N ≥ **passing score** (default 60%, "test" node'larda 80%).
- **Unit checkpoint** ochiladi ↔ Unit ichidagi barcha lesson tugatilgan.
- **Keyingi CEFR daraja** ochiladi ↔ joriy daraja **Certification Test** ≥ 80% (yoki placement bilan "skip").
- **Star system:** lesson 1–3 yulduz oladi (score + hearts qolganiga qarab). "Mastered" holati review orqali olinadi.

**Test turlari:**
1. **Lesson quiz** — lesson ichidagi mashqlar.
2. **Unit checkpoint** — Unit materialini jamlagan test (score-gated).
3. **Level Certification Test** — daraja yakuni; muvaffaqiyatli bo'lsa CEFR badge + certificate (shareable).

**Retry / mastery loop:** past ball → "Retry" yoki "Review" taklifi; passing'gacha keyingisi qulf. Frustratsiyani kamaytirish uchun 2-urinishda hint/scaffolding ko'proq.

**Acceptance criteria:**
- [ ] Passing score'dan past bo'lsa keyingi node qulf.
- [ ] Certification o'tsa CEFR badge beriladi va path'da yangi zone ochiladi.
- [ ] Placement test bilan boshlang'ich unlock to'g'ri joylanadi (3.6-bo'lim).

---

## 4. INTERACTIVE EXERCISE TYPES

Har exercise type — alohida, qайta ishlatiladigan React komponent. Umumiy interfeys:
```ts
interface ExerciseProps {
  data: ExerciseData;           // savol kontenti
  onAnswer: (r: AnswerResult) => void;  // {correct, score, userInput, timeMs}
  mode: 'test' | 'practice' | 'review';
}
```

### 4.1 Klassik interaktiv turlar

| Type | Tavsif | Skill | UX talablari |
|---|---|---|---|
| **Multiple choice** | 1 to'g'ri javob | Grammar/Vocab/Reading | 2–4 variant, katta tap target (≥44px) |
| **Fill-in-the-blank** | Bo'sh joyni to'ldirish | Grammar/Vocab | Word bank yoki keyboard input |
| **Drag & Drop** | So'zlarni joylashtirish | Vocab/Grammar | Smooth drag, snap, haptik on drop |
| **Sentence builder** | So'z bloklaridan jumla | Grammar | Tap-to-add + reorder, drag reorder |
| **Matching pairs** | So'z↔tarjima/rasm | Vocab | 2 ustun, tap-tap yoki drag, match anim |
| **Audio shadowing** | Eshitib takrorlash | Listening/Speaking | Play → record → compare (AI 4.2) |
| **Listening comprehension** | Audio + savol | Listening | Audio player, replay, speed control |
| **Interactive flashcards** | So'z kartasi (flip) | Vocab/SRS | Flip anim, swipe (know/don't know) |
| **Word ordering / tap** | So'zlarni tartiblash | Grammar | Tap tokens in order |
| **Image selection** | Rasmga mos so'z | Vocab (A1-A2) | Rasm grid, tap |
| **Dictation** | Eshitib yozish | Listening/Writing | Audio → text input, fuzzy match |

**Umumiy UX talablari:**
- Barcha touch target ≥ 44×44px.
- Har type uchun **skeleton loader** va **error state**.
- Klaviatura ochilganda layout siljimaydi (`viewport-fit`, safe-area).
- Animatsiya `prefers-reduced-motion` ni hurmat qiladi.
- Har type accessible (screen reader label, kontrast AA).

### 4.2 AI Speaking Practice

**Maqsad:** foydalanuvchi ovozini yozib, **talaffuz (pronunciation)**, **ravonlik (fluency)** va **grammatik** tahlil qilib, real-time'ga yaqin feedback berish.

**Flow:**
1. Ekranda prompt (jumla/savol) + reference audio (native TTS/inson ovozi).
2. Foydalanuvchi **mikrofon** tugmasini bosib gapiradi (waveform vizualizatsiya real-time).
3. Audio backend'ga → **STT + Pronunciation Assessment API** (masalan Azure Pronunciation Assessment yoki ekvivalent).
4. Natija:
   - **Overall score** (0–100).
   - **Word-level** rang kodlash: yashil (yaxshi) / sariq (o'rtacha) / qizil (yomon talaffuz).
   - **Phoneme-level** (ilg'or darajada) — qaysi tovush noto'g'ri.
   - **Fluency** (pauzalar, tezlik), **Completeness** (barcha so'z aytildimi).
5. Word bosilsa → to'g'ri talaffuz audio + IPA + og'iz/til pozitsiyasi maslahati.
6. "Retry" — qayta urinish; progress saqlanadi.

**UI/UX talablari:**
- Katta, aniq record tugma (holatlar: idle / recording / processing / result).
- Real-time waveform yoki amplitude indikatori (gapirayotganini his qilsin).
- Processing < 3s (aks holda "Tahlil qilinmoqda…" animatsiya).
- Mikrofon ruxsati graceful so'raladi; rad etilsa fallback (yozsiz mashq).
- Word-level feedback bosiladigan va tushunarli (rang + audio).
- **Privacy:** ovoz yozuvlari default saqlanmaydi (yoki foydalanuvchi roziligi bilan, mentor ko'rishi uchun); retention siyosati aniq.

**Backend:** Speaking service audio'ni oladi → STT/pronunciation provider'ga proxy qiladi → normalizatsiya qilingan scoring qaytaradi. Rate limiting + cost control (AI qimmat).

**Acceptance criteria:**
- [ ] Word-level talaffuz scoring ko'rsatiladi va bosiladigan.
- [ ] Mikrofon ruxsati rad etilsa app crash bo'lmaydi.
- [ ] Natija < 3s (p95) qaytadi.
- [ ] Ovoz retention siyosati amalga oshirilgan.

### 4.3 AI Writing Practice

**Maqsad:** insho/matn/javoblarni **grammatik, leksik, kogerentlik** bo'yicha tahlil qilib, tuzatish va tushuntirish berish (LLM asosida).

**Flow:**
1. Prompt/topic (daraja-mos, masalan A2: "Describe your family", B2: opinion essay).
2. Word-count target ko'rsatiladi (masalan 40–60 so'z).
3. Foydalanuvchi yozadi (textarea, live word count).
4. "Check" → backend LLM'ga (structured prompt) → tahlil.
5. **Feedback UI:**
   - **Inline annotations** — xato so'z/ibora ustiga tap → tuzatish + izoh (grammar/spelling/word choice/style).
   - **Rubric scoring** — CEFR criteriaga mos: Grammar, Vocabulary, Coherence, Task achievement (0–5 har biri).
   - **Corrected version** (diff ko'rinishida — original vs tuzatilgan).
   - **Suggestions** — darajani oshirish uchun ("Bu so'z o'rniga...").
6. Xatolar SRS'ga item sifatida qo'shilishi mumkin (takroriy xatolar review'ga).

**LLM talablari:**
- Structured output (JSON) — parse qilinadigan (annotations, scores, corrected_text).
- Daraja-aware (A1 uchun oddiy izoh, C1 uchun nozik stilistik).
- Til: izohlar **o'zbek tilida** (Latin) yoki ikki tilda (sozlanadi) — foydalanuvchi tushunishi uchun.
- Guardrails: prompt injection'dan himoya, faqat til-o'rgatish domeni.
- Cost/rate control, caching (bir xil matn qayta yuborilmaydi).

**Acceptance criteria:**
- [ ] Inline annotation bosilsa izoh + tuzatish chiqadi.
- [ ] Rubric scoring CEFR mezonlariga mos.
- [ ] LLM javobi structured va UI to'g'ri render qiladi.
- [ ] Takroriy grammatik xato SRS'ga qo'shiladi.

---

## 5. MENTOR INTEGRATION & PROGRESS DASHBOARD

### 5.1 Student Dashboard

Foydalanuvchi o'z o'sishini ko'radi:
- **CEFR Radar chart** — 6 skill (Grammar, Vocab, Listening, Reading, Speaking, Writing) bo'yicha joriy daraja (o'rgimchak diagramma).
- **Progress dinamikasi** — vaqt bo'yicha XP/level/mastery line chart (haftalik/oylik).
- **Metrics tiles:** joriy CEFR daraja, umumiy XP, streak, o'rganilgan so'zlar soni, tugatilgan lessonlar, o'rtacha lesson score.
- **Weekly summary:** shu hafta nechta dars, qancha vaqt, eng kuchli/zaif skill.
- **Next milestone** — keyingi maqsad ("B1 gacha 3 Unit qoldi").
- **SRS holati** — bugun takrorlash kerak bo'lgan so'zlar.

**Design:** mobil-first, chart'lar sodda va tez (SVG/canvas, og'ir kutubxonasiz — masalan lightweight chart). Dark/light mode.

**Acceptance criteria:**
- [ ] Radar chart 6 skill'ni real ma'lumot bilan ko'rsatadi.
- [ ] Dashboard < 1.5s yuklanadi (cached summary).
- [ ] Metrikalar backend bilan mos.

### 5.2 Mentor / Nazoratchi Interfeysi

> Mavjud MyTeacher CRM/office (`index.html` + NestJS) mentor rolini biladi. CEFR mentor view **shu ekotizimga bog'lanadi** (mentor CRM'da yoki alohida mentor web-panelida CEFR progress'ni ko'radi).

**Mentor imkoniyatlari:**
1. **Student list** — o'ziga biriktirilgan o'quvchilar, har biri uchun: joriy daraja, streak, oxirgi faollik, "e'tibor kerak" flag (masalan 3 kun kirmagan / ball tushgan).
2. **Student detail** — bitta o'quvchi:
   - Progress timeline (qaysi lesson qachon, qanday ball).
   - **Xatolar ko'rinishi** — eng ko'p qaynagan grammatik/leksik xatolar (aggregate).
   - **Speaking submissions** — o'quvchi ovoz yozuvlari (rozilik bilan) + AI score, mentor tinglaydi.
   - **Writing submissions** — insholar + AI feedback, mentor **qo'lda feedback** qo'shadi (inline yoki umumiy izoh).
3. **Individual feedback** — mentor matn/audio feedback qoldiradi → o'quvchiga notification (native push orqali) va dashboard'da ko'rinadi.
4. **Assignment** (ixtiyoriy kelajakda) — mentor qo'shimcha lesson/topshiriq biriktiradi.
5. **Analytics** — guruh darajasida progress, retention, zaif mavzular.

**Ruxsatlar (RBAC):** mentor faqat o'ziga biriktirilgan o'quvchilarni ko'radi. Admin — hammani. Ovoz/yozuv ko'rish faqat o'quvchi roziligi bilan. Audit log.

**Integratsiya nuqtalari (API):**
- `GET /mentor/students` — biriktirilgan o'quvchilar.
- `GET /mentor/students/:id/progress` — batafsil progress.
- `GET /mentor/students/:id/submissions?type=speaking|writing`
- `POST /mentor/students/:id/feedback` — feedback qoldirish.

**Acceptance criteria:**
- [ ] Mentor faqat o'z o'quvchilarini ko'radi (RBAC test).
- [ ] Mentor writing/speaking submission'ga feedback qoldira oladi, o'quvchi oladi.
- [ ] "E'tibor kerak" flag mantiqiy triggerlanadi.
- [ ] Ovoz/yozuv rozilik bo'lmasa ko'rinmaydi.

---

## 6. ACCEPTANCE CRITERIA & USER FLOWS

### 6.1 Onboarding & Placement Test Flow

**Flow:**
```
WebView ochiladi (token pass-through)
  → Welcome / value prop (1-2 ekran, skip mumkin)
  → "Maqsadingiz?" (imtihon / ish / sayohat / umumiy) — personalizatsiya
  → Daily goal tanlash (Casual/Regular/Serious/Intense)
  → "Darajangizni bilasizmi?"
       ├─ "Yo'q, boshdan" → A1 dan boshlaydi
       └─ "Ha / tekshirish" → Placement Test
  → Placement Test (adaptive)
  → Natija: CEFR daraja + tavsiya etilgan boshlanish nuqtasi (path'da)
  → First lesson (darhol qiymat — "aha moment")
```

**Placement Test (adaptive):**
- **Adaptive/CAT logic:** oson savoldan boshlanadi; to'g'ri → qiyinroq, noto'g'ri → osonroq (IRT-lite yoki band-based).
- 15–25 savol, ~10–12 daqiqa, mixed skill (grammar, vocab, reading, listening).
- Natija: CEFR band (A1–C1) + skill breakdown.
- Foydalanuvchi natijani qabul qiladi yoki "pastroqdan boshlash"ni tanlaydi.
- Path shunga mos ochiladi (oldingi darajalar "mastered/skipped" belgilanadi).

**Acceptance criteria:**
- [ ] Placement test adaptiv (javobga qarab qiyinlik o'zgaradi).
- [ ] Natija CEFR band + boshlanish nuqtasini beradi.
- [ ] Onboarding < 3 daqiqada birinchi lesson'ga olib boradi.
- [ ] Foydalanuvchi placement'ni skip qilsa A1 dan boshlaydi.

### 6.2 Daily Lesson Flow

```
Home/Path ochiladi
  → Daily goal & streak holati ko'rinadi (trigger)
  → (ixtiyoriy) Warm-up: SRS due so'zlar
  → "Available" node bosiladi → lesson start
  → 8–15 exercise (mixed, immediate feedback)
       ├─ test mode: xato → -1 heart
       └─ heart 0 → practice/refill taklifi
  → Lesson complete screen:
       - XP olindi (animatsiya)
       - Streak +1 / saqlandi
       - Yulduzlar (0–3)
       - Yangi badge (agar bo'lsa)
       - League XP yangilandi
  → "Continue" → keyingi lesson yoki Home
  → (kunlik goal bajarilsa) celebration
```

**Acceptance criteria:**
- [ ] Lesson tugagach XP/streak/leaderboard yangilanadi va vizual celebration.
- [ ] Kunlik goal bajarilganda alohida reward.
- [ ] Heart 0 holatida oqim to'g'ri (refill/practice yo'llari).

### 6.3 Retry / Review Loop

```
Lesson score < passing (60% / test 80%)
  → "Retry" (qайta) yoki "Review" (osonlashtirilgan, hint ko'proq)
  → Passing'gacha keyingi node qulf
Lesson passed lekin < perfect
  → "Practice again" taklifi (yulduz oshirish, heart tiklash)
SRS due items
  → Kunlik "Review" CTA → interval takrorlash
```

**Acceptance criteria:**
- [ ] Past ball → retry/review taklifi, keyingisi qulf.
- [ ] Review mode heart ketkazmaydi.
- [ ] SRS review to'g'ri item'larni chiqaradi va interval yangilaydi.

### 6.4 Global Acceptance / Definition of Done (MVP)

- [ ] WebView native app ichida token pass-through bilan qo'shimcha loginsiz ochiladi.
- [ ] Offline lesson bajarilib, online'da idempotent sync bo'ladi.
- [ ] A1–C1 path, unit/lesson/exercise ierarxiyasi, lock/unlock ishlaydi.
- [ ] 8+ exercise type + AI Speaking + AI Writing ishlaydi.
- [ ] Gamification: XP, level, streak, heart, league, badges to'liq va server-authoritative.
- [ ] SRS due-based review ishlaydi.
- [ ] Placement test → daraja aniqlash → path unlock.
- [ ] Student dashboard (radar + metrics).
- [ ] Mentor view: progress ko'rish + feedback qoldirish.
- [ ] Performance budjeti (FCP<1.5s, TTI<3.5s, Lighthouse≥90) bajarilgan.
- [ ] Anti-cheat: XP/progress server tomonda validatsiya qilinadi.
- [ ] Analytics event'lar (funnel, retention) yig'iladi.

---

## 7. Cross-cutting: Analytics, Monetization, Roadmap (qo'shimcha)

### 7.1 Analytics & Event tracking
Kalit event'lar: `onboarding_started/completed`, `placement_completed`, `lesson_started/completed`, `exercise_answered`, `streak_extended/broken`, `heart_depleted`, `speaking_submitted`, `writing_submitted`, `league_promoted`, `badge_unlocked`, `session_start/end`. Funnel va cohort retention dashboard.

### 7.2 Monetization hooks (kelajak)
Premium/subscription: unlimited hearts, double XP, offline downloads, unlimited AI speaking/writing, advanced analytics, mentor 1:1. Free tier funtsional, lekin heart/AI limit bilan.

### 7.3 Roadmap (fazalar)
- **Phase 1 (MVP):** Auth pass-through, path, core exercise types, XP/streak/heart, placement, dashboard. Bitta daraja (A1–A2) to'liq kontent.
- **Phase 2:** AI Speaking + Writing, SRS, League/Leaderboard, badges, mentor view. B1 kontent.
- **Phase 3:** To'liq A1–C1 kontent, offline sync polish, monetization, advanced mentor analytics, adaptive personalization.

### 7.4 Non-functional talablar
- **Xavfsizlik:** OWASP, JWT rotation, rate limiting, input validation, PII/ovoz retention siyosati, GDPR-uslub rozilik.
- **Til:** UI o'zbek (Latin) default, ingliz kontenti; izohlar o'zbek tilida.
- **Accessibility:** WCAG AA, screen reader, kontrast, reduced-motion.
- **Scalability:** stateless backend, Redis cache, horizontal scale; AI service alohida (cost/rate isolation).
- **Observability:** logging, error tracking (Sentry-uslub), AI cost monitoring.

---

*Hujjat oxiri — v1.0. Keyingi qadam: har faza uchun epic/story breakdown va kontent metodisti bilan A1 Unit-1 pilot lesson yaratish.*
