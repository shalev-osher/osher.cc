```markdown
# osher.cc

A modern, interactive personal portfolio and resume web application for Shalev Osher, built with React, TypeScript, Vite, shadcn/ui, and Tailwind CSS. The site features animated sections, rich theming, language switching (English/Hebrew), and playful UI details.

---

## What This Project Does

- **Showcases professional experience, skills, education, and projects** in a visually engaging, single-page application.
- **Animated and interactive UI**: Parallax backgrounds, typewriter effects, confetti, sound/haptic feedback, and more.
- **Responsive and accessible**: Works on desktop and mobile, with accessibility features like "skip to content".
- **Language support**: Toggle between English and Hebrew.
- **Command palette** and keyboard navigation.
- **Easter eggs**: Includes Konami code and Snake game for fun.
- **Contact and social links**: Easy ways to connect.

---

## Stack and Architecture

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), custom CSS variables and gradients
- **Routing**: [react-router-dom](https://reactrouter.com/)
- **State/Async**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Animation**: [framer-motion](https://www.framer.com/motion/), custom hooks
- **UI Components**: shadcn/ui, Radix UI primitives, custom components
- **Testing**: [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/)
- **Other**: [Supabase JS](https://supabase.com/docs/reference/javascript) (potentially for data), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti), [lucide-react](https://lucide.dev/)

**Project structure** is modular, with all source code in `src/`, and heavy use of alias imports (e.g., `@/components/...`).

---

## Running Locally

**Prerequisites**:
- Node.js (18+ recommended)
- npm

**Steps**:

```sh
git clone https://github.com/shalev-osher/osher.cc.git
cd osher.cc
npm install
npm run dev
```

- The app will be available at [http://localhost:8080](http://localhost:8080) by default.

---

## Build and Deploy

- **Production build**:  
  ```sh
  npm run build
  ```
  Output is generated in the `dist/` folder.

- **Preview production build locally**:  
  ```sh
  npm run preview
  ```

- **Lint code**:  
  ```sh
  npm run lint
  ```

- **Run tests**:  
  ```sh
  npm run test
  ```

- **Test in watch mode**:  
  ```sh
  npm run test:watch
  ```

**Note:**  
No explicit deployment scripts or Docker configuration are present. Deploy the `dist/` folder to any static hosting provider (e.g., Vercel, Netlify, GitHub Pages, etc.).

---

## Key Folders and Files

- `src/` — Main application source code
  - `components/` — All React UI components (e.g., `Hero`, `Navbar`, `Footer`, etc.)
  - `pages/` — Page-level components (`Index.tsx` for the main page, `NotFound.tsx` for 404)
  - `lib/` — Utility functions (e.g., `utils.ts`, `celebrate.ts` for confetti/sound)
  - `hooks/` — Custom React hooks (e.g., `useCountUp`, `use-toast`)
  - `contexts/` — React context providers (e.g., `LanguageContext`)
  - `index.css` — Tailwind CSS and custom design tokens
  - `main.tsx` — Entry point, renders the app
- `vite.config.ts` — Vite configuration (with React SWC, path aliases)
- `tailwind.config.ts` — Tailwind CSS configuration (not shown, but referenced)
- `eslint.config.js` — ESLint configuration
- `vitest.config.ts` — Vitest test runner config
- `components.json` — shadcn/ui generator config

---

## Environment Variables

- **No required environment variables** are visible in the code/config.  
  If you intend to use Supabase or other APIs, you may need to add relevant keys in your own `.env` file.

---

## Main Pages and Components

- **`/` (Home)**:  
  - **Navbar**: Sticky, animated, with section links, language toggle, theme switch, and command palette.
  - **Hero**: Animated intro with typewriter effect, background particles, and constellation.
  - **About**: Profile photo with 3D tilt, animated stats, and typewriter text.
  - **Skills**: Visual skillset display (details in component).
  - **GitHubProjects**: Showcases GitHub repositories (implementation in component).
  - **Experience**: Work history and roles.
  - **Education**: Certifications and education timeline.
  - **Contact**: Contact form or details.
  - **Footer**: Social links and copyright.
  - **Other**: Parallax background, scroll progress bar, Telegram chat widget, command palette, and accessibility helpers.

- **404 Not Found**:  
  - Friendly error page for unknown routes.

- **Easter Eggs**:  
  - Konami code and Snake game (hidden features).

---

## Notes

- **Aliases**: Use `@/` for imports from `src/` (configured in Vite and TypeScript).
- **Theming**: Light/dark mode with custom color tokens and gradients.
- **Accessibility**: Skip links, keyboard navigation, ARIA labels.
- **No Dockerfile**: No containerization provided.
- **No backend/server code**: This is a static frontend app.

---

## License

See `LICENSE` file if present.

```
