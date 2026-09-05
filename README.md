<div align="center">

# 🚗 Motors

### Premium Car Rental & Marketplace Platform

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-21-EF4444?style=for-the-badge)](https://primeng.org)
[![InsForge](https://img.shields.io/badge/Backend-InsForge-7C3AED?style=for-the-badge)](https://insforge.app)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

*A full-stack Angular SSR application for browsing, comparing, booking, and managing vehicles — powered by InsForge BaaS.*

</div>

---

## ✨ Features

| Area | What's included |
|------|----------------|
| 🔐 **Authentication** | Email/password login, OAuth (Google, GitHub), protected routes |
| 🚙 **Car Listings** | Browse, filter, and search the vehicle catalogue |
| ⚖️ **Comparison** | Side-by-side car comparison with detailed specs |
| 📅 **Bookings** | Full booking flow with availability calendar |
| 💳 **Payments** | Integrated payment processing |
| ⭐ **Reviews** | User reviews and ratings per vehicle |
| 📊 **Analytics** | Dashboard with booking and revenue analytics |
| 🛠️ **Admin Panel** | Full back-office for managing cars, users, and orders |
| 🌍 **i18n** | Multi-language support via `@ngx-translate` |
| 📱 **Mobile-ready** | Responsive layout optimised for all screen sizes |
| ⚡ **SSR** | Angular Universal server-side rendering for fast first paint & SEO |

---

## 🏗️ Tech Stack

```
Frontend  │ Angular 21 · TypeScript 5.9 · RxJS 7
Styling   │ Tailwind CSS 3.4 · PrimeNG 21 · PrimeIcons
Backend   │ InsForge (PostgreSQL + PostgREST · Auth · Storage · AI · Realtime)
SSR       │ @angular/ssr · Express 5
Testing   │ Vitest
Tooling   │ Angular CLI 21 · ESBuild · PostCSS
Deploy    │ Vercel
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- An [InsForge](https://insforge.app) project with your backend URL and anon key

### 1 · Clone & install

```bash
git clone https://github.com/Mostafa-SAID7/Motors.git
cd Motors
npm install
```

### 2 · Configure environment

Copy the example env file and fill in your InsForge credentials:

```bash
cp .env.example .env
```

```env
# .env
INSFORGE_URL=https://your-app.region.insforge.app
INSFORGE_ANON_KEY=your-anon-key-here
```

### 3 · Run locally

```bash
npm start          # ng serve  →  http://localhost:4200
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server at `localhost:4200` |
| `npm run build` | Production build → `dist/` |
| `npm run watch` | Dev build with file watching |
| `npm test` | Run unit tests with Vitest |
| `npm run serve:ssr:Motors` | Serve the SSR bundle locally |

### InsForge CLI Helpers

| Command | Description |
|---------|-------------|
| `npm run insforge:init` | Initialise InsForge project |
| `npm run insforge:create-collections` | Create database tables |
| `npm run insforge:create-buckets` | Create storage buckets |
| `npm run insforge:setup-security` | Configure RLS policies |
| `npm run insforge:verify` | Verify backend setup |
| `npm run insforge:status` | Print backend status |

---

## 📁 Project Structure

```
Motors/
├── src/
│   ├── app/
│   │   ├── components/        # Shared UI components
│   │   ├── core/              # Guards, interceptors, services
│   │   ├── features/
│   │   │   ├── admin/         # Admin back-office
│   │   │   ├── analytics/     # Charts & reporting
│   │   │   ├── bookings/      # Booking flow
│   │   │   ├── cars/          # Vehicle catalogue
│   │   │   ├── comparison/    # Side-by-side comparison
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── mobile/        # Mobile-specific views
│   │   │   ├── payments/      # Payment processing
│   │   │   ├── reviews/       # Reviews & ratings
│   │   │   └── users/         # User profiles
│   │   ├── layout/            # App shell (header, footer, sidebar)
│   │   ├── pages/             # Route-level page components
│   │   ├── app.routes.ts      # Lazy-loaded route definitions
│   │   └── app.config.ts      # App-level providers & config
│   ├── assets/                # Static assets (icons, images)
│   ├── environments/          # Environment configs
│   └── styles.css             # Global styles & Tailwind entry
├── public/                    # Static public files
├── scripts/                   # InsForge CLI scripts
├── angular.json               # Angular workspace config
├── tailwind.config.js         # Tailwind theme & plugins
├── postcss.config.mjs         # PostCSS pipeline
└── tsconfig.json              # TypeScript base config
```

---

## ☁️ Deployment

The app is configured to deploy to **Vercel** automatically on every push to `main`.

> **Important:** The Vercel build runs on **Linux**. Never add Windows-only packages (e.g. `@esbuild/win32-x64`, `@rollup/rollup-win32-x64-msvc`) to `package.json` — they cause `EBADPLATFORM` build failures.

To deploy manually:

```bash
npm install -g vercel
vercel --prod
```

---

## 🧪 Testing

Unit tests are powered by **Vitest** via the Angular CLI integration:

```bash
npm test
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org): `git commit -m "feat: add my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is **private**. All rights reserved © 2026 Motors.

---

<div align="center">
  Built with ❤️ using <strong>Angular 21</strong> + <strong>InsForge</strong>
</div>
