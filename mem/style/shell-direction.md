---
name: Shell direction (iPadOS)
description: Site shell is iPadOS-style home screen with dock, replacing prior macOS desktop OS
type: design
---
Desktop (>=1024px) renders an iPadOS-style shell: status bar, app icon grid Home Screen, glass dock at bottom, full-screen app view on tap with shared layoutId zoom animation and a home indicator bar to return.

- Component: `src/components/ipados/IPadOS.tsx`
- Icons: reuse `src/components/ios/iconSet.tsx`
- Mobile branch in `src/pages/Index.tsx` keeps scrolling site + MacMenuBar/MacDock
- macOS desktop shell (`src/components/desktop/Desktop.tsx`) is NO LONGER mounted but kept in repo