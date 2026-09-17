# MyTeacher — Ustozlar Yo'riqnomasi (Sinov darsi → To'lov)
## Texnik Topshiriq (TZ) — v1.0

**Sana:** 2026-09-17
**Manba:** yangi o'qituvchilar bilan meeting konspekti (asosiy tayanch) + eski sotuv skriptlari + kompaniya ma'lumotlari
**Auditoriya:** Frontend (bitta HTML fayl), keyinchalik Backend (NestJS)
**Status:** Kickoff uchun tayyor

---

## 0. Qisqacha mazmun

Lidlar to'g'ridan-to'g'ri o'qituvchiga o'tkaziladi. O'qituvchi sinov darsini o'tadi va **o'zi** o'quvchini to'lovga olib chiqadi. Bu o'qituvchi uchun yangi rol — u sotuvchi emas, lekin sotuvni yakunlashi kerak.

Shu modul — o'qituvchini ana shu yo'l bo'ylab **jonli, bosqichma-bosqich boshqaradigan ish quroli**. Bu oddiy "o'qib chiqiladigan qo'llanma" emas: o'qituvchi sinov darsi paytida shu sahifani ochib turadi, har bosqichda nima deyishni ko'radi, o'quvchi haqida to'plangan signallarni belgilab boradi, va oxirida tizim unga **aynan qaysi tarifni, qaysi so'zlar bilan taklif qilishni** aytib beradi.

**Asosiy yangilik: XEI kalkulyatori.** O'quvchi uch o'q bo'yicha baholanadi — **X**ohish, **E**htiyoj, **I**mkoniyat — va shundan tavsiya etilgan tarif hamda unga mos "podacha" skripti avtomatik chiqadi.

**Muvaffaqiyat mezoni:** sinov darsidan keyin 10 daqiqa ichida to'lov qilgan o'quvchilar ulushi (trial→paid conversion). Modulgacha bo'lgan bazaviy ko'rsatkich o'lchanadi, maqsad — uni oshirish.

---

## 1. Maqsad va vazifalar

### 1.1 Biznes maqsad
Sinov darsidan to'lovga o'tish konversiyasini oshirish, bunda o'qituvchining narx aytishdagi noqulayligini (konspektdagi asosiy og'riq) skript va tayyor qaror bilan yo'q qilish.

### 1.2 Mahsulot vazifalari
1. O'qituvchiga sinov darsining **5 bosqichini** aniq ketma-ketlikda ko'rsatish.
2. Har bosqichda **nima deyish** (skript) va **nimani aniqlash** (signal) ni bir ekranda berish.
3. O'quvchi haqidagi signallarni **to'g'ridan-to'g'ri so'ramasdan** yig'ish uchun bilvosita savollar bazasini berish.
4. Yig'ilgan signallardan **XEI ballini** va **tavsiya etilgan tarifni** hisoblash.
5. Tarifga mos **narx podacha qilish skriptini** avtomatik generatsiya qilish.
6. To'lov yakunini qayd etish va natijani saqlash.

### 1.3 Muvaffaqiyat mezonlari (birinchi 60 kun)
| Metrika | Maqsad |
|---|---|
| Sinov darsi → to'lov konversiyasi | bazadan **+30% nisbiy** o'sish |
| Dars tugagandan to'lovgacha o'tgan median vaqt | **≤ 10 daqiqa** |
| Modulni sinov darsida faol ishlatgan o'qituvchilar ulushi | **≥ 80%** |
| Narx taklifi XEI tavsiyasiga mos tushgan holatlar | **≥ 70%** |

---

## 2. Foydalanuvchi va kirish

