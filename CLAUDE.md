# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Type-check (no test suite exists)
npm run lint

# Build for production
npm run build
```

## Environment

Create `.env.local` in the project root with:
```
GEMINI_API_KEY=your_key_here
```

Vite exposes it as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (see `vite.config.ts`).

## Architecture

This is a React 19 + TypeScript SPA built with Vite. There is no router — navigation is handled entirely via `activeTab` state in `App.tsx`. There is no backend; all data is in-memory and resets on page reload.

### Auth & Role Flow

`App.tsx` manages the top-level auth/role gate:
1. If no `user` → renders `<Auth>` (email + role selection form, no real auth)
2. If no `role` → renders `<RoleSelection>`
3. Otherwise → renders `<Layout>` with role-specific nav and content

Two roles exist (`AppRole` enum in `types.ts`):
- **`OWNER`** — pet owner view: home dashboard, vet search, pet profile, social feed
- **`VETERINARIAN`** — vet portal: dashboard, appointments, patients, inventory

### Navigation Tabs

Owner tabs: `home`, `search`, `social`, `health`, `settings`, `historial`, `dieta`, `urgencia`
Vet tabs: `home`, `appointments`, `patients`, `inventory`, `settings`

The `<Layout>` component renders a sticky header and a floating bottom nav bar that adapts based on role.

### Component Structure

- `App.tsx` — root state, routing logic, pet CRUD modals, and several inline view components (`MedicalHistoryView`, `DietPlanView`, `EmergencyView`, `PendingTaskCard`, etc.)
- `components/Layout.tsx` — shell with header, bottom nav, notifications drawer, FAB plus-menu
- `components/Auth.tsx` — login form
- `components/RoleSelection.tsx` — role picker shown after login
- `components/PetProfile.tsx` — pet detail view with sub-tabs: `info`, `medical`, `docs`, `appointments`
- `components/HealthDashboard.tsx` — AI recommendations panel (calls Gemini)
- `components/VetSearch.tsx` — vet finder, triggers appointment creation
- `components/SocialFeed.tsx` — social feed for owners
- `components/Settings.tsx` — user profile + dark mode + AI toggle + logout
- `components/Vet*.tsx` — vet-role-only screens (dashboard, appointments, patients, inventory, financials)

### AI Integration

`services/geminiService.ts` calls the Gemini API (`@google/genai`) to generate health recommendations for a pet. The model used is `gemini-3-flash-preview`. Response is structured JSON via `responseSchema`. Used in `HealthDashboard` and can be toggled off via `showAI` state in Settings.

### Styling

Tailwind CSS utility classes are used throughout (no separate config file is present — relies on Vite/PostCSS defaults). Custom color tokens used inline: `bg-crema`, `bg-darkBg`, `bg-darkCard`, `text-primary`, `text-secondary`, `text-accent`, `rounded-4xl`, `rounded-5xl`. Dark mode is toggled via `document.documentElement.classList` (`dark` class) and controlled by `darkMode` state in `App.tsx`.

### Data Model

All core types are in `types.ts`: `User`, `Pet`, `Appointment`, `InventoryItem`, `PatientRecord`, `Vaccine`, `Deworming`, `MedicalDocument`, `Vet`, `HealthRecommendation`. Pet state (`initialPets`) is seeded directly in `App.tsx` with hardcoded demo data.

### Path Alias

`@/` maps to the project root (configured in both `vite.config.ts` and `tsconfig.json`).
