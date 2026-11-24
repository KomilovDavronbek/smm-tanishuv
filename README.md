# SMM Tanishuv tizimi

Najot Ta'lim SMM kursining birinchi darsi uchun tanishuv tizimi. O'quvchilar havola yoki QR-kod orqali ism, yosh, hudud, maktab va qiziqishlarini kiritadi. Tizim ularni proyektor ekranida eng mos guruhlarga avtomatik bo'ladi.

**Muallif:** Komilov Davronbek — Najot Ta'lim SMM ustozi

## Sahifalar

- `/ekran` — ustoz ekrani (proyektor uchun). Har ochilganda guruh kodi va QR-kod beriladi.
- `/?g=KOD` — o'quvchilar formasi (QR-kod shu havolaga olib boradi).

## Qanday guruhlaydi

Har bir juftlik uchun moslik balli hisoblanadi: umumiy qiziqish +3, bir maktab +3, bir hudud +2, yosh farqi 1 yilgacha +1 (3 yilgacha +0,5). Keyin o'quvchilar teng hajmli guruhlarga bo'linadi va almashtirishlar orqali umumiy moslik eng yuqori bo'lguncha yaxshilanadi.

## Texnologiya

- Statik sahifa (`public/index.html`), Vercel Serverless Functions (`api/`)
- Ma'lumotlar: Upstash Redis (Vercel Marketplace orqali ulanadi, `KV_REST_API_URL` va `KV_REST_API_TOKEN` avtomatik qo'shiladi)
- Ma'lumotlar 60 kundan keyin avtomatik o'chadi