- **Asosiy foydalanuvchi:** yangi va amaldagi MyTeacher o'qituvchisi (onlayn).
- **Kirish:** alohida ochiq sahifa — `teacher-guide.html`, login talab qilinmaydi. Link o'qituvchiga Telegram orqali yuboriladi.
- **Qurilma:** ko'pincha noutbuk (dars Zoom/ilova bilan yonma-yon ochiq), lekin **telefonda ham to'liq ishlashi shart** (o'qituvchi telefondan qarab turishi mumkin).
- **Til:** faqat o'zbek tili, lotin yozuvida.

**Muhim:** sahifa ochiq bo'lgani uchun unda **hech qanday maxfiy ma'lumot bo'lmaydi** — o'quvchilar bazasi, ichki moliyaviy ko'rsatkichlar, boshqa o'qituvchilar ma'lumoti yo'q. Narx grid va skriptlar — ochiq deb hisoblanadi.

---

## 3. Texnik yondashuv

### 3.1 1-bosqich (MVP)
- Bitta fayl: `teacher-guide.html` — repo ildizida, `index.html` bilan bir qatorda.
- Vanilla JS, build yo'q, tashqi kutubxona yo'q, tarmoq so'rovi yo'q.
- Barcha kontent (skriptlar, savollar, tariflar, koeffitsiyentlar) — fayl boshidagi bitta `const GUIDE = {...}` konfiguratsiya obyektida. Kontentni tahrirlash uchun JS bilishning hojati yo'q.
- Holat `localStorage` da saqlanadi (`mt_guide_v1` kaliti).
- Uslub: `index.html` dagi CSS o'zgaruvchilari va dizayn tili (`--bg`, `--blue`, `--td`, `--tm`, kartochka radiuslari) takrorlanadi — CRM bilan bitta oilaga o'xshashi kerak.
- **Deploy:** `index.html` kabi statik, GitHub Pages / nginx orqali `office.myteacher.uz/teacher-guide.html`.

### 3.2 2-bosqich (Backend)
Backend ulanganda: sessiyalar serverga yoziladi, admin qaysi o'qituvchi qancha sinov darsi o'tgani va qanchasi to'lovga aylanganini ko'radi. Kontrakt — 8-bo'limda.

### 3.3 Ishlash talablari
- Birinchi render **< 300 ms**, fayl hajmi **< 250 KB**.
- Offline ishlaydi (tarmoq uzilsa ham dars davomida yiqilmaydi).
- Har qanday o'zgarish `localStorage` ga **darhol** yoziladi — sahifa yopilib qolsa ham sessiya yo'qolmaydi.

---

## 4. Modul tuzilmasi — 5 bosqichli yo'l

Ekran uch qismdan iborat:

```
┌──────────────────────────────────────────────────────────┐
│  Header: sessiya nomi (o'quvchi ismi) · taymer · progress │
├──────────────────────┬───────────────────────────────────┤
│  Chap: bosqichlar    │  Markaz: joriy bosqich kontenti     │
│  (1..5 + yakun)      │  — skript, checklist, savollar      │
│  o'tilgani belgili   │                                     │
│                      ├───────────────────────────────────┤
│                      │  O'ng panel: XEI signal paneli      │
│                      │  (doim ko'rinadi, to'ldirilib      │
│                      │   boriladi, jonli ball ko'rsatadi)  │
└──────────────────────┴───────────────────────────────────┘
```

Mobil ko'rinishda: bosqichlar — yuqorida gorizontal lenta, XEI paneli — pastda yig'iladigan (collapsible) panel.

### Bosqich 0 — Darsgacha (Tayyorgarlik)
Lid kelgach, dars boshlanmasdan oldin.

**Checklist:**
- [ ] O'quvchining ismi, yoshi, aloqa raqami yozib olindi
- [ ] Lid qayerdan kelgani ko'rildi (Instagram / Telegram / tanish)
- [ ] Dars vaqti tasdiqlandi, link yuborildi
- [ ] Kamera, mikrofon, yorug'lik, fon tekshirildi
- [ ] Ilova (MyTeacher app) ochiq va ko'rsatishga tayyor

**Eslatma kartochkasi:**
> Oflayn markazda o'quvchini ushlab qoladigan narsa — interyer va estetika. Onlaynda bunday "bino" yo'q. Sizning **muomalangiz, yordamga tayyorligingiz, mehringiz va professionalizmingiz** — bu yerda binoning o'rnini bosadi. Birinchi 3 daqiqada shu his uyg'onmasa, qolgani ishlamaydi.

---

### Bosqich 1 — Salomlashuv va tanishuv
**Maqsad:** ishonch va iliqlik. Konspekt bo'yicha onlaynda ushlab qoluvchi asosiy faktor shu.

**Skript bloklari** (nusxa olish tugmasi bilan):
- Ochilish: iliq salomlashuv, ism bilan murojaat, o'zini qisqa tanishtirish (2 gapdan oshmasin).
- Ko'prik: "Bugun biz nima qilamiz" — darsning strukturasini 20 soniyada aytib berish, o'quvchining tashvishini olib tashlash.
- Iliqlik signali: o'quvchining biror gapiga samimiy reaksiya (mexanik emas).

**Nima qilmaslik kerak** (anti-pattern kartochkalari):
- Darrov "qaysi tarif kerak?" deb so'rash
- Bir ovozda monolog qilish, o'quvchiga gapirtirmaslik
- Rasmiy, sovuq ton

**Shu bosqichda yig'iladigan signallar** → XEI panelda `Imkoniyat` bo'limi ochiladi: lokatsiya, gaplashish uslubi, fon/qurilma.

---

### Bosqich 2 — Ehtiyojlarni aniqlash (Expectations)
**Maqsad:** o'quvchi ingliz tilini **nima uchun** o'rganayotganini va bu **qanchalik jiddiyligini** aniqlash. Bu XEI dagi `Ehtiyoj` o'qining asosi.

**Ochiq savollar ro'yxati** (modul tayyor variantlarni beradi):
- "Ingliz tili sizga aynan qaysi ishda kerak bo'lib qolyapti?"
- "Buni qachongacha uddalashingiz kerak?" ← **eng muhim savol: muddat bor-yo'qligi ehtiyojni ochadi**
- "Ilgari o'rganib ko'rganmisiz? Nima to'xtatgan edi?"
- "Agar 3 oydan keyin gapira olsangiz, hayotingizda nima o'zgaradi?"

**Ehtiyoj darajasini o'qish jadvali** (modulda ko'rsatiladi):

