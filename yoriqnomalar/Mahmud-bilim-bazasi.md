# MyTeacher — Mahmud uchun bilim bazasi

> Versiya: 2026-10-06. Bu hujjat — tijorat direktori Mahmud va uning AI yordamchisi uchun yagona manba.
> Raqamlar va qoidalar tizimdagi (kod) qiymatlar bilan bir xil. Biror narsa o'zgarsa — shu fayl yangilanadi.
> Bu yerda yo'q savol chiqsa: **Sardorga yoziladi**, javob shu faylga qo'shiladi.

> 🎯 **Eng muhimi — SOTUV.** Kompaniyadagi har bir ish — operatorlar, ustozlar, ilova — bitta natijaga xizmat
> qiladi: **odam bepul darsga keladi va to'lov qiladi.** Har kuni o'zingizdan so'rang: "Bugun nechta odam to'ladi
> va ertaga ko'proq to'lashi uchun nima qilaman?"

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
   Sardor (asoschi va CEO) Mahmudga yordam berishga **doim ochiq** — savol berishdan uyalmaslikni eslat:
   so'rash — xato emas, professionallik.
4. Pul, ish haqi, ishdan bo'shatish, nizo, qonuniy savol, kompaniya siri — **ehtiyot bo'l**: bazadagi qoidani ayt,
   undan tashqari va'da berma, qaror kerak bo'lsa Sardorga yo'naltir.
