# vite_react_shadcn_ts

## Overview

Production-ready React application scaffolded with Vite, TypeScript, and Tailwind CSS. Implements a modular, component-driven architecture with modern UI primitives, state management, and integrations for analytics and backend data. Designed for extensible, accessible, and performant web experiences.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, custom CSS variables, shadcn/ui, Framer Motion
- **UI Primitives:** Radix UI, Lucide Icons, Embla Carousel, CMDK, Sonner
- **State/Data:** React Query, React Context, React Router DOM
- **Forms/Validation:** React Hook Form, Zod, @hookform/resolvers
- **Backend/DB:** Supabase (REST, Edge Functions)
- **Testing:** Vitest, Testing Library
- **Utilities:** clsx, tailwind-merge, date-fns, canvas-confetti
- **Other:** Telegram Chat Widget, custom analytics, command palette

## Key Features

- **Routing:** Client-side routing with React Router, including 404 handling and scroll restoration.
- **UI/UX:** 
  - Responsive layout with parallax and animated backgrounds.
  - Accessible skip-to-content, tooltips, and command palette.
  - Custom loading screen and scroll progress bar.
  - Multiple easter eggs (Konami code, Snake game).
- **Content Sections:** Modular components for Hero, About, Skills, Experience, Education, Contact, Footer, and dynamic GitHub projects.
- **Theming:** Custom CSS variables for color, gradients, shadows, and typography. Light/dark mode support.
- **State Management:** React Context for language selection; React Query for async data.
- **Analytics:** 
  - Lightweight CV download tracking via Supabase Edge Functions (country, IP hash, UA, referrer).
  - Silent failover for analytics.
- **Integrations:** 
  - Supabase client for backend data (contact submissions, CV downloads, Telegram bot state).
  - Telegram chat widget.
- **Utilities:** 
  - Typewriter and count-up animation hooks.
  - Gold-themed confetti and UI sound feedback (Web Audio API, respects reduced motion).
  - Utility for merging Tailwind classes.
- **Testing:** 
  - Vitest setup with jsdom and Testing Library.
  - Example and setup tests included.

## Architecture

- **Entry:** `src/main.tsx` mounts `App` to DOM.
- **App Composition:** 
  - Providers: React Query, Language, Tooltip.
  - Routers: BrowserRouter, with animated page transitions.
  - Toasts: shadcn/ui and Sonner.
- **Pages:** 
  - `/` (Index): Composes all main sections and widgets.
  - `*` (NotFound): Custom 404 with error logging.
- **Component Structure:** 
  - All UI and logic are split into focused, reusable components under `src/components`.
- **Integrations:** 
  - Supabase client is auto-generated and typed.
  - Edge functions invoked for analytics.
- **Styling:** 
  - Tailwind CSS with custom design tokens and Google Fonts.
  - Responsive and accessible by default.

## Development

- **Start Dev Server:**  
  `npm run dev`
- **Lint:**  
  `npm run lint`
- **Test:**  
  `npm run test` or `npm run test:watch`
- **Type Checking:**  
  TypeScript is enforced throughout.

## Build & Deployment

- **Build:**  
  `npm run build`
- **Preview Production Build:**  
  `npm run preview`
- **Environment:**  
  - Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in environment.
  - All environment variables are loaded via Vite.

## Notes

- **Component Tagging:** In development, components are auto-tagged for debugging via `lovable-tagger`.
- **Accessibility:** All interactive elements and animations respect user preferences (e.g., reduced motion).
- **Silent Analytics:** Analytics failures never block user actions.
- **Testing:** Custom `window.matchMedia` polyfill for jsdom environment.
- **Supabase:** All DB types are strictly typed; client is auto-generated.
- **No server-side rendering.** This is a client-only SPA.
- **No global state management library; context and React Query are used as needed.**

---

For further details, refer to code in `src/` and integration files.