| Nima eshitilsa | Ehtiyoj balli |
|---|---|
| Green card yutgan, Amerikaga ketyapti | **10** |
| Chetga chiqib ishlash bo'yicha **qat'iy qaror** bor (orzu emas) | **10** |
| Sertifikat bo'lmasa ishdan bo'shashi mumkin | **10** |
| O'qituvchi — kasbi bo'yicha zarur | **9–10** |
| "Hayotimni boshqattan qurishim kerak" — qat'iy | **9–10** |
| "Hamma o'rganyapti, menam o'rganib qo'yishim kerak" | **5–6** |
| "Biroz qiziqishim bor" | **5–6** |
| "Shunchaki bir qiziqdim-da" | **0–2** |

**Ogohlantirish kartochkasi:** orzu bilan qarorni farqlang. "Chetga chiqsam deyman" — orzu (5–6). "Hujjatlarim topshirilgan, iyunda ketaman" — qaror (10).

---

### Bosqich 3 — O'rganish usulini tanlash
**Maqsad:** o'quvchiga qulay usul va materialni aniqlash.

**Konspektdagi asosiy qoida:**
> Agar o'quvchida hozir o'zi o'rganib yurgan va yaxshi qabul qiladigan kitob/material bo'lsa — **o'shandan o'tish afzal**. Tajriba shuni ko'rsatadiki, yangi materialni o'quvchi har doim ham iliq qabul qilavermaydi.

**Savollar:**
- "Hozir qanday kitob yoki material bilan shug'ullanyapsiz?"
- "O'zingizga qaysi usul qulay: gapirib o'rganish, yozib o'rganish, ko'rib o'rganish?"
- "Oldin qaysi darslar sizga yoqqan edi, nimasi bilan?"

