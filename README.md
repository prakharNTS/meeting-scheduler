# Meeting Scheduler (React + Vite + Tailwind CSS)

A modular meeting scheduler UI built with **React + Vite + JavaScript** and **Tailwind CSS**. Pick dates on a calendar, auto-assign meetings with a class-balanced algorithm, edit entries in a modal, filter the overview, and export to Excel (with CSV fallback).

## ✨ Features

- Calendar with multi-date selection and per-day meeting chips
- Auto-scheduler (age-priority + class-balanced round-robin + light load balancing)
- Filter by class or student
- Edit meeting in a modal (dropdowns for Student and Class)
- Export to **.xlsx** via dynamic `xlsx` import, or fallback CSV if `xlsx` isn’t installed
- Clean, modular folder structure

## 🧱 Tech Stack

- **React ** + **Vite**
- **Tailwind CSS** (zero-config with `@tailwindcss/vite`)
- Optional: **xlsx** for Excel export

---

## ⏱ Quick Start

> Prereqs: Node.js **18+** (Node 20+ recommended) and npm.

```bash
# 1) Create a fresh Vite React app (if you don't already have one)
npm create vite@latest meeting-scheduler -- --template react

cd meeting-scheduler

# 2) Install deps
npm install

# 3) Install Tailwind v4-style integration (no config needed)
npm install -D tailwindcss @tailwindcss/vite

# 4) (Optional) For Excel export
npm install xlsx
```

### 5) Wire Tailwind into Vite

Create or edit **vite.config.js** at the project root:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
});
```

### 6) Add app styles

Create **src/styles.css** and import Tailwind (v4 zero‑config):

```css
@import "tailwindcss";

/* Optional helpers so custom classes keep working */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1; /* slate-300 */
  border-radius: 0.75rem; /* xl */
  background: white;
  cursor: pointer;
}
.btn:hover {
  background: #f8fafc;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  color: #475569; /* slate-600 */
  background: white;
}

.badge {
  display: inline-flex;
  border: 1px solid #e2e8f0; /* slate-200 */
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  color: #334155; /* slate-700 */
  font-size: 0.75rem;
}
```

Then ensure your app imports `styles.css` (either in **main.jsx** or **App.jsx**). Example **src/main.jsx**:

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7) Drop in the app code

Use this structure (files live under **src/**):

```
src/
  App.jsx
  main.jsx
  styles.css
  data/
    students.js
  lib/
    date.js
    scheduler.js
    exportExcel.js
  components/
    Calendar.jsx
    EditorModal.jsx
    ScheduleOverview.jsx
```

- The canvas in ChatGPT contains the full contents for each of these files. Copy them into your project exactly as shown.
- If you didn’t use the canvas, ask and I’ll paste the files again here.

### 8) Run

```bash
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

### 9) Build & Preview

```bash
npm run build
npm run preview
```

---

## 🧩 About Tailwind config

You **do not need** a `tailwind.config.js` when using **Tailwind CSS v4** with the `@tailwindcss/vite` plugin and `@import "tailwindcss"` in your CSS. That is the expected zero‑config setup.

If you ever want to customize the theme, add plugins, or extend utilities, you can create a config later. (For teams still on Tailwind v3, you’d generate a config and `postcss.config.js` with `npx tailwindcss init -p` and set the `content` globs—this project is already v4‑style so you can skip that.)

---

## ⚙️ Environment & Scripts

`package.json` (relevant parts):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^*",
    "tailwindcss": "^*",
    "vite": "^*",
    "@vitejs/plugin-react": "^*"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

> Versions are shown as `^*` here for brevity—npm will install the latest compatible versions. Your actual `package.json` will have specific numbers.

---

## 🗂 Data & Scheduling

- **`data/dummy.js`**: sample records with `meetings`, `age`, `class_name`, and `instructor_name`.
- **`lib/scheduler.js`**: expands each student by `meetings`, sorts by `age` desc, round-robins by class across selected days, and lightly balances per-day load.
- **`lib/exportExcel.js`**: dynamic `xlsx` import to build an `.xlsx` workbook. If `xlsx` isn’t installed or fails to import, it falls back to creating a multi‑date CSV that downloads automatically.

---

## 🔧 Common Issues & Fixes

**Tailwind utilities are not applying**

- Ensure `@import "tailwindcss";` is at the **top** of `src/app.css`.
- Verify `vite.config.js` includes `tailwind()` in `plugins`.
- Restart `npm run dev` after installing plugins or changing Vite config.

**Modal opens but cannot change student**

- In this refactor, the **EditorModal** receives `studentOptions`, `classOptions`, and `studentLookup`. Make sure `App.jsx` passes these props (provided in the canvas version).

**Excel export doesn’t work**

- Install the package: `npm i xlsx`. The CSV fallback should still work if you skip this.

---

## 📦 Deployment

- **Vercel/Netlify**: Build command `npm run build`, output directory `dist`.
- No extra Tailwind steps required with the zero-config v4 setup.

---

## 📄 License

MIT © Prakhar Bhawsar