5. Mijozlar (o'quvchilar) va operatorlarning shaxsiy ma'lumotlarini hech kimga berish mumkin emas.
6. Mahmudni qo'llab-quvvatla: u yaxshi qilgan narsani ham ayt. Lekin xato bo'lsa — muloyim, aniq ayt.
7. **Har doim sotuvni markazda tut.** Har maslahatning oxirida o'zingdan so'ra: "Bu sotuvni oshiradimi?"
   Mahmud boshqa ishga berilib ketsa (hisobot bezash, uzun yozishma), muloyim qilib asosiy savolga qaytar:
   "Bugun nechta sinov bo'ldi va nechtasi to'ladi?"
8. Mahmud biznes atamasini so'rasa — **yangi talabaga tushuntirgandek** javob ber: oddiy so'z bilan ta'rif →
   MyTeacher misoli (raqam bilan) → "Bu sotuvga qanday ta'sir qiladi?" → kerak bo'lsa bitta tekshiruv savoli.
   Uzun nazariya yo'q; bitta javob — bitta tushuncha.
9. Mahmud "mashq qilaylik" desa — sen operator rolini o'ynaysan (yangi, uyatchan, norozi, kechikkan va h.k.),
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
| **Operator paneli** (ai.myteacher.uz/operator) | Operator | Lid navbati, skript, natija tugmalari, daromad |
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

## 2. Biznes asoslari — eng muhimi: SOTUV

> Bu bo'lim yangi talabaga tushuntirgandek yozilgan. Har tushuncha: oddiy ta'rif → MyTeacher misoli → sotuvga
> qanday ta'sir qiladi. Misollardagi raqamlar **tushuntirish uchun** (haqiqiy hisobot — adminkada).

### Nega SOTUV eng muhimi
Kompaniyani bitta daraxt deb tasavvur qiling: ilova, ustozlar, operatorlar, reklama — shoxlar. **Sotuv — ildiz.**
Ildiz suv bermasa, eng chiroyli shox ham quriydi.

- Ustozlarning ish haqi, operatorlarning bonusi, ilovani yaxshilash, ofis, reklama — **hammasi o'quvchi
  to'lagan puldan** to'lanadi. Boshqa manba yo'q.
- Eng zo'r ilova ham, eng yaxshi ustoz ham — **o'quvchi to'lamasa** kompaniya uchun ishlamaydi.
- Shuning uchun tijorat direktorining bitta asosiy savoli bor: **"Bugun nechta odam to'ladi va ertaga ko'proq
  to'lashi uchun nima qilaman?"**
- Har ish sotuvga yo yaqinlashtiradi, yo uzoqlashtiradi. Ish boshlashdan oldin so'rang: **"Bu sotuvni
  oshiradimi?"** Javob "yo'q" bo'lsa — ehtimol, hozir bu eng muhim ish emas.

Sotuv — bu "odamni aldab pul olish" **emas**. Sotuv — odamga haqiqatan kerak narsani (ingliz tili, yangi ish,
o'qish, chet el) **olishiga yordam berish**. Biz sotsak — o'quvchi o'sadi, ustoz pul topadi, kompaniya o'sadi.
Shuning uchun sotuvdan uyalish kerak emas: yaxshi mahsulotni yetkazmaslik — odamga yaxshilik qilmaslik.

### Kompaniyaning asosiy maqsadi
**Ko'proq odam to'lasin va uzoqroq o'qisin** — shunda kompaniya foyda bilan o'sadi.
Hozirgi bosqichdagi aniq maqsadlar:
1. **Sotuv zanjirini ishlatib yuborish**: 100 lid → 10 sinov darsi → 3 sotuv (3-bo'limdagi "Sotuv tizimi").
2. **Barqaror operatorlar jamoasi**: sinov muddatidan o'tib, har kuni ishlaydigan operatorlar.
3. **O'quvchilarni ushlab qolish**: to'lagan o'quvchi keyingi oyga ham uzaytirsin.
4. Keyingi oydan, reklama boshlanganda — shu zanjirni katta hajmga tayyor qilish.

### Asosiy atamalar (lug'at + misol)

**Lid** — mahsulotimizga qiziqish bildirgan, hali to'lamagan odam.
*Misol:* bepul darsga ariza qoldirgan Ali — lid. *Sotuvga ta'siri:* lid — sotuvning "xom ashyosi"; lid
bo'lmasa sotuv ham bo'lmaydi.

**Voronka (funnel)** — odamning "qiziqdi"dan "to'ladi"gacha bosib o'tadigan bosqichlari. Har bosqichda kimdir
tushib qoladi, shuning uchun u yuqorida keng, pastda tor — xuddi voronka (huni) kabi.
*Misol:* 100 lid → 50 tasi telefonni ko'tardi → 15 tasi sinovga yozildi → 10 tasi darsga keldi → 3 tasi to'ladi.

**Konversiya** — bir bosqichdan keyingisiga o'tganlar ulushi (foizda).
*Formula:* keyingi bosqichdagilar ÷ oldingi bosqichdagilar × 100%.
*Misol:* 10 ta sinovdan 3 tasi to'ladi → sinov → sotuv konversiyasi 30%.
*Sotuvga ta'siri:* lid sonini oshirmasdan ham, konversiyani oshirib ko'proq sotish mumkin. Bu eng arzon o'sish.

**KPI** (asosiy ko'rsatkich) — ish yaxshi ketyaptimi, bilish uchun kuzatiladigan bir nechta raqam.
*Misol:* bizning KPI — 100 lid → 10 sinov → 3 sotuv. *Muhim:* KPI ko'p bo'lmaydi — 2–3 ta, hamma biladi.

**Tushum (daromad, revenue)** — mijozlar to'lagan pulning jami.
*Misol:* oyiga 30 o'quvchi × 550 000 = 16 500 000 so'm tushum.

**Foyda** — tushumdan barcha xarajatlar ayirilgandan keyin qolgani.
*Misol:* 550 000 to'lagan o'quvchidan: ustoz ulushi (60% bo'lsa) 330 000, operator bonusi 5 000 + 15 000,
soliq va boshqa xarajatlar — qolgani kompaniyaga. *Muhim:* "tushum ko'p" ≠ "foyda ko'p".

**O'rtacha chek (ARPU)** — bitta o'quvchi o'rtacha qancha to'laydi.
*Formula:* tushum ÷ to'lagan o'quvchilar soni.
*Misol:* ko'pchilik haftada 3 marta (550 000) olsa — o'rtacha chek ~550 000.
*Sotuvga ta'siri:* o'quvchiga haftada 2 emas 3 dars kerak bo'lsa, ustoz shuni taklif qiladi — chek oshadi.
Lekin majburlab emas: o'quvchi ko'tara olmaydigan tarif — ertaga to'xtatish degani.

**Mijozni jalb qilish narxi (CAC)** — bitta to'lagan o'quvchini topish uchun sarflangan pul.
*Formula:* sotuvga ketgan jami xarajat (operator bonuslari, reklama…) ÷ yangi to'lagan o'quvchilar.
*Misol:* hozir reklama yo'q, asosiy xarajat — operator bonuslari: 10 sinov × 5 000 + 3 to'lov × 15 000 = 95 000
so'm → 3 o'quvchi → bitta o'quvchi ~32 000 so'm. Reklama boshlansa, CAC oshadi — shuning uchun konversiyani
**hozirdan** yaxshi qilish kerak.

**Mijozning umrboqiy qiymati (LTV)** — bitta o'quvchi biz bilan qolgan butun vaqtida qancha pul olib keladi.
*Formula:* o'rtacha chek × necha oy o'qiydi.
*Misol:* 550 000 × 4 oy = 2 200 000 so'm. *Qoida:* LTV CAC'dan ancha katta bo'lishi kerak — aks holda har yangi
o'quvchi zarar.

**Uzaytirish (retention) va ketish (churn)** — to'lagan o'quvchilardan keyingi oyga ham to'laganlar ulushi va
to'xtatganlar ulushi.
*Misol:* 30 o'quvchidan 24 tasi keyingi oyga uzaytirdi → retention 80%, churn 20%.
*Sotuvga ta'siri:* eski o'quvchini ushlab qolish yangisini topishdan **ancha arzon**. Darslar sifatli o'tsa,
o'quvchi o'sishini his qilsa — o'zi uzaytiradi va do'stini olib keladi.

**Unit-ekonomika** — "bitta o'quvchida biz pul topyapmizmi yoki yo'qotyapmizmi?" degan hisob (LTV va CAC,
ustoz ulushi, xarajatlar). Bu hisob ijobiy bo'lsa — ko'proq sotish = ko'proq foyda.

**Sotuv tsikli** — liddan to'lovgacha o'tadigan vaqt.
*Misol:* bugun qo'ng'iroq → ertaga sinov → dars oxirida taklif → 24 soat ichida to'lov = 1–2 kun.
*Sotuvga ta'siri:* tsikl qanchalik qisqa bo'lsa, odam shunchalik kam "sovib qoladi". Shuning uchun: dars
bugun/ertaga, taklif dars oxirida, to'lov 24 soat ichida.

**Issiq / sovuq lid** — hozir qiziqib turgan (issiq) va vaqt o'tib sovib qolgan (sovuq) odam.
*Misol:* hozirgina ariza qoldirgan — issiq; 3 oy oldin qoldirgan — sovuq. Issiq lidga **darhol** qo'ng'iroq qilinadi.

**E'tiroz** — mijozning "yo'q" yoki "keyin" deganining sababi ("qimmat", "vaqtim yo'q", "o'ylab ko'raman").
*Muhim:* e'tiroz — rad emas, savol. Javobi tayyor bo'lsa, ko'p hollarda "ha"ga aylanadi (9-bo'limdagi jadval).

**CRM / pipeline** — har bir mijoz qaysi bosqichda ekanini ko'rsatadigan tizim. Bizda bu — **admin panel**
(lid holatlari, sinov darslari, takliflar, to'lovlar).

**Hajm × konversiya × chek** — sotuvni oshirishning faqat uchta yo'li bor:
1. **Hajm** — ko'proq lid va qo'ng'iroq (ko'proq operator, ko'proq smena soati).
2. **Konversiya** — har bosqichda kamroq odam yo'qotish (skript, ilova ✅, eslatma, taklifni darhol yuborish).
3. **Chek / uzaytirish** — o'quvchiga mos tarif va sifatli darslar (u uzoq qoladi).
Har qanday g'oyani shu uchtadan qaysi biriga ta'sir qilishi bilan baholang.

### Asosiy metrikalar — tijorat direktorining "panel"i
| Metrika | Nimani ko'rsatadi | Qayerdan olinadi | Qanchalik tez-tez |
|---|---|---|---|
| **Sotuvlar soni va tushum** | Asosiy natija | To'lovlar, takliflar | Har kuni |
| **Lid → sinov** (mo'ljal 10%) | Operatorlar ishining sifati | Operatorlar, sinov darslari | Har kuni |
| **Sinov → sotuv** (mo'ljal 30%) | Ustozlar va taklif sifati | Sinov darslari, takliflar | Har kuni / haftasiga |
| **Darsga kelish** | Ilova ✅ va eslatma intizomi | Sinov darslari | Har kuni |
| **Qo'ng'iroqlar / faol operatorlar** | Hajm | Operatorlar sahifasi | Har kuni |
| **O'rtacha chek** | Tariflar to'g'ri tanlanyaptimi | To'lovlar | Haftasiga |
| **Uzaytirish (retention)** | O'quvchilar qolyaptimi | Obunalar | Oyiga |
| **CAC va LTV** | Sotuv foydalimi | Sardor bilan birga hisoblanadi | Oyiga |

### Tijorat direktorining fikrlash tarzi (5 qoida)
1. **Raqam bilan o'ylang.** "Yaxshi ketyapti" emas — "bugun 12 sinov, 4 sotuv, konversiya 33%".
2. **Eng tor joyni tuzating.** Voronkaning qaysi bosqichida eng ko'p odam tushib qolyapti — avval o'shani.
3. **Bitta haftada bitta o'zgarish.** Ko'p narsani birdan o'zgartirsangiz, nima ishlaganini bilmay qolasiz.
4. **Har kun sotuvga yaqin bo'ling.** Operator qo'ng'iroqlarini yonida eshiting, ustozlar bilan gaplashing, o'quvchi nima deyotganini
   eshiting — eng yaxshi g'oyalar shu yerdan chiqadi.
5. **Kichik g'alabalarni nishonlang.** Birinchi sinov, birinchi sotuv, kun yulduzi — jamoa shundan kuch oladi.

### O'zingizni tekshiring (talaba kabi)
1. 200 ta liddan 16 ta sinov darsi bo'ldi. Lid → sinov konversiyasi qancha? *(Javob: 8% — mo'ljaldan past.)*
2. 16 ta sinovdan 6 tasi to'ladi. Sinov → sotuv konversiyasi qancha? *(37,5% — mo'ljaldan yuqori.)*
3. Qo'ng'iroqlar ko'p, sinov kam. Voronkaning qaysi bosqichi "tor"? Birinchi nima qilasiz?
   *(Gaplashildi → sinov; qo'ng'iroqni yonida eshitib, vaqt so'ralyaptimi tekshiraman.)*
4. Sotuvni oshirishning uchta yo'li qaysi? *(Hajm, konversiya, chek/uzaytirish.)*
5. Nega hozir, reklama yo'q paytda, konversiyani yaxshilash muhim? *(Reklama boshlansa har lid pulga tushadi —
   CAC oshadi; yaxshi konversiya shu pulni tejaydi.)*

---

## 3. Sotuv tizimi: lid → sinov darsi → to'lov (tijorat direktori uchun)

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
| Gaplashildi ko'p, sinov kam | Vaqt so'ralmayapti yoki narx bilan sotishga urinilyapti | Qo'ng'iroqni yonida eshitish, skriptni qayta tushuntirish |
| Sinov ko'p, ilova ✅ kam | "Sinovga yozdi"dan keyin telefon qo'yilyapti | Ilovaga kirgizish qadamlarini qayta o'rgatish; guruhda "Ilova ✅ mi?" |
| Ilova ✅, lekin darsga kelmayapti | Eslatma qilinmayapti; dars uzoq kunga qo'yilgan | Eslatmalarni tekshirish (17:00), darsni bugun/ertaga qo'yish |
| Darsga keldi, to'lov yo'q (30% dan kam) | Ustoz dars oxirida taklif yubormayapti yoki kunlarni kelishmayapti | Ustoz bilan o'zingiz gaplashing (pastdagi "Ustozlar bilan ishlash"); "Davom etmoqchiman" so'rovlarini kuzatish |
| Taklif bor, to'lov kechikyapti | O'quvchi o'ylab qolgan, to'lov usuli tushunarsiz | Ustozga ayting: bron imkoniyatini taklif qilsin, 24 soat ichida o'quvchiga yozsin |
| Ustoz topilmayapti | Shu soatda bo'sh ustoz kam | Ustozlardan o'sha soatlarni jadvalda ochishni so'rang; yetmasa — Sardorga (yangi ustoz kerak) |

### Tijorat direktorining haftalik ritmi
- **Har kuni**: 11:00, 13:00, 15:00, 17:00 tekshiruvlari va 19:00 hisoboti (7-bo'lim).
- **Har dushanba**: o'tgan hafta zanjiri — qo'ng'iroq → gaplashildi → sinov → ilova ✅ → keldi → to'lov; eng zaif
  bosqich va unga bitta aniq chora.
- **Har juma**: eng yaxshi operator va eng yaxshi suhbat usuli — guruhga namuna; sinov muddatidagilar bo'yicha qaror
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
2. **Skript va o'qitish** — qo'ng'iroqlarni yonida eshitib, har operatorga bitta aniq maslahat.
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

## 4. Operator qanday ishga olinadi (Mahmud bilishi kerak)

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

## 5. Operator qancha ishlaydi

| Nima uchun | Summa |
|---|---|
| O'zi yozgan o'quvchi sinov darsida **20 daqiqadan ko'p** o'tirsa (kunning 1–5-sinovi) | **5 000 so'm** |
| Bir kunda **6-sinovdan boshlab**, har biri | **6 000 so'm** |
| O'sha o'quvchi kursga **to'lov qilsa** | yana **15 000 so'm** |

- Misol: kuniga 8 ta o'quvchi sinovga kelsa → 5 × 5 000 + 3 × 6 000 = **43 000 so'm**. 2 tasi to'lasa — yana 30 000.
- Pul faqat **o'zi "Sinovga yozdi" bosgan** o'quvchi uchun. Shuning uchun bu tugmani doim operatorning o'zi bosadi.
- Daromad panelda real vaqtda ko'rinadi ("💰 Bu oy ishlaganingiz", "Bugun 3/5 sinov").
- **Pul yechish**: balans **100 000 so'mdan** oshsa, kabinetdan Uzcard/Humo kartaga.

### Intizom ballari (1 ball = 1 000 so'm, oy oxirida pulga aylanadi)
| Holat | Ball |
|---|---|
| Kunlik minimum (4 soat smena) bajarilmadi | −10 |
| 6 soat va 20+ gaplashilgan qo'ng'iroq | +10 |

- Yakshanba — dam olish. Haftada yana **1 kun** sababsiz dam olish jarimasiz.
- **Oyni oxirigacha ishlamasa, ballar kuyadi.** Asosiy daromad (5 000 / 6 000 / 15 000) **hech qachon kuymaydi**.

---

## 6. Operatorning ishi — qadamma-qadam

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

---

## 7. Mahmudning kuni

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
  "Ro'yxatdan o'tgan → Oxirgi 7 kun".
- Karta tepasida "Smenada" va "Hozir: {mijoz}" — operator ayni damda kim bilan gaplashyapti.
- **Operator arizalari** — nomzodlar, qabul qilinganlar, Xabarlar, AI yordamchi, ommaviy xabar.
- **Boshqaruv** → "Sinov darslari" ro'yxati.
- **Qo'ng'iroqlarni eshitish**: kuniga 2–3 marta operator yonida (yoki karnay orqali) eshitish, ayniqsa sinovga
  yozolmayotgan operatornikini. Tizimda qo'ng'iroq yozuvlari yo'q.

### Operator qolib ketsa — sababini qanday topish
- **Qo'ng'iroq kam** (soatiga 5 dan kam): ko'pincha natija tugmasini bosmay o'tiradi yoki tanaffusi uzun → to'g'ridan-to'g'ri so'rash.
- **Qo'ng'iroq ko'p, sinov yo'q**: bitta qo'ng'iroqini yonida eshitish. Odatda narx bilan sotishga urinadi yoki vaqtni so'ramaydi.
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

## 8. Operatorlar bilan muloqot — Mahmud uchun qo'llanma

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
> {Ism}, qo'ng'iroqlaringiz bor — zo'r. Lekin hali sinov yo'q. Bitta qo'ng'iroqingizni eshitdim: suhbat yaxshi,
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

### Qachon Sardorga yo'naltirish kerak
Sardor yordam berishga **doim ochiq**. Ikkilansangiz — so'rang: noto'g'ri qaror qilgandan ko'ra 5 daqiqa
maslahatlashgan yaxshi. Quyidagi holatlarda esa albatta Sardorga yozing:
- Pul hisobida xato bor deb da'vo, to'lov o'tmagani (avval o'zingiz tekshiring).
- Texnik nosozlik (smena ochilmayapti va oferta/akademiya tugagan; lid uzoq vaqt chiqmayapti; panel ishlamayapti).
- Operatorni ishdan chiqarish (sinov muddatidagi avtomatik qoidadan tashqari).
- Shartlarni o'zgartirish, alohida kelishuv, qonuniy savollar.
- Mijozdan jiddiy shikoyat, operatorning qo'pol xatti-harakati takrorlansa.

---

## 9. Operatorlar beradigan savollar — tayyor javoblar

| Savol / holat | Javob |
|---|---|
| Smena ochilmayapti | Avval oferta va akademiya testi tugashi kerak. Tugagan bo'lsa — Sardorga. |
| Lid chiqmayapti | Smena ochiqmi? Sahifani yangilasin. "Navbat kutyapti" uzoq tursa — Sardorga. |
| Mijoz "qancha turadi?" | Narx matni (6-bo'lim), sotishga urinmaydi, vaqtni so'raydi. |
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

## 10. Ustozlar va darslar (operatorlar so'rasa — qisqacha)

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

## 11. Taqiqlar (hamma uchun)

- Mijoz raqamlari va ma'lumotlarini boshqalarga berish.
- Mijozni aldash, bosim o'tkazish, chegirma yoki "bugun oxirgi kun" kabi o'ylab topilgan gaplar.
- Mijoz bilan platformadan tashqari kelishish.
- Ma'lumotlardan shaxsiy maqsadda foydalanish.

---

## 12. Lug'at

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
| **Ball** | Intizom uchun; 1 ball = 1 000 so'm, oy oxirida. |
| **Taklif / Bron** | Ustozning sinovdan keyingi kurs taklifi / soatlarni qisman to'lov bilan band qilish. |
| **Voronka, konversiya, KPI, tushum, foyda, o'rtacha chek, CAC, LTV, retention** | 2-bo'limda — misollar bilan. |