**Natija:** o'qituvchi tanlaydi — `o'quvchining materiali` / `MyTeacher materiali` / `aralash`. Bu tanlov 4-bosqichdagi darsni va 5-bosqichdagi skriptni o'zgartiradi.

**Xohish signali** shu yerda ochiladi: o'quvchi o'z materiali haqida qiziqish bilan gapirsa — Xohish yuqori. "Bilmadim, nima desangiz shu" — Xohish past.

---

### Bosqich 4 — Prezentatsiya va dars o'tish
**Maqsad:** haqiqiy qiymat berish. O'quvchi shu yerda "men bu odam bilan o'rganaman" degan qarorga keladi.

**Struktura (tavsiya etilgan xronometraj):**
| Blok | Vaqt | Mazmun |
|---|---|---|
| Kichik g'alaba | 5–7 daq | O'quvchi darrov gapirib/tushunib qoladigan bitta aniq narsa |
| Ilovani ko'rsatish | 3–5 daq | Sun'iy intellekt qismi — mustaqil mashq, chat, tekshirish |
| Yo'l xaritasi | 2–3 daq | "Sizning holatingizda 3 oyda bu yergacha chiqamiz" |

**Muhim urg'u:** MyTeacher ilovasidagi **sun'iy intellekt** — bu shunchaki qo'shimcha emas, u darslar orasidagi bo'shliqni to'ldiradi. Bu 5-bosqichdagi past tarif skriptining asosiy tayanchi bo'ladi — shuning uchun uni **albatta ko'rsatib o'tish kerak**.

**Checklist:**
- [ ] O'quvchi kamida bir marta o'zi ingliz tilida gapirdi
- [ ] Bitta aniq "men buni uddaladim" momenti bo'ldi
- [ ] Ilova va AI qismi ekranda ko'rsatildi
- [ ] O'quvchiga shaxsiy yo'l xaritasi aytildi

**Taymer ogohlantirishi:** dars 45 daqiqadan oshsa, modul qizil eslatma chiqaradi: *"Vaqt ketyapti. O'quvchi qizib turibdi — narxga o'ting."*

---

### Bosqich 5 — Narx aytish va to'lov (eng muhim bosqich)

**Konspektdagi qaror va uning sababi (modulda ko'rsatiladi):**
> Oflayn maktabda narx aytish o'qituvchiga yuklangan edi va o'qituvchilar buni noqulay qabul qilardi. "Ustoz narx aytmasin" degan taklif tushdi — **lekin qabul qilinmadi.** Sabab: onlaynda o'quvchi qizib turgan zahoti, **5–10 daqiqa ichida** to'lamasa, hayotga chalg'ib to'lovni umuman qilmay ketishi mumkin. Shuning uchun vaziyatga qarab to'lovni **imkon qadar o'qituvchi o'zi qildiradi**.
>
> Qolaversa: oflayn maktabda narxlar fixed, bizda esa **flexible** — bu sizning ustunligingiz, noqulaylik emas.

**Qat'iy qoida — narx aytishdan oldin 3 narsa aniqlangan bo'lishi SHART:**
1. **Xohish** — ingliz tilini o'rganish o'ziga yoqadimi
2. **Ehtiyoj** — qanchalik zarur, muddat bormi
3. **Imkoniyat** — to'lash qurbi qanday

Agar uchtasidan biri ham belgilanmagan bo'lsa — modul narx tugmasini **bloklaydi** va "Avval XEI ni to'ldiring" deb ko'rsatadi.

**Bosqich oqimi:**
1. XEI paneli to'liq to'ldiriladi → `Tarifni hisoblash` tugmasi ochiladi
2. Modul tavsiya etilgan tarifni + 1 ta muqobilni ko'rsatadi
3. Shu tarif uchun **tayyor podacha skripti** chiqadi (o'quvchi ismi qo'yilgan holda)
4. O'qituvchi skriptni o'qiydi → to'lov linkini yuboradi
5. Natija qayd etiladi: `To'ladi` / `O'ylab ko'raman` / `Yo'q`

**To'lovni yakunlash checklisti:**
- [ ] Narx aytildi va tarif tushuntirildi
- [ ] To'lov linki / karta ma'lumoti yuborildi
- [ ] O'quvchi ekranda turganida to'lov qilishga taklif qilindi
- [ ] Keyingi dars sanasi kelishildi

---

## 5. XEI ballash tizimi

### 5.1 Uch o'q

Har biri **0–10** ball. Barchasi **bilvosita** aniqlanadi — to'g'ridan-to'g'ri so'ralmaydi.

#### X — Xohish (o'rganishni sevadimi)
| Signal | Ball |
|---|---|
| O'zi qiziqib gapiradi, material olib yuribdi, savol beradi | 9–10 |
| Qiziqish bor, lekin harakat yo'q | 5–6 |
| "Nima desangiz shu", befarq ton | 0–3 |

#### E — Ehtiyoj (qanchalik zarur)
4-bo'limdagi (Bosqich 2) jadval bo'yicha.

#### I — Imkoniyat (to'lash qurbi)
**Bazaviy ball — lokatsiya bo'yicha:**

| Hudud | Bazaviy ball |
|---|---|
| Toshkent shahri | 10 |
| Vodiy (Farg'ona, Andijon, Namangan) | 9 |
| Samarqand, Buxoro | 8 |
| Voha hududlari | 6–7 |
| Boshqa / chekka tumanlar | 4–5 |

**Qo'shimcha signallar (bazaga qo'shiladi/ayriladi, yakuniy ball 0–10 ga qisqartiriladi):**

| Signal | O'zgarish |
|---|---|
| iPhone ishlatadi | +1 |
| Mashinada yuradi | +1 |
| Lavozimi/kasbi yuqori (rahbar, IT, tadbirkor, shifokor) | +1 |
| Talaba / hozir ishlamaydi | −2 |
| Oilada bir necha bolasi bor, yagona daromad | −1 |

**ASOSIY OGOHLANTIRISH (modulda qizil ramkada ko'rsatiladi):**
> Bu signallarni **to'g'ridan-to'g'ri so'ramang.** "Qayerda yashaysiz, qancha maosh olasiz?" degan savol ishonchni buzadi. Ular **gap orasida, vaziyatga qarab** so'raladi va **keep in mind** qilinadi.
>
> Misol: "Darsni qaysi vaqtda qilsak qulay — ishdan keyinmi?" → ish bor-yo'qligi ma'lum bo'ladi. "Yo'lda bo'lsangiz ham ulanasizmi?" → mashina/transport ma'lum bo'ladi.

Modul har signal uchun **1–2 ta bilvosita savol namunasini** beradi.

### 5.2 Tarif jadvali

| Haftada dars soni | Narx (UZS) |
|---|---|
| 1 marta | 350 000 |
| 2 marta | 450 000 |
| 3 marta | 550 000 |
| 4 marta | 650 000 |
| 5 marta | 750 000 |
| 6 marta (Yakshanbadan tashqari har kuni) | 850 000 |

- **Minimal narx: 350 000** — bundan pastga tushilmaydi.
- **Maksimal koridor: 1 200 000** — 850 000 dan yuqorisi standart gridda yo'q, bu individual/premium taklif (⚠️ 11-bo'limdagi ochiq savolga qarang).

### 5.3 Tavsiya algoritmi

**1-qadam — ehtiyoj darajasi (o'quvchiga nechta dars kerak):**

```
xomBall = 0.45 × E + 0.30 × X + 0.25 × I      // 0..10
xomDaraja = round(xomBall / 10 × 6)            // 0..6, minimal 1
```

**2-qadam — ikkita shift.** Tavsiya ikki tomondan cheklanadi:

**a) Imkoniyat shifti** — to'lay olmaydigan tarifni taklif qilmaslik:

| Imkoniyat (I) | Maksimal daraja | Shift narxi |
|---|---|---|
| 0–3 | 1 | 350 000 |
| 4–5 | 2 | 450 000 |
| 6–7 | 3 | 550 000 |
| 8 | 4 | 650 000 |
| 9 | 5 | 750 000 |
| 10 | 6 | 850 000 |

**b) Xohish shifti** — o'rganishni sevmagan odam intensivga chiqmaydi, tashlab ketadi:

| Xohish (X) | Maksimal daraja |
|---|---|
| 0–3 | 2 (450 000) |
| 4–5 | 4 (650 000) |
| 6–10 | 6 (shift yo'q) |

```
shift = min(shiftI(I), shiftX(X))
daraja = min(xomDaraja, shift)
tavsiya = tarif[daraja]
muqobil = tarif[daraja + 1]   // agar shift ruxsat bersa — "bir pog'ona yuqori" varianti
```

> **Xohish shifti nega kerak?** Usiz modul o'zi bilan ziddiyatga tushardi: X=2, E=9, I=10 holatida panel
> *"intensiv tarif bermang — tashlab ketadi"* deb ogohlantirar, kalkulyator esa aynan shu paytda
> 650 000 / haftada 4 marta tavsiya qilardi. Xohish faqat 0.30 og'irlikka ega bo'lgani uchun yuqori
> Imkoniyat uni bosib ketardi. Shift qo'yilgach, o'sha holat **450 000 / haftada 2 marta + AI skripti**
> beradi — ya'ni ogohlantirish bilan bir xil ko'rsatma.

**Tekshiruv misoli (konspektdagi holat):**
Chekka qishloq, juda zarur, puli juda kam → E=10, X=9, I=2
- xomBall = 4.5 + 2.7 + 0.5 = **7.7** → xomDaraja = round(4.62) = **5**
- shiftI(2) = **1**, shiftX(9) = **6** → shift = **1**
- daraja = min(5, 1) = **1** → **350 000, haftada 1 marta** ✓ konspektga mos

**Boshqa tekshirilgan holatlar:**

| Holat | X | E | I | xomBall | Natija |
|---|---|---|---|---|---|
| Klassik (chekka, juda zarur) | 9 | 10 | 2 | 7.7 | 350 000 · 1× · AI urg'usi |
| Eng kuchli | 10 | 10 | 10 | 10.0 | 850 000 · 6× · har kunlik |
| Zarur, lekin sevmaydi | 2 | 9 | 10 | 7.15 | 450 000 · 2× · AI urg'usi |
| O'rtacha | 6 | 6 | 8 | 6.5 | 650 000 · 4× · muvozanat |
| Xohish ham, ehtiyoj ham past | 3 | 3 | 9 | 4.5 | 450 000 · 2× · AI urg'usi |

**Muhim:** barcha koeffitsiyentlar (`0.45 / 0.30 / 0.25`), ikkala shift jadvali va tarif narxlari — `GUIDE.pricing` va `GUIDE.xei.weights` obyektlarida, kod tegmasdan o'zgartiriladi. Modulda yashirin "Sozlamalar" bo'limi ham bor: **brend logotipiga 3 marta bosilsa** ochiladi, narx va koeffitsiyentlarni jonli tahrirlaydi (admin narxni yangilaganda ishlatadi).

### 5.4 Ogohlantirish holatlari

| Holat | Modul nima qiladi |
|---|---|
| E ≤ 2 (ehtiyoj yo'q) | Qizil: *"Ehtiyoj yo'q. Narx aytish o'rniga ehtiyojni oshirishga qayting — bu odam hozir sotib olmaydi."* |
| X ≤ 3, E ≥ 8 | Sariq: *"Zarur, lekin o'rganishni sevmaydi. Intensiv tarif bermang — tashlab ketadi. Past tarif + AI qo'llab-quvvatlash."* |
| I ≤ 3, E ≥ 8 | Ko'k: *"Klassik holat — juda zarur, imkoniyat kam. 350k + AI urg'usi skriptidan foydalaning."* |
| Barcha ball ≥ 9 | Yashil: *"Eng kuchli holat. Har kunlik tarifni ishonch bilan taklif qiling."* |

---

## 6. Narx podacha skriptlari

Modul tavsiya etilgan tarif uchun **tayyor matn** chiqaradi, ichida `{ISM}` avtomatik almashtiriladi. Nusxa olish tugmasi bor.

**Asosiy prinsip (konspektdan):**
> Tarifni shunday tushuntiring-ki, o'quvchi **"bu menga mos"** va **"bu menga yetarli"** degan ikki xulosaga kelsin. Shu ikkisi bo'lsa — sotib oladi.

### 6.1 Past tarif (350k–450k) — AI urg'usi
Kimga: Imkoniyat past, Xohish/Ehtiyoj yuqori.

> {ISM} aka/opa, sizga to'g'risini aytaman. Mana hozir sizga bu juda zarur bo'lib turibdi. Sizga ilovaning ichidagi sun'iy intellektning o'zi ham juda katta yordam bera oladi. Men esa siz bilan haftada 1 marta dars qilaman, mashqlarni so'rab olaman. Siz faqat o'z vaqtida mustaqil kirib, ketma-ket bajarib tursangiz bo'ldi. Zarurat bo'lganda ilova ichidan chatlashib ham turamiz.

**Urg'u:** kam narx — kam qiymat emas. AI darslar orasidagi bo'shliqni to'ldiradi, o'qituvchi esa nazorat qiladi.

### 6.2 O'rta tarif (550k–650k) — muvozanat urg'usi
Kimga: barcha o'qlar o'rtacha.

> {ISM}, sizning maqsadingizga qarab haftada {N} marta dars eng to'g'ri bo'ladi. Bunda siz o'rganganingizni unutishga ulgurmaysiz — darslar orasida ilova sizni mashq qildirib turadi, men esa har darsda xatolaringizni yopib boraman. Bu tezlik siz aytgan muddatga yetib borishga yetadi.

### 6.3 Yuqori tarif (750k–850k) — har kunlik urg'usi
Kimga: Imkoniyat va Ehtiyoj yuqori.

> {ISM}, sizning holatingizda vaqt tig'iz va jiddiy. Men o'zim sizga Yakshanbadan tashqari har kuni dars o'taman va darslaringizda yordam berib turaman. Har kuni gaplashsangiz, til ochilishi butunlay boshqacha tezlikda ketadi — bu eng tez yo'l.

**Urg'u:** shaxsiy, kunlik hamrohlik. Bu yerda AI emas, **o'qituvchining o'zi** — asosiy qiymat.

### 6.4 Umumiy qoidalar (modulda kartochka)
- Narxni **aytib bo'lgach jim turing.** Birinchi gapirgan — yon beradi.
- Uzr so'ramang, narxni pasaytirib aytmang ("atigi", "jami-yo'g'i" — kerak emas).
- Chegirma so'ralsa: narxni tushirmang, **dars sonini kamaytiring** (tarif pastga tushadi, qiymat saqlanadi).
- To'lovni **hoziroq**, o'quvchi ekranda turganida qildiring.

---

## 7. MyTeacher haqida ma'lumot bo'limi

O'quvchi kompaniya haqida so'rasa, o'qituvchi shu bo'limni ochadi. Qidiruv bilan, savol-javob (accordion) ko'rinishida.

**Asosiy pozitsiya:**
> MyTeacher ilgari turli uslublarda dars berib ko'rgan. Hozir esa **sun'iy intellekt asosidagi yangi tizim, yangi ilova va yangi metodologiya** yo'lga qo'yilmoqda.

**Kontent manbalari:**
- Narxlar va yangi metodika — shu TZ (5 va 6-bo'limlar)
- Qolgan barcha ma'lumot (kompaniya tarixi, natijalar, o'qituvchilar, kafolat, qaytarish siyosati) — **eski sotuv skriptlari faylidan** olinadi

> ⚠️ **Kontent bo'shlig'i:** eski sotuv skriptlari va kompaniya ma'lumotlari fayli hali yuklanmagan. Bu bo'lim MVP da **placeholder** bilan quriladi (struktura tayyor, matn keyin to'ldiriladi). Fayl kelgach faqat `GUIDE.about` massivi to'ldiriladi — kodga tegilmaydi.

---

## 8. Ma'lumot modeli

### 8.1 localStorage sxemasi (1-bosqich)

```js
// kalit: mt_guide_v1
{
  version: 1,
  activeSessionId: "s_1726500000000",
  sessions: [{
    id: "s_1726500000000",
    createdAt: "2026-09-17T10:00:00Z",
    updatedAt: "2026-09-17T10:52:00Z",
    student: { name: "Dilnoza", age: 24, phone: "+998...", source: "instagram" },
    stage: 5,                       // joriy bosqich 0..5
    checks: { "0.1": true, "2.3": true },   // checklist holati
    notes: { "2": "Green card, iyunda ketadi" },  // bosqich bo'yicha izoh
    method: "student_material",     // student_material | myteacher | mixed
    xei: {
      x: 9,
      e: 10,
      i: { base: 4, region: "chekka", signals: ["no_job"], final: 2 }
    },
    pricing: {
      rawScore: 7.7,
      rawLevel: 5,
      capLevel: 1,
      level: 1,
      recommended: 350000,
      alternative: 450000,
      offered: 350000,              // o'qituvchi aslida nimani taklif qilgani
      scriptUsed: "low_ai"
    },
    outcome: "paid",                // paid | thinking | refused | null
    outcomeAt: "2026-09-17T10:55:00Z",
    durationSec: 3120
  }]
}
```

**Saqlash qoidalari:**
- Har o'zgarishda darhol yoziladi (debounce 300 ms).
- Oxirgi **50 ta** sessiya saqlanadi, eskilari o'chadi.
- `Yangi sessiya` tugmasi — joriysini arxivga o'tkazib, bo'shini ochadi.
- `Tarix` ekrani — o'qituvchi o'z sessiyalarini ko'radi: sana, ism, XEI, natija.

### 8.2 Kontent konfiguratsiyasi

```js
const GUIDE = {
  stages: [ /* bosqichlar: nom, skriptlar, checklist, savollar, anti-patternlar */ ],
  xei: {
    weights: { e: 0.45, x: 0.30, i: 0.25 },
    regions: [ { key:"toshkent", label:"Toshkent shahri", base:10 }, /* ... */ ],
    signals: [ { key:"iphone", label:"iPhone ishlatadi", delta:+1 }, /* ... */ ],
    probes: { /* har signal uchun bilvosita savollar */ }
  },
  pricing: {
    tiers: [ {level:1, perWeek:1, price:350000}, /* ... */ ],
    caps:  { 3:1, 5:2, 7:3, 8:4, 9:5, 10:6 },
    min: 350000, max: 1200000
  },
  scripts: { low_ai: "...", mid_balance: "...", high_daily: "..." },
  about: [ /* savol-javob — eski skript fayldan to'ldiriladi */ ]
};
```

---

## 9. Backend API kontrakti (2-bosqich)

Yangi NestJS feature: `backend/src/features/teacher-guide/` — mavjud clean architecture naqshi bo'yicha (`presentation` / `application` / `infrastructure`).

**Autentifikatsiya:** sahifa ochiq bo'lgani uchun JWT yo'q. O'qituvchi bir marta **shaxsiy kod** (`?t=ABC123`) bilan kiradi, kod `localStorage` da saqlanadi va har so'rovda `X-Teacher-Token` header'ida yuboriladi. Kodni admin CRM dan generatsiya qiladi.

| Method | Yo'l | Vazifa |
|---|---|---|
| `POST` | `/api/teacher-guide/sessions` | Yangi sessiya ochish |
| `PATCH` | `/api/teacher-guide/sessions/:id` | Sessiyani yangilash (stage, xei, checks) |
| `POST` | `/api/teacher-guide/sessions/:id/outcome` | Natijani yopish (paid/thinking/refused) |
| `GET` | `/api/teacher-guide/sessions?mine=1` | O'qituvchining o'z sessiyalari |
| `GET` | `/api/teacher-guide/config` | Narxlar va koeffitsiyentlar (serverdan boshqariladi) |
| `GET` | `/api/teacher-guide/stats` | **Admin:** o'qituvchilar kesimida konversiya |

**Entity:** `teacher_guide_session` — 8.1 dagi sxema bilan bir xil maydonlar, `teacherId` qo'shiladi.

**Sinxronizatsiya:** offline-first. Sessiya avval `localStorage` ga yoziladi, keyin serverga navbat (queue) orqali yuboriladi. Tarmoq yo'q bo'lsa — dars buzilmaydi, tarmoq qaytganda o'zi yuboriladi.

**Admin ko'rinishi:** CRM `index.html` ga yangi ichki tab — qaysi o'qituvchi nechta sinov darsi o'tgan, o'rtacha XEI, konversiya foizi, o'rtacha chek.

---

## 10. UI/UX talablari

Asosiy prinsip: **bu boshqaruv paneli emas, jonli chiqish quroli.** O'qituvchi uni o'quvchi ekranda o'tirganida ochadi — bunday paytda odam o'qimaydi, ko'z tashlaydi. Har bir qaror shu mezon bilan o'lchanadi.

### 10.1 Tuzilma

**Desktop (≥ 1181px)** — uch ustun: bosqichlar navigatsiyasi | joriy bosqich | o'ng panel (Izoh + XEI).
**Telefon va planshet (≤ 1180px)** — bitta ustun, bosqichlar yuqorida gorizontal lenta, **XEI va Izoh ekran tagidagi doimiy panelda** (dock). Dock'ga bosilsa pastdan sheet ochiladi.

> XEI ni pastki panelga chiqarish — eng muhim qaror. Aks holda o'qituvchi dars o'rtasida ball qo'yish uchun ikki-uch ekran pastga skroll qilishi kerak bo'ladi va amalda buni qilmaydi.

### 10.2 Ma'lumot zichligi

| Element | Holati |
|---|---|
| Skriptlar | **Doim ochiq**, 17.5px shrift — ko'z tashlanadigan asosiy matn |
| Checklist | **Doim ochiq** — dars davomida belgilanadi |
| Tarif bloki | **Doim ochiq** |
| Savollar, jadvallar, anti-patternlar, XEI eslatmasi | **Yig'ilgan** (`<details>`), yonida element soni |

Natija: bitta bosqich kartochkasi telefonda ~880px (avval 1816px edi), butun sahifa ~1230px (avval 2315px).

### 10.3 XEI kiritish

Har o'q uchun **3 ta nomli tugma** — Past / O'rta / Yuqori, har birida aniq misol yozilgan (masalan Ehtiyoj → Yuqori: *"Green card, qat'iy qaror, ish talabi. Aniq sana yoki majburiyat bor."*).

0–10 shkalasi yig'ilgan "Aniqroq ball qo'yish" bo'limida qoladi — kerak bo'lganda ochiladi, lekin standart yo'l bu emas.

> **Nega 11 ta tugma emas?** Odam jonli suhbat bosimi ostida 6 bilan 7 ni ishonchli farqlay olmaydi. 11 ta variant soxta aniqlik beradi va tanlashni sekinlashtiradi. Nomli darajalar tezroq va halolroq.

### 10.4 Boshqa talablar

1. **Nusxa olish** — har skript blokida tugma, bosilganda vizual tasdiq.
2. **Izoh maydoni** — desktopda o'ng panelning eng tepasida, doim ko'rinadi; telefonda dock'dagi qalam tugmasi orqali (yozilgan izoh bo'lsa tugmada nuqta paydo bo'ladi).
3. **Progress** — bosqichlar navigatsiyasida va foizda.
4. **Taymer** — 45 daqiqada qizil ogohlantirish.
5. **Chop etish** — `Ctrl+P` da butun yo'riqnoma bitta matn bo'lib chiqadi.
6. **Rang** — kam ishlatiladi: har bosqichda ko'pi bilan bitta rangli kartochka, qolgani neytral. Palitra `index.html` bilan bir xil.
7. **Tipografika** — sarlavhalar Montserrat, asosiy matn tizim shrifti (uzun matn o'qishga qulayroq).
8. **Qorong'i rejim** — `prefers-color-scheme`, ikkala rejimda ham to'liq tekshirilgan.

### 10.5 Accessibility (WCAG 2.1 AA)

- Checklist va signallar — **haqiqiy `<input type="checkbox">`**, Tab va Space bilan ishlaydi.
- Tanlanadigan tugmalarda `aria-pressed`, joriy bosqichda `aria-current="step"`.
- Modal va sheet: `role="dialog"`, `aria-modal`, **fokus tuzog'i**, Esc bilan yopiladi, yopilgach fokus chaqirgan tugmaga qaytadi.
- XEI qayta chizilganda **fokus va skroll o'z joyida qoladi** (`data-fk` kalitlari orqali) — klaviatura bilan ishlaydigan odam joyini yo'qotmaydi.
- Barcha matn kontrasti **≥ 4.5:1** (o'lchangan eng past qiymat 5.44).
- `prefers-reduced-motion` hurmat qilinadi.
- `:focus-visible` har bir interaktiv elementda ko'rinadi.

---

## 11. Qabul qilish mezonlari (Acceptance Criteria)

- [ ] `teacher-guide.html` bitta fayl, tashqi so'rovsiz ochiladi va offline ishlaydi
- [ ] 6 ta bosqich (0–5) navigatsiya qilinadi, progress saqlanadi
- [ ] Sahifa yangilangandan keyin sessiya to'liq tiklanadi
- [ ] XEI uch o'qi kiritiladi, har biri uchun bilvosita savol namunasi ko'rinadi
- [ ] XEI to'ldirilmaguncha narx hisoblash bloklanadi
- [ ] Konspekt misoli (E=10, X=9, I=2) → **350 000 / haftada 1 marta** chiqaradi
- [ ] 5.3 dagi tekshiruv jadvalining beshta holati ham to'g'ri natija beradi
- [ ] Xohish past bo'lganda kalkulyator ogohlantirish bilan bir xil narx tavsiya qiladi
- [ ] Har tarif uchun to'g'ri skript chiqadi, `{ISM}` almashtiriladi, nusxa olinadi
- [ ] 5.4 dagi 4 ta ogohlantirish holati to'g'ri ishlaydi
- [ ] Narxlar va koeffitsiyentlar `GUIDE` obyektidan kod tegmasdan o'zgaradi
- [ ] Natija (`paid`/`thinking`/`refused`) qayd etiladi va tarixda ko'rinadi
- [ ] 375px kenglikda gorizontal skroll yo'q va XEI ekran tagidagi dock'dan bir bosishda ochiladi
- [ ] Yordamchi bo'limlar yig'ilgan, skript va checklist ochiq
- [ ] XEI da 3 ta nomli tugma, 0–10 shkalasi yig'ilgan holda
- [ ] Klaviatura bilan to'liq boshqariladi, modal fokus tuzog'i ishlaydi
- [ ] Matn kontrasti yorug' va qorong'i rejimda ≥ 4.5:1
- [ ] Butun matn **faqat lotin yozuvida**, kirill harflari yo'q
- [ ] Sahifada hech qanday maxfiy ma'lumot yo'q

---

## 12. Ochiq savollar

1. **⚠️ 1 200 000 narx qayerdan chiqadi?** Konspektda "eng balandi 1200 ming" deyilgan, lekin tarif gridi 850 000 da tugaydi. Bu individual/VIP tarifmi, yoki gridda yo'q qo'shimcha xizmatmi (masalan IELTS intensiv)? Aniqlanmaguncha modul 850 000 ni yuqori chegara qilib ishlaydi.
2. **"Voha" qaysi hududlar?** Imkoniyat jadvalida aniq viloyatlar ro'yxati kerak.
3. **To'lov kanali qanday?** Click/Payme linkimi, yoki karta raqamimi? Skriptdagi "to'lov linkini yuboring" qadami shunga qarab aniqlashadi. (Eslatma: mavjud Click webhook imzo tekshiruvi yo'q — real to'lov ulanishidan oldin hal qilinishi kerak.)
4. **Chegirma chegarasi bormi?** O'qituvchi 350 000 dan pastga tusha oladimi hech qachon (masalan aksiya paytida)?
5. **Eski sotuv skriptlari fayli** — 7-bo'lim uchun kerak.
6. **Lid o'qituvchiga qanday tushadi?** CRM dan avtomatikmi, qo'lda Telegram orqalimi? Bu 0-bosqich va kelajakdagi CRM integratsiyasini belgilaydi.

---

## 13. Bosqichma-bosqich yetkazish rejasi

| Bosqich | Mazmun | Natija |
|---|---|---|
| **1** | `teacher-guide.html` — 6 bosqich, XEI kalkulyator, skriptlar, localStorage | Ishlaydigan modul, linkni tarqatish mumkin |
| **2** | 7-bo'lim (MyTeacher haqida) to'ldiriladi | Eski skript fayli kelgach |
| **3** | Backend feature + o'qituvchi kodlari + sinxronizatsiya | Sessiyalar serverda |
| **4** | CRM ichida admin paneli (konversiya statistikasi) | Nazorat va tahlil |

