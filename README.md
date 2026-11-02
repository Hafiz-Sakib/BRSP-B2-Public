<div align="center">

<img src="src/assets/logos/brta.png" alt="BRTA logo" width="88" />

# BRSP Batch 2 — Public Site

**BRSP Batch 2 (Morning) · BRTC Chattogram — course info, admission & medical forms, student list, shuttle-train schedule.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)

</div>

---

## Public vs. private version

This is the **public-safe** edition of the BRSP car-wash roster app. Intentionally **not included**:

- ❌ Student mobile numbers (BSP / bKash / WhatsApp) — no data, no columns, no search by number
- ❌ Duty roster page, WhatsApp reminder buttons and holiday notice
- ❌ Attendance (হাজিরা) PDFs

Still included: course info (Bangla), admission form + medical certificate form, photo gallery, student list (photo, name, reg, father's name), CU shuttle-train schedule, **instructor contact number** (tap-to-call), PWA install/offline.

## Font

All text uses **Kalpurush** (Bangla), self-hosted from `src/assets/fonts/` (SIL OFL 1.1 — see `OFL.txt`). Kalpurush ships only a Regular weight, so bold text is browser-synthesised. Font is set in `src/index.css` (`@font-face`) and `tailwind.config.js` (`fontFamily.sans`).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
```

Node.js 18+ required. Service worker runs only in production builds.

## Structure

```text
public/                    forms (PDF), favicons, PWA icons, train-schedule.png
src/
├── assets/                logos, students/<reg>.jpg, gallery/, fonts/, photos
├── components/            Navbar, HomePage, StudentList, TrainSchedule, Gallery, …
├── data/
│   ├── batch.js           ⭐ batch, instructor (+phone), forms, MEMBERS (no phone numbers)
│   ├── course.js          Home page course text (Bangla)
│   ├── train.js           shuttle times, route, contacts
│   └── avatars.js         auto-maps students/<reg>.jpg → reg number
├── utils/search.js        Bangla/English-aware search (name, reg, father's name)
└── App.jsx
```

## Updating data

| Task | Edit |
|---|---|
| Add / remove student | `MEMBERS` in `src/data/batch.js` (`id`, `name`, `alias`, `father`) |
| Student photo | drop `<reg>.jpg` (English digits, JPG/PNG/WebP, not HEIC) in `src/assets/students/` |
| Instructor info / phone | `INSTRUCTOR_*` in `src/data/batch.js` |
| Forms | replace PDFs in `public/`; edit `FORMS` in `batch.js` |
| Course text | `src/data/course.js` |
| Train times / contacts | `src/data/train.js` |
| Brand colours | `colors.brsp` in `tailwind.config.js` |

> ⚠️ Never add student phone numbers to `MEMBERS` in this repo — it is meant to be public.

## Deploy (Vercel)

Framework preset **Vite**, build `npm run build`, output `dist`. `vercel.json` sets no-cache for `/sw.js`.

---

<div align="center">

Made with ❤️ for **BRSP Batch 2 – Morning** · BRTC Chattogram Bus Depot & Training Centre<br/>
Built by [Mohammad Hafizur Rahman Sakib](https://github.com/hafiz-sakib)

</div>
