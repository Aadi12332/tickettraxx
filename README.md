# TicketTraxx — React TypeScript Frontend

A complete authentication + dashboard UI for the TicketTraxx contractor platform.

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS v3**
- **React Router v6** (with protected routing)
- **React Hook Form** + **Zod** (form validation)
- **Recharts** (sparkline charts)
- **Lucide React** (icons)
- **Vite** (build tool)

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthLayout.tsx        # Shared wrapper for auth pages
│   ├── layout/
│   │   ├── DashboardLayout.tsx   # Sidebar + Header shell
│   │   ├── Header.tsx            # Search, notifications, user menu
│   │   └── Sidebar.tsx           # Nav with collapsible sections
│   └── ui/
│       └── Logo.tsx              # TicketTraxx branded logo
├── context/
│   └── AuthContext.tsx           # Auth state, login, logout
├── pages/
│   ├── LoginPage.tsx             # Email/password login
│   ├── ForgotPasswordPage.tsx    # Request OTP reset
│   ├── OtpPage.tsx               # 6-digit OTP entry + resend
│   ├── ResetPasswordPage.tsx     # New password + strength meter
│   ├── DashboardPage.tsx         # Main dashboard with stats
│   └── PlaceholderPage.tsx       # Stub for unbuilt sections
├── routes/
│   └── ProtectedRoute.tsx        # Auth guards (Protected + Public)
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
└── App.tsx                       # Root router
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo Login

| Field    | Value               |
|----------|---------------------|
| Email    | `tomhenry@abc.com`  |
| Password | any 6+ char string  |

## Features

### Auth Flow
- **Login** — email/password with remember me, show/hide password, field validation
- **Forgot Password** — email entry → stores email in context
- **OTP Verification** — 6-box auto-advance input, paste support, 30s resend countdown
- **Reset Password** — new password with live strength indicator (Weak → Strong)

### Route Protection
- `ProtectedRoute` — redirects unauthenticated users to `/login`
- `PublicRoute` — redirects authenticated users to `/dashboard`
- Loading state shown during auth hydration from localStorage

### Dashboard
- Welcome banner with user name
- 3 stat cards with sparkline bar charts and trend indicators
- Recent Loads table with status badges
- Alerts & Issues panel with severity icons
- Ticket Status Breakdown with progress bars
- Contractor Drivers with rating indicators
- Date range picker (visual only)

### Header
- Search bar
- Notification dropdown with badge
- User avatar dropdown with profile & logout

### Sidebar
- Active state highlighting via React Router NavLink
- Collapsible sections (My Drivers, Ticket Management)
- All 8 nav items wired to routes
