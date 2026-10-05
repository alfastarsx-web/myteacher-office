# MyTeacher — Mahmud uchun bilim bazasi

> Versiya: 2026-10-05. Bu hujjat — operatorlar jamoasi rahbari Mahmud va uning AI yordamchisi uchun yagona manba.
> Raqamlar va qoidalar tizimdagi (kod) qiymatlar bilan bir xil. Biror narsa o'zgarsa — shu fayl yangilanadi.
> Bu yerda yo'q savol chiqsa: **Sardorga yoziladi**, javob shu faylga qo'shiladi.

---

## 0. AI yordamchi uchun ko'rsatma

Sen — Mahmudning shaxsiy yordamchisisan. Mahmud — MyTeacher'ning **tijorat direktori**: butun sotuv
(lid → sinov darsi → to'lov) va operatorlar jamoasi uchun javobgar. U yosh va bu ishda yangi: odamlar bilan
gaplashishga biroz uyaladi, lekin ishlashni juda xohlaydi. Sening vazifang — unga **tayyor, qisqa, samimiy** javob matnlari berish va
**nega shunday javob berish kerakligini** bir-ikki gapda tushuntirish.

Qoidalar:
1. Javobni **o'zbek tilida (lotin)**, oddiy va do'stona tilda yoz. Rasmiyatchilik va uzun gaplar yo'q.
2. Mahmud operatorning xabarini yuborsa, quyidagi tartibda javob ber:
   - **Tayyor javob** — Mahmud ko'chirib yuboradigan matn (operatorga "siz" deb, hurmat bilan).
   - **Nega** — 1–2 gap: bu vaziyatda nima muhim.
   - Kerak bo'lsa: **keyingi qadam** (masalan, "agar ertaga ham chiqmasa — Sardorga ayting").
3. Faqat shu bilim bazasidagi faktlarni ayt. Bilmasang — "Buni Sardordan aniqlang" de. **O'ylab topma.**
4. Pul, ish haqi, ishdan bo'shatish, nizo, qonuniy savol, kompaniya siri — **ehtiyot bo'l**: bazadagi qoidani ayt,
   undan tashqari va'da berma, qaror kerak bo'lsa Sardorga yo'naltir.
5. Mijozlar (o'quvchilar) va operatorlarning shaxsiy ma'lumotlarini hech kimga berish mumkin emas.
6. Mahmudni qo'llab-quvvatla: u yaxshi qilgan narsani ham ayt. Lekin xato bo'lsa — muloyim, aniq ayt.
7. Mahmud "mashq qilaylik" desa — sen operator rolini o'ynaysan (yangi, uyatchan, norozi, kechikkan va h.k.),
   Mahmud rahbar sifatida javob beradi; oxirida qisqa baho va maslahat berasan.

---

## 1. Kompaniya haqida

### MyTeacher nima
**MyTeacher** — O'zbekistondagi onlayn ingliz tili platformasi. Asosiy mahsulot — **shaxsiy ustoz bilan yakkama-yakka
onlayn darslar**. O'quvchi hech qayerga bormaydi: dars **MyTeacher ilovasida, telefondan, uydan turib** o'tadi.

**Biz nimani sotamiz**: o'quvchiga mos ustoz + haftalik doimiy jadval (haftada 1–6 dars, har biri ~1 soat) + ilova
ichidagi qo'shimcha mashqlar. To'lov oylik.

**Nega odamlar bizni tanlaydi (mijozga aytiladigan qadriyatlar)**:
- **Yakkama-yakka** — guruh emas, ustoz faqat siz bilan ishlaydi; uyalmasdan gapirasiz.
- **Uydan, telefondan** — yo'lga vaqt va pul ketmaydi; kechki soatlar ham bor.
- **Birinchi dars bepul** — ustoz darajangizni aniqlaydi va shaxsiy reja tuzadi; hech narsaga majbur emas.
- **Noldan ham** boshlasa bo'ladi; ish, o'qish, chet el, IELTS yoki o'zi uchun.
- **Darslar jadvalda va kafolatli qoidalar bilan**: darsni 12 soat oldin o'zi ko'chira oladi, ustoz o'tkaza olmasa
  dars saqlanadi.

### Platforma qismlari
| Qism | Kim uchun | Nima |
|---|---|---|
| **MyTeacher ilovasi** (Android: Play Market → "MyTeacher", telefonda nomi "MyAI Teacher"; iPhone: hozircha TestFlight, nomi "AI Teacher") | O'quvchi | Darslarga kirish, **Kurslar** bo'limi (dars vaqti, ustoz, "Darsga kirish" tugmasi, darslar katakchalari, ko'chirish), ustoz bilan chat, so'z boyligi, gapirish va yozish mashqlari, reyting, "battle" o'yinlari |
| **@MT_yordam_bot** (Telegram) | O'quvchi | Login-parol keladi (SMS yo'q), dars eslatmalari |
| **Operator paneli** (ai.myteacher.uz/operator) | Operator | Lid navbati, skript, natija tugmalari, daromad, qo'ng'iroq yozuvlari |
| **Ustoz kabineti** (mentor ilovasi) | Ustoz | Jadval (bo'sh soatlar), sinov so'rovlari, darslar, taklif yuborish, hamyon, ball va reyting |
| **Admin panel** | Sardor, Mahmud | Operatorlar, arizalar, lidlar, sinov darslari, to'lovlarni tasdiqlash, o'quvchilar va ustozlar |
| **myteacher.uz/bepul-dars** | Yangi odam | Bepul sinov darsiga yozilish sahifasi |

### Hozirgi bosqich
- Hozir **reklama berilmayapti** — kompaniya **o'z bazasi** (avval ingliz tiliga qiziqqan, ariza qoldirgan odamlar)
  bilan ishlayapti. Shuning uchun narxlar hozircha past.
- **Keyingi oydan** tizim to'liq ishga tushadi va narxlar oshadi. Bu haqiqat — mijozga aytish mumkin.
- Jamoa yangi: operatorlar, ustozlar va rahbarlar birga o'sib boryapti. Har kun yangi savol chiqadi — bu normal,
  javoblar shu bilim bazasiga qo'shib boriladi.

### Narxlar (ichki ma'lumot — mijozga faqat oraliq aytiladi)
| Haftada | Oyiga | Darslar soni (oyiga) |
|---|---|---|
| 1 marta | 350 000 so'm | 4 |
| 2 marta | 450 000 so'm | 8 |
| 3 marta | 550 000 so'm | 12 |
| 4 marta | 650 000 so'm | 16 |
| 5 marta | 750 000 so'm | 20 |
| 6 marta | 850 000 so'm | 24 |

Narx dasturga emas, **haftadagi dars soniga** bog'liq. Aniq tarifni sinov darsida ustoz o'quvchi bilan kelishadi.

### Kim kim
| Kim | Vazifasi |
|---|---|
| **Sardor** | **Asoschi va CEO**. Strategiya, pul, narx va stavkalar, texnik masalalar, yakuniy qarorlar. |
| **Mahmud** (@myteacher_sales) | **Tijorat direktori**: butun sotuv zanjiri (lid → sinov → to'lov) uchun javobgar; operatorlar jamoasini yig'adi, o'rgatadi, nazorat qiladi; **ustozlar bilan sotuv bo'yicha mustaqil ishlaydi**; kunlik va haftalik hisobot beradi. |
| **Operatorlar** | Lidlarga qo'ng'iroq qilib, bepul sinov darsiga yozadi, ilovaga kirgizadi, dars oldidan eslatadi. |
| **Ustozlar (mentorlar)** | Sinov darsini o'tadi, o'quvchi bilan kunlarni kelishib **kurs taklifini** yuboradi, doimiy darslarni o'tadi. Kursni ustoz sotadi. |
| **Admin** | To'lov cheklarini tasdiqlaydi (odatda 1 soat ichida, 09:00–21:00), obunalarni ochadi. |
| **AI yordamchilar** | Nomzodlar botida savollarga javob beradi; Mahmud uchun — shu bilim bazasi asosida maslahat beradi. |

---

## 2. Sotuv tizimi: lid → sinov darsi → to'lov (tijorat direktori uchun)

Bu — kompaniyaning pul topadigan asosiy zanjiri. Mahmud har bir bosqichning raqamini bilishi va qayerda "teshik"
borligini topishi kerak.

### Zanjir bosqichlari
| # | Bosqich | Kim qiladi | Tizimdagi holat / belgi | Natija hisoblanadi, agar… |
|---|---|---|---|---|
| 1 | **Lid keladi** | Tizim | Lid "Yangi" | Bazadan, bepul-dars sahifasidan yoki ilovadan yozilgan odam navbatga tushadi |
| 2 | **Qo'ng'iroq** | Operator | 📵 Javob bermadi / ⏰ Keyinroq / ✖ Qiziqmadi / ✅ Sinovga yozdi | Odam bilan **gaplashildi** |
| 3 | **Sinovga yozish** | Operator | Lid "Sinov belgilandi" | Bo'sh soat tanlandi (ustozning ochiq soatlaridan) |
| 4 | **Ilovaga kirgizish** | Operator (telefonda turib) | Panelda ✅ Telegram bot ulandi, ✅ Ilovaga kirdi | Ikkala belgi ✅ — **"haqiqiy sinov"** |
| 5 | **Ustoz topiladi** | Tizim + ustoz | ✅ Ustoz topildi | So'rov bo'sh ustozlarga ketadi, ustoz **15 daqiqada** qabul qiladi (qabul qilinmasa 10 daqiqadan keyin qayta yuboriladi). O'quvchi o'zi yozilgan bo'lsa, ustoz **20 daqiqada** qo'ng'iroq qilib tasdiqlaydi |
| 6 | **Eslatma** | Operator | ✅ Eslatildi | Dars kuni o'quvchiga qo'ng'iroq qilindi, ilovasi tekshirildi |
| 7 | **Sinov darsi** | Ustoz | Lid "Sinov o'tildi" yoki "Kelmadi" | O'quvchi darsda **20+ daqiqa** o'tirdi (operatorga 5 000 / 6 000 shundan) |
| 8 | **Taklif** | Ustoz | Taklif "Yuborildi" (soatlar **24 soat** band) | Dars oxirida kunlar kelishildi, ustoz Work'dan taklif yubordi. O'quvchi o'zi ilovada "Davom etmoqchiman" bossa — ustozga so'rov keladi |
| 9 | **To'lov** | O'quvchi | Taklif "To'lov tekshirilmoqda" yoki "Bron" | Click orqali yoki kartaga o'tkazib chek yukladi. Hammasini to'lay olmasa — **bron** (kamida 100 000, soatlar 3 kun band) |
| 10 | **Tasdiq va obuna** | Admin | Taklif "Tasdiqlandi", lid "O'quvchiga aylandi" | Admin to'lovni tasdiqladi → obuna ochildi → 4 haftalik darslar jadvalga tushdi |
| 11 | **Doimiy darslar** | Ustoz + o'quvchi | Darslar katakchalari | Darslar o'tiladi; har dars uchun ustozga pul; keyingi oyga **uzaytirish** |

### Kim qayerda pul oladi (motivatsiya zanjiri)
| Bosqich | Operator | Ustoz |
|---|---|---|
| Sinov darsi o'tdi (20+ daq) | 5 000 so'm (kunning 6-sinovidan 6 000) | +30 ball (25+ daqiqa) |
| O'quvchi to'ladi | +15 000 so'm | 24 soat ichida to'lasa — **bitta dars puli bonus** |
| Har doimiy dars | — | dars puli: to'lov × ulush (60–85%, rankiga qarab) ÷ darslar soni − 1% soliq |

Demak operator **odamni darsga olib kelishdan**, ustoz **sinovni sotuvga aylantirishdan** manfaatdor.
Mahmudning ishi — ikkalasi orasidagi "uzilish" bo'lmasligini ta'minlash.

### Asosiy KPI (Sardor belgilagan): 100 lid → 10 sinov darsi → 3 sotuv

| Bosqich | Mo'ljal | Formula |
|---|---|---|
| **Lid → sinov darsi** | **10%** (100 ta liddan 10 ta) | o'tkazilgan sinov darsi ÷ ishlangan lidlar |
| **Sinov darsi → sotuv** | **30%** (10 ta sinovdan 3 ta) | to'lov qilganlar ÷ o'tkazilgan sinov darslari |
| **Lid → sotuv (umumiy)** | **3%** (100 ta liddan 3 ta) | to'lov qilganlar ÷ ishlangan lidlar |

Atamalar:
- **Ishlangan lid** — operator kamida bir marta qo'ng'iroq qilib, natija tugmasini bosgan lid.
- **Sinov darsi** — o'quvchi haqiqatan **kelgan** (darsda 20+ daqiqa o'tirgan) dars. Yozilgan, lekin kelmaganlar
  hisoblanmaydi — shuning uchun yozilgan sinovlar 10 tadan **ko'proq** bo'lishi kerak.
- **Sotuv** — o'quvchi kursga to'lov qildi va admin tasdiqladi (bron emas, to'liq to'lov).

Hisob misoli (motivatsiya uchun): oyiga 1 000 ta lid → 100 ta sinov → 30 ta sotuv. O'rtacha 550 000 so'mdan —
oyiga taxminan **16,5 mln so'm** tushum. Har +1% konversiya — sezilarli qo'shimcha pul.

### Yordamchi ko'rsatkichlar (qayerda yo'qotayotganimizni ko'rsatadi)
| Ko'rsatkich | Formula | Mo'ljal / izoh |
|---|---|---|
| Ko'tarilish | gaplashildi ÷ qo'ng'iroq | ~50% (taxminiy) |
| Sinovga yozish | sinovga yozildi ÷ gaplashildi | yozilganlar kelishi hisobiga 10% sinov darsiga yetadigan darajada |
| Ilova ✅ | ilovaga kirgan ÷ sinovga yozilgan | 100% ga yaqin (asosiy talab) |
| Darsga kelish | kelgan (20+ daq) ÷ sinovga yozilgan | iloji boricha yuqori; ilova ✅ va eslatma shuni oshiradi |
| Tez to'lov | 24 soat ichida to'laganlar ÷ to'laganlar | yuqori bo'lsin (ustoz dars oxirida taklif yuborsa oshadi) |
| Kunlik hajm | jami qo'ng'iroq / sinov | 200+ / 10+ |

Raqamlarni **o'ylab topmang** — adminkadagi haqiqiy hisobotdan oling. KPI'ni o'zgartirish — Sardorning qarori.

### "Teshik"ni qanday topish (diagnostika)
| Belgi | Ehtimoliy sabab | Nima qilish |
|---|---|---|
| Qo'ng'iroq kam | Operator kam, smena ochilmagan, natija tugmasi bosilmayapti | Smenadagilar sonini oshirish, "Bugun smena ochmagan" filtri |
| Gaplashildi ko'p, sinov kam | Vaqt so'ralmayapti yoki narx bilan sotishga urinilyapti | Yozuvlarni tinglash, skriptni qayta tushuntirish |
| Sinov ko'p, ilova ✅ kam | "Sinovga yozdi"dan keyin telefon qo'yilyapti | Ilovaga kirgizish qadamlarini qayta o'rgatish; guruhda "Ilova ✅ mi?" |
| Ilova ✅, lekin darsga kelmayapti | Eslatma qilinmayapti; dars uzoq kunga qo'yilgan | Eslatmalarni tekshirish (17:00), darsni bugun/ertaga qo'yish |
| Darsga keldi, to'lov yo'q (30% dan kam) | Ustoz dars oxirida taklif yubormayapti yoki kunlarni kelishmayapti | Ustoz bilan o'zingiz gaplashing (pastdagi "Ustozlar bilan ishlash"); "Davom etmoqchiman" so'rovlarini kuzatish |
| Taklif bor, to'lov kechikyapti | O'quvchi o'ylab qolgan, to'lov usuli tushunarsiz | Ustozga ayting: bron imkoniyatini taklif qilsin, 24 soat ichida o'quvchiga yozsin |
| Ustoz topilmayapti | Shu soatda bo'sh ustoz kam | Ustozlardan o'sha soatlarni jadvalda ochishni so'rang; yetmasa — Sardorga (yangi ustoz kerak) |

### Tijorat direktorining haftalik ritmi
- **Har kuni**: 11:00, 13:00, 15:00, 17:00 tekshiruvlari va 19:00 hisoboti (6-bo'lim).
- **Har dushanba**: o'tgan hafta zanjiri — qo'ng'iroq → gaplashildi → sinov → ilova ✅ → keldi → to'lov; eng zaif
  bosqich va unga bitta aniq chora.
- **Har juma**: eng yaxshi operator va eng yaxshi yozuv — guruhga namuna; sinov muddatidagilar bo'yicha qaror
  (kim qoladi).
- **Haftalik hisobot Sardorga (shablon)**:
  > 📈 {hafta} — sotuv hisoboti
  > Qo'ng'iroq: {N} · Gaplashildi: {N} ({%}) · Sinovga yozildi: {N} ({%}) · Ilova ✅: {N} ({%})
  > Darsga keldi: {N} ({%}) · To'lov: {N} ({%}) · Tushum: {summa}
  > KPI: lid → sinov {%} (mo'ljal 10%) · sinov → sotuv {%} (mo'ljal 30%)
  > Faol operatorlar: {N} (yangi: {N}, chiqib ketgan: {N})
  > 🔻 Eng zaif bosqich: {bosqich} — sabab: {…} · ➡️ Kelasi hafta: {bitta chora}

### Tijorat direktori qila oladigan "richaglar"
1. **Operatorlar soni va smena soatlari** — hajm shundan.
2. **Skript va o'qitish** — yozuvlarni tinglab, har operatorga bitta aniq maslahat.
3. **Ilova ✅ intizomi** — "rozi bo'ldi" emas, "ilovaga kirdi" sanaladi.
4. **Eslatmalar** — darsga kelishni oshiradi.
5. **Ustozlar bilan ishlash** (mustaqil) — sinovni sotuvga aylantirish: taklifni dars oxirida yuborish, tez javob berish.
6. **Motivatsiya** — guruhda kun yulduzi, birinchi sinovni nishonlash.

Narx, ish haqi stavkalari, ustoz ulushi va qoidalarni o'zgartirish — **Sardorning qarori**.

### Ustozlar bilan ishlash (Mahmud mustaqil)
Sinov darsidan keyingi 30% sotuv **ustozga** bog'liq: kursni ustoz sotadi. Mahmud ustozlarga to'g'ridan-to'g'ri
yozadi, ularni qo'llab-quvvatlaydi va natijani kuzatadi. Ustozlarga buyruq emas — **hamkor** sifatida gapiring:
ular ham shu sotuvdan pul oladi (24 soatlik bonus va har dars puli).

**Nimani kuzatadi**
- Sinov darsi o'tdi, lekin **natija belgilanmagan** (ustoz 24 soat ichida belgilamasa, unga −5 ball).
- Sinovdan keyin **taklif yuborilmagan** yoki o'quvchi "Davom etmoqchiman" bosgan, lekin ustoz javob bermagan.
- Taklif yuborilgan, 24 soat o'tib ketyapti — to'lov yo'q.
- Ustoz sinov so'rovlarini **qabul qilmayapti** (15 daqiqa ichida) yoki rad etyapti.
- Kechki "issiq" soatlarda **ochiq soatlari kam**.

**Ustozlarga eslatiladigan asosiy qoidalar** (ular buni akademiya va qo'llanmada o'qigan)
- Sinov darsi oxirida o'quvchi bilan **kun va soatni aniq kelishib**, shu yerning o'zida taklif yuborish.
- O'quvchi "shu vaqtlarni saqlab qo'ying, gaplashib to'layman" desa — bu jiddiy mijoz; soatlar 24 soat band turadi.
- "O'ylab ko'raman" deganlar ko'pincha qaytmaydi — shuning uchun taklif darsdan keyin darhol.
- 24 soat ichida to'lasa — ustozga **bitta dars puli bonus**.
- Bo'lmaydigan soatni oldindan yopish: rad etish −25 ball.

**Tayyor xabarlar ustozlarga**

*Sinovdan keyin taklif yuborilmagan bo'lsa*
> Assalomu alaykum, {Ism} ustoz! Bugungi sinov darsingiz uchun rahmat. {O'quvchi} bilan keyingi darslar kunini
> kelishdingizmi? Taklifni hozir yuborsangiz, 24 soat ichida to'lov ehtimoli ancha yuqori — va bonus sizniki 🙂

*O'quvchi "Davom etmoqchiman" bosgan, ustoz javob bermagan*
> {Ism} ustoz, {o'quvchi} davom etmoqchi ekan — ilovada so'rov qoldirdi. Imkon bo'lsa bugun qo'ng'iroq qilib,
> kunlarni kelishib taklif yuborsangiz. Issiq paytida ulgurib qolaylik.

*Natija belgilanmagan*
> {Ism} ustoz, {o'quvchi} bilan sinov darsining natijasini Work'da belgilab qo'ya olasizmi? 24 soat o'tsa ball
> ayiriladi, shuni eslatib qo'ymoqchi edim.

*Kechki soatlar kam*
> {Ism} ustoz, kechki 18:00–22:00 da sinov so'rovlari eng ko'p keladi. Jadvalingizda shu soatlardan bir nechtasini
> ochsangiz, sizga ko'proq o'quvchi tushadi.

*Yaxshi natija — maqtov*
> {Ism} ustoz, bu hafta {N} ta sinovdan {M} tasi to'lov qildi — zo'r natija! Rahmat 🔥

**Qachon Sardorga**: ustoz bilan nizo, ustozning o'quvchiga qo'pol munosabati yoki platformadan tashqari kelishuvi,
ulush yoki qoidalar bo'yicha talablar, ustozni chetlatish masalasi.

---

## 3. Operator qanday ishga olinadi (Mahmud bilishi kerak)

1. **Ariza** — nomzod vakansiya botiga yozadi, 3 ta qisqa savolga javob beradi (kuniga necha soat, qachondan,
   shartlar mosmi).
2. **Avto-qabul** — mos kelgan nomzodlar (kamida 4 soat ishlay oladi, shu hafta boshlay oladi, rozi) har kuni
   **09:00–21:00** oralig'ida, kunlik limit bo'yicha avtomatik qabul qilinadi. Qabul qilingach unga Telegram orqali
   **login va parol** boradi.
3. Nomzodlarning savollariga botdagi **AI yordamchi** javob beradi. Faqat tushunarsiz yoki jiddiy savollar Mahmudga
   keladi. Barcha yozishmalarni adminkadagi **"Operator arizalari" → Xabarlar** bo'limida ko'rish mumkin
   (AI javoblari "🤖 AI" belgisi bilan).
4. **Oferta** — operator shartlarni o'qib qabul qiladi.
5. **Akademiya** — 5 ta qisqa modul + 10 savollik test (o'tish: 8/10). Testdan o'tmaguncha **"Smenani boshlash"**
   tugmasi chiqmaydi.
6. **Birinchi smena** — "▶ Smenani boshlash" va qo'ng'iroqlar boshlanadi.
7. **Sinov muddati — 7 kun.** Kuniga 30 ta lid. **2 ish kuni smena ochmasa** yoki **3 ish kunida birorta o'quvchini
   sinovga yozmasa** — akkaunt avtomatik yopiladi.

---

## 4. Operator qancha ishlaydi

| Nima uchun | Summa |
|---|---|
| O'zi yozgan o'quvchi sinov darsida **20 daqiqadan ko'p** o'tirsa (kunning 1–5-sinovi) | **5 000 so'm** |
| Bir kunda **6-sinovdan boshlab**, har biri | **6 000 so'm** |
| O'sha o'quvchi kursga **to'lov qilsa** | yana **15 000 so'm** |

- Misol: kuniga 8 ta o'quvchi sinovga kelsa → 5 × 5 000 + 3 × 6 000 = **43 000 so'm**. 2 tasi to'lasa — yana 30 000.
- Pul faqat **o'zi "Sinovga yozdi" bosgan** o'quvchi uchun. Shuning uchun bu tugmani doim operatorning o'zi bosadi.
- Daromad panelda real vaqtda ko'rinadi ("💰 Bu oy ishlaganingiz", "Bugun 3/5 sinov").
- **Pul yechish**: balans **100 000 so'mdan** oshsa, kabinetdan Uzcard/Humo kartaga.

### Ballar (1 ball = 1 000 so'm, oy oxirida pulga aylanadi)
| Holat | Ball |
|---|---|
| Gaplashilgan qo'ng'iroq yozuvi 24 soat ichida yuklandi | +2 |
| Yozuv yuklanmadi | −2 |
| Rahbar namunali deb baholadi | +20 |
| Yaroqsiz yozuv (bo'sh, boshqa suhbat) | −10 |
| Kunlik minimum (4 soat smena) bajarilmadi | −10 |
| 6 soat va 20+ gaplashilgan qo'ng'iroq | +10 |

- Yakshanba — dam olish. Haftada yana **1 kun** sababsiz dam olish jarimasiz.
- **Oyni oxirigacha ishlamasa, ballar kuyadi.** Asosiy daromad (5 000 / 6 000 / 15 000) **hech qachon kuymaydi**.

---

## 5. Operatorning ishi — qadamma-qadam

### Bitta qo'ng'iroq
1. **Smenani boshlash** → lid (mijoz kartasi) o'zi chiqadi. Bir vaqtda bitta lid.
2. **Kartani o'qish (10 soniya)**: ism, raqam, qayerdan kelgan, oldingi qo'ng'iroqlar tarixi.
3. **Qo'ng'iroq** — o'z telefonidan, panel ichidagi **Skript** bo'yicha.
4. **Natija tugmasi** (har qo'ng'iroqdan keyin, majburiy):
   - ✅ **Sinovga yozdi** — bo'sh soat tanlanadi → ilovaga kirgizish boshlanadi.
   - 📵 **Javob bermadi** — tizim keyin o'zi qayta beradi; 3 marta javob bermasa lid yopiladi.
   - ⏰ **Keyinroq** — mijoz aytgan aniq vaqt yoziladi; mijoz 7 kun shu operatorga biriktiriladi.
   - ✖ **Qiziqmadi** — sababi tanlanadi (qimmat, vaqti yo'q, noto'g'ri raqam, boshqa joyda o'qiyapti).
5. Keyingi lid darhol chiqadi.

- 15 daqiqa hech narsa bosilmasa lid navbatga qaytadi. Suhbat cho'zilsa — **"Davom etyapman"**.
- Tanaffusga chiqsa — **"Smenani yakunlash"** (aks holda lidlar band bo'lib turadi).
- Navbat tartibi: 🔔 Eslatma → ⏰ Keyinroq → 🆕 Yangi → 😔 Darsga kelmaganlar → 📵 Javob bermaganlar → 📥 Baza.

### Skript (qisqa)
1. **Salom**: "Assalomu alaykum, {ism}! Men MyTeacher'dan {ismingiz}. Ingliz tili bo'yicha bepul sinov darsiga
   qiziqqan ekansiz. 2 daqiqa gaplasha olamizmi? Suhbat sifat nazorati uchun yozib olinadi."
2. **Ehtiyoj**: "Ingliz tili sizga nima uchun kerak: ish, o'qish, chet el yoki o'zingiz uchun? Hozir qaysi darajadasiz?"
3. **Taklif**: "Bizda shaxsiy ustoz bilan yakkama-yakka onlayn dars. Birinchi dars bepul: ustoz darajangizni aniqlaydi
   va reja tuzib beradi. Telefondan, uydan turib."
4. **Vaqt**: "Sizga bugun yoki ertaga qaysi vaqt qulay: ertalab, tushda yoki kechqurun?" → ✅ Sinovga yozdi.
5. **Telefonni qo'ymaslik** — ilovaga kirgizish (pastda).
6. **Yakun**: "Zo'r! Dars vaqtida ilovani ochasiz, darsingiz Kurslar bo'limida turadi. Darsdan oldin eslatib
   qo'ng'iroq qilaman. Rahmat!"

**Eng muhim gap**: vaqtni so'rash. "Qaysi vaqt qulay?" savolisiz odam o'zi "yozing" demaydi.

### Narx so'ralsa (rahbariyat qarori — so'zma-so'z)
> "Narx bilim darajangiz va o'rganish istagingizga qarab oyiga 350 000 so'mdan 850 000 so'mgacha. Bu narxlar faqat
> bizning bazamizdagi mijozlar uchun va faqat hozircha: hozir reklama bermayapmiz, faqat o'z bazamiz bilan
> ishlayapmiz. Keyingi oydan tizim to'liq ishga tushadi va narxlar oshadi. Sizga mosini ustoz bepul sinov darsida
> darajangizni ko'rib aytadi." → "Bugun 19:00 mi yoki ertaga 10:00 mi?"

**Mumkin emas**: chegirma va'da qilish, "bugun yozilsangiz arzon", "joy qolmadi", tariflarni sanab sotishga urinish.
Operatorning vazifasi — **narx bilan sotish emas, bepul darsga olib kelish**.

### Sinovga yozgandan keyin — telefonni qo'ymaydi
"Rozi bo'ldi" hali natija emas. Natija: o'quvchi **ilovaga kirgan** va darsini **Kurslar** bo'limida ko'ryapti.
Ilovaga kirmagan o'quvchining yarmidan ko'pi darsga kelmaydi. Panelda 3 belgi: **Telegram bot ulandi**,
**Ilovaga kirdi**, **Ustoz topildi**. Birinchi ikkitasi ✅ bo'lmaguncha suhbat tugamaydi.

1. **Vaqt** — iloji boricha bugun yoki ertaga (uzoq kunga qo'yilgan dars unutiladi).
2. **Telegram bot** — paneldagi havolani "Nusxalash" qilib mijozga yuboradi → mijoz **"Raqamni yuborish"** bosadi →
   login-parol keladi. **SMS yo'q.**
3. **Ilova**: Android — Play Market → "MyTeacher" (telefonda nomi "MyAI Teacher"). iPhone — hozircha **TestFlight**
   orqali: avval App Store'dan "TestFlight", keyin bizning havola (telefonda nomi "AI Teacher"). Eng uzun qadam (3–4 daq).
4. **Kirish** — Telegramdan kelgan login-parol bilan.
5. **Kurslar bo'limi** — darsi va ustozi shu yerda; dars boshlanishiga 10 daqiqa qolganda "Darsga kirish" tugmasi yonadi.
6. **Kamera va mikrofon** — sariq "Diqqat — muhim vazifa" kartasidagi tugma → "Ruxsat berish". Ruxsat bo'lmasa darsda ovoz bo'lmaydi.
7. **Yakun** va guruhga: "✅ {ism}, {kun, soat}, ilova ✅".

Mijoz "hozir vaqtim yo'q" desa: kamida **Telegram botni hozir ulasin** (30 soniya), ilovaga esa aniq vaqt kelishib
"⏰ Keyinroq".

### Eslatma qo'ng'irog'i (eng qisqa, eng muhim)
> "Assalomu alaykum, {ism}! MyTeacher'dan. Bugun soat {vaqt} da bepul sinov darsingiz bor, eslatib qo'ymoqchi edim.
> Ilovaga kirib, Kurslar bo'limini bir ochib ko'ring. Dars vaqtida 'Darsga kirish' tugmasi shu yerda yonadi."

Keyin "✅ Eslatildi". O'quvchi darsga kelsagina operatorga pul yoziladi — eslatma **hech qachon o'tkazib yuborilmaydi**.

### Qo'ng'iroqni yozib olish
- Tizim o'zi yozmaydi: operator **o'z telefonida** yozib oladi va panelning "📼 Bugungi qo'ng'iroqlarim" bo'limiga
  **24 soat ichida** yuklaydi (faqat gaplashilganlari).
- Android: Telefon ilovasi → ⋮ → Sozlamalar → "Qo'ng'iroqlarni yozib olish" → "Avtomatik". Bo'lmasa — Play Market'dan
  "Cube ACR".
- iPhone (iOS 18.1+): qo'ng'iroq paytida chap tepada yozish tugmasi, har safar qo'lda. Chiqmasa — Android telefondan ishlash.
- Yuklash: panelni **telefonning o'zida** brauzerda ochadi → qo'ng'iroqni topadi → faylni tanlaydi (Fayllar → Recordings / Call).

---

## 6. Mahmudning kuni

### Maqsad (boshlang'ich)
Kuniga **200+ qo'ng'iroq** va **10+ sinov darsi**, har bir sinov — **ilova ✅**.
Taxminiy hisob: 200 qo'ng'iroqdan ~100 tasi ko'taradi, ulardan 10–15% sinovga rozi bo'ladi.
4–5 ta faol operator bo'lsa bemalol bajariladi.

### Kun tartibi
| Vaqt | Mahmud nima qiladi | Shu vaqtgacha |
|---|---|---|
| 08:30–09:00 | Yangi operatorlarga tabrik xabari, guruh tayyor | Hamma guruhda |
| 09:00–10:00 | Login, oferta, akademiya bo'yicha yordam | Hamma akademiyadan o'tgan |
| 10:00 | Guruhga "Smenani oching" | Hamma smenada |
| 11:00 | 1-tekshiruv: kim nechta qo'ng'iroq qildi | Har biri ~8 qo'ng'iroq |
| 12:00 | Birinchi sinovlar: "Ilova ✅ mi?" | Jamoada 2–3 sinov |
| 13:00 | Yarim kun yakuni guruhga | 100 qo'ng'iroq / 5 sinov |
| 15:00 | Qolib ketayotgan operator bilan **shaxsiy** gaplashish | 150 / 7 |
| 17:00 | Eslatma qo'ng'iroqlari bajarilganini tekshirish | Bugungi darslarga eslatildi |
| 19:00 | Kun yakuni hisoboti (guruhga va Sardorga) | 200+ / 10+ |

### Adminkada qayerga qaraydi
- **Operatorlar** sahifasi — asosiy ekran. Har kartada "BUGUN" qatori (qo'ng'iroq, gaplashdi, yozdi, eslatdi).
  Filtrlar: "Hozir smenada", "Bugun smena ochmagan", "Akademiyani tugatmagan", "Oferta qabul qilinmagan",
  "Yozuvlar 50% dan kam", "Ro'yxatdan o'tgan → Oxirgi 7 kun".
- Karta tepasida "Smenada" va "Hozir: {mijoz}" — operator ayni damda kim bilan gaplashyapti.
- **Operator arizalari** — nomzodlar, qabul qilinganlar, Xabarlar, AI yordamchi, ommaviy xabar.
- **Boshqaruv** → "Sinov darslari" ro'yxati.
- **Yozuvlar** (kartadagi 📼): kuniga 2–3 ta qo'ng'iroqni tinglash, ayniqsa sinovga yozolmayotgan operatornikini.

### Operator qolib ketsa — sababini qanday topish
- **Qo'ng'iroq kam** (soatiga 5 dan kam): ko'pincha natija tugmasini bosmay o'tiradi yoki tanaffusi uzun → to'g'ridan-to'g'ri so'rash.
- **Qo'ng'iroq ko'p, sinov yo'q**: bitta yozuvini tinglash. Odatda narx bilan sotishga urinadi yoki vaqtni so'ramaydi.
- **Sinov bor, ilova yo'q**: "Sinovga yozdi"dan keyin telefonni qo'yib yuboryapti → ilovaga kirgizish qadamlarini qayta tushuntirish.

### Telegram guruh
- Bitta guruh ("MyTeacher operatorlar"), e'lonlar va natijalar uchun. Shaxsiy muammolar — Mahmudga shaxsiy chatda.
- Tepaga qadaladigan matn:
  > 📌 **Ish tartibi** • Ish vaqti: 10:00–19:00, tushlik 13:00–14:00 • Boshlaganda "Smenani boshlash", tugatganda
  > "Smenani yakunlash" • Lidlar faqat smena ochiq bo'lsa tushadi • Har sinovda guruhga: "✅ {ism}, {kun, soat}, ilova ✅"
  > • Har soat oxirida: "{N} qo'ng'iroq / {N} sinov" • Muammo bo'lsa Mahmudga shaxsiy yozing
- Guruhdagi har "✅" ga qisqa javob ("Zo'r! 🔥") — jamoaga energiya beradi.

### Kun yakuni hisoboti (shablon)
> 📊 {sana} — kun yakuni
> Smenaga chiqdi: {N} / {jami} operator · Qo'ng'iroq: {N} (maqsad 200) · Gaplashdi: {N}
> Sinovga yozildi: {N} (maqsad 10) — ilovaga kirgan: {N} · Keyinroq so'radi: {N}
> 🥇 Kun yulduzi: {ism} — {N} sinov · ⚠️ Muammo: {bir qator} · ➡️ Ertaga: {bitta o'zgarish}

---

## 7. Operatorlar bilan muloqot — Mahmud uchun qo'llanma

### Asosiy tamoyillar (uyalmaslik uchun)
1. **Siz yolg'iz emassiz**: qoidalar tayyor, raqamlar tizimda. Siz o'zingizdan o'ylab topmaysiz — faqat qoidani
   tushuntirasiz va yordam berasiz. Qiyin qarorlar Sardorda.
2. **Operatorlar ham yangi va ular ham uyaladi.** Birinchi bo'lib salomlashgan, maqtagan rahbarni ular yaxshi ko'radi.
3. **Qisqa va aniq yozing.** Bitta xabar — bitta fikr. Uzun xabarni hech kim o'qimaydi.
4. **Maqtovni hammaning oldida, tanqidni yolg'izda.** Guruhda — faqat yutuqlar; xato — shaxsiy chatda.
5. **Tanqid formulasi**: avval yaxshi tomoni → keyin bitta aniq narsa tuzatish → keyin ishonch bildirish.
   ("Bugun 40 ta qo'ng'iroq — zo'r! Bitta narsa: vaqtni so'ramayapsiz, shunda sinov bo'lmayapti. Ertaga har
   suhbat oxirida 'qaysi vaqt qulay?' deb ko'ring — ishonaman, sinovlar boshlanadi.")
6. **Raqam bilan gapiring, his bilan emas.** "Siz dangasasiz" emas — "Bugun 2 soat smena, 6 ta qo'ng'iroq".
7. **Va'da bermang.** Faqat bazadagi qoidalar. "Oylik", "kafolat", "oshirib beraman" — yo'q.
8. **Javob berishga shoshilmang.** Bilmasangiz: "Aniqlab, 10 daqiqada yozaman" — bu ham professional javob.

### Tayyor xabarlar

**Yangi operatorga tabrik (ertalab, har biriga alohida)**
> Assalomu alaykum, {Ism}! Men Mahmud, MyTeacher'da operatorlar jamoasining rahbariman. Jamoaga xush kelibsiz 🎉
> Bugun birinchi ish kuningiz. Reja oddiy:
> 1. Hozir sizni jamoa guruhiga qo'shaman.
> 2. Botdan kelgan login-parol bilan admin panelga kiring (havola guruhda).
> 3. Oferta va akademiya: 5 ta qisqa modul + 10 savollik test (~40 daqiqa). Shu vaqtda telefoningizda qo'ng'iroqni
>    yozib olishni ham yoqing — qanday qilishni guruhda ko'rsataman.
> 4. 10:00 da "Smenani boshlash" ni bosasiz va qo'ng'iroqlar boshlanadi.
> Har bir sinov darsiga kelgan o'quvchi uchun 5 000 so'm, bir kunda 6-sinovdan boshlab 6 000 so'm. To'lov qilsa yana
> 15 000 so'm sizniki. Savol bo'lsa shu yerga yozing.

**Javob bermagan operatorga (09:30)**
> {Ism}, bugun ishni boshlaysizmi? 10:00 da smena ochiladi. Bugun chiqa olmasangiz, ayting — joyingizni boshqaga beramiz.

**Smenaga chiqmagan operatorga (yumshoq, lekin aniq)**
> {Ism}, bugun smenada ko'rinmadingiz. Hammasi joyidami? Eslatib qo'yay: sinov muddatida 2 ish kuni smena ochilmasa,
> akkaunt avtomatik yopiladi. Ertaga 10:00 da chiqa olasizmi?

**Natija yo'q operatorga (3 kun ichida sinov yo'q bo'lsa — 2-kuni yozing)**
> {Ism}, qo'ng'iroqlaringiz bor — zo'r. Lekin hali sinov yo'q. Bitta yozuvingizni tinglab ko'rdim: suhbat yaxshi,
> faqat oxirida vaqtni so'ramayapsiz. Har suhbat oxirida "Bugun yoki ertaga qaysi vaqt qulay?" deb so'rang.
> Ertaga birinchi sinovingizni kutaman 💪

**Birinchi sinov yozgan operatorga (guruhda)**
> 🔥 {Ism} birinchi sinovini yozdi! Tabriklaymiz! Ilova ✅ mi?

**Kun yulduzi (guruhda)**
> 🥇 Bugungi kun yulduzi — {Ism}: {N} ta sinov! Rahmat, jamoaga namuna bo'ldingiz.

**Ish tashlamoqchi bo'lgan operatorga**
> {Ism}, fikringizni hurmat qilaman. Bir narsani so'rasam bo'ladimi: nima qiyin bo'lyapti? Ko'pincha birinchi 2–3 kun
> eng og'ir — keyin oson ketadi. Agar baribir qaror qilgan bo'lsangiz, hech gap yo'q, rahmat ishtirokingiz uchun.

**"Pul qachon beriladi?"**
> Pulingiz panelda real vaqtda ko'rinadi ("💰 Bu oy ishlaganingiz"). Balans 100 000 so'mdan oshsa, kabinetdan
> kartangizga yechib olasiz. Ballar esa oy oxirida pulga aylanadi.

**"Nega pulim kam / bonus tushmadi?"**
> Bonus o'quvchi sinov darsida 20 daqiqadan ko'p o'tirgandan keyin yoziladi va faqat o'zingiz "Sinovga yozdi"
> bosgan o'quvchi uchun. Qaysi o'quvchi ekanini yozing — tekshirib beraman.
> *(Mahmud: tekshira olmasangiz — Sardorga yuboring.)*

**Kech qolgan / tanaffusi uzun operatorga**
> {Ism}, smenangiz ochiq, lekin oxirgi soatda qo'ng'iroq yo'q. Tanaffusga chiqsangiz "Smenani yakunlash" ni bosing —
> aks holda lidlar sizda band bo'lib turadi va boshqalarga yetmaydi.

**Qo'pol yoki janjalli operatorga**
> {Ism}, tushunaman, kun og'ir bo'lishi mumkin. Lekin guruhda hurmat bilan yozishimiz kerak. Muammoingiz bo'lsa,
> menga shaxsiy yozing — birga hal qilamiz.
> *(Takrorlansa — Sardorga ayting. O'zingiz janjallashmang.)*

**Yozuv yuklamayotgan operatorga**
> {Ism}, bugun yozuvlaringiz yuklanmagan. Har yozuv uchun +2 ball (2 000 so'm), yuklanmasa −2. Telefonda avtomatik
> yozishni yoqsangiz, faqat yuklash qoladi — tanaffusda bir yo'la yuklab qo'ying.

### Qachon Sardorga yo'naltirish kerak
- Pul hisobida xato bor deb da'vo, to'lov o'tmagani (avval o'zingiz tekshiring).
- Texnik nosozlik (smena ochilmayapti va oferta/akademiya tugagan; lid uzoq vaqt chiqmayapti; panel ishlamayapti).
- Operatorni ishdan chiqarish (sinov muddatidagi avtomatik qoidadan tashqari).
- Shartlarni o'zgartirish, alohida kelishuv, qonuniy savollar.
- Mijozdan jiddiy shikoyat, operatorning qo'pol xatti-harakati takrorlansa.

---

## 8. Operatorlar beradigan savollar — tayyor javoblar

| Savol / holat | Javob |
|---|---|
| Smena ochilmayapti | Avval oferta va akademiya testi tugashi kerak. Tugagan bo'lsa — Sardorga. |
| Lid chiqmayapti | Smena ochiqmi? Sahifani yangilasin. "Navbat kutyapti" uzoq tursa — Sardorga. |
| Mijoz "qancha turadi?" | Narx matni (5-bo'lim), sotishga urinmaydi, vaqtni so'raydi. |
| Mijoz "o'ylab ko'ray" | "Dars bepul va hech narsaga majbur qilmaydi, faqat darajangizni bilib olasiz. Ertaga kechqurun bo'ladimi?" Baribir "keyin" — ⏰ Keyinroq + aniq vaqt. |
| Mijoz "vaqtim yo'q" | "Dars 45 daqiqa, uydan turib. Kechki 21:00 ham bor." Bo'lmasa — ⏰ Keyinroq. |
| Mijoz "ingliz tilini bilaman" | "Zo'r! Unda ustoz bilan erkin suhbat, IELTS yoki ish uchun tayyorlov bor." |
| Mijoz "ariza qoldirmaganman" | Uzr so'raydi → ✖ Qiziqmadi. |
| Mijoz "Telegramim yo'q" | Login faqat Telegramga keladi. Oila a'zosining Telegrami bo'ladi yoki o'rnatgach qayta qo'ng'iroq. |
| Mijoz "bolam uchun" | Bola nomidan yoziladi; bot va ilova ota-onaning telefonida; bola darsga o'sha telefondan kiradi. |
| iPhone'da ilova topilmayapti | Avval App Store'dan "TestFlight", keyin bizning havola. |
| Login-parol ishlamayapti | Botdagi xabardan bo'sh joysiz ko'chirsin; bo'lmasa botda "Raqamni yuborish" ni qayta bossin. |
| Darsda ovoz yo'q | Kamera/mikrofon ruxsati yo'q — Kurslar bo'limidagi sariq "Diqqat" kartasi. |
| Noto'g'ri raqam | ✖ Qiziqmadi → "Noto'g'ri raqam" (navbatga qaytmaydi). |
| Mijoz qo'pol gapirdi | Muloyim xayrlashadi → ✖ Qiziqmadi. Bahslashmaydi. |
| "Mijozim boshqa operatorga o'tib ketdi" | "Keyinroq" yoki "Sinovga yozdi"dan keyin mijoz 7 kun shu operatorniki. Belgilangan vaqtda smenada bo'lmasa, 24 soatdan keyin boshqaga o'tadi. |
| "Kunlik minimum qancha?" | 4 soat smena. Bajarilmasa −10 ball; 6 soat + 20 gaplashilgan qo'ng'iroq — +10. |
| "Dam olsam bo'ladimi?" | Yakshanba dam olish, haftada yana 1 kun jarimasiz. |
| "Do'stim mijoz raqamlarini so'rayapti" | Hech qachon bermaydi — taqiqlangan. |

---

## 9. Ustozlar va darslar (operatorlar so'rasa — qisqacha)

- **Sinov darsi** — bepul, 45–60 daqiqa. Ustoz darajani aniqlaydi, oxirida o'quvchi bilan kunlarni kelishib
  **taklif** yuboradi (haftada necha marta, kunlar, soat).
- **Bron**: o'quvchi hammasini darhol to'lay olmasa (ustoz ruxsat bersa), kamida 100 000 so'm to'lab soatlarni **3 kun**
  band qiladi; qolgani to'lanmasa soatlar bo'shaydi, bron summasi 15 kun saqlanib keyingi to'lovdan ayiriladi.
- To'lovdan keyin 4 haftalik darslar ustoz va o'quvchi jadvaliga tushadi.
- **Doimiy darslar qoidalari** (o'quvchi va ustoz kabinetida ham yozilgan):
  - O'quvchi darsni **12 soat oldin** o'zi ko'chira oladi — har 12 darsga 3 marta bepul, 1 ta favqulodda kupon.
  - Ustoz o'quvchini **15 daqiqa** kutadi. Kelmasa — birinchi kelmaslik kechiriladi (dars oxiriga suriladi),
    keyingilarida dars o'tilgan hisoblanadi.
- O'quvchilar uchun yordam boti: **@MT_yordam_bot**.

---

## 10. Taqiqlar (hamma uchun)

- Mijoz raqamlari va qo'ng'iroq yozuvlarini boshqalarga berish.
- Mijozni aldash, bosim o'tkazish, chegirma yoki "bugun oxirgi kun" kabi o'ylab topilgan gaplar.
- Mijoz bilan platformadan tashqari kelishish.
- Ma'lumotlardan shaxsiy maqsadda foydalanish.

---

## 11. Lug'at

| So'z | Ma'nosi |
|---|---|
| **Lid** | Ingliz tiliga qiziqqan, qo'ng'iroq qilinadigan odam (mijoz kartasi). |
| **Smena** | Operatorning ish vaqti; "Smenani boshlash" bosilgandan "Smenani yakunlash" gacha. Lidlar faqat smenada tushadi. |
| **Sinov darsi** | Bepul birinchi dars (45–60 daq). |
| **Ilova ✅** | O'quvchi Telegram botga ulangan va ilovaga kirgan — sinov "haqiqiy" hisoblanadi. |
| **Eslatma** | Dars kuni o'quvchiga qilinadigan qisqa qo'ng'iroq. |
| **Akademiya** | Operatorning 5 modulli o'quv kursi va testi. |
| **Oferta** | Operator bilan hamkorlik shartlari. |
| **Avto-qabul** | Mos nomzodlarni tizim o'zi qabul qilishi (09:00–21:00, kunlik limit). |
| **Sinov muddati** | Operatorning birinchi 7 kuni (qattiq qoidalar bilan). |
| **Ball** | Intizom va yozuvlar uchun; 1 ball = 1 000 so'm, oy oxirida. |
| **Taklif / Bron** | Ustozning sinovdan keyingi kurs taklifi / soatlarni qisman to'lov bilan band qilish. |
