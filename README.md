# Architecture Blog

Architecture Blog is a Vite, React, and TypeScript editorial site focused on Nordic design, modern interiors, sustainable buildings, and urban architecture.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

## Requirements

- Node.js 20+
- npm 10+

## Local Development

```bash
npm install
npm run dev
```

The development server starts on port 8080 by default.

## Production Build

```bash
npm run build
npm run preview
```

The compiled app is emitted to `dist/` and can be served with standard static hosting tooling such as Nginx, Caddy, Apache, or any static hosting provider.

## Project Notes

- Editorial pages and article data are implemented in `src/pages`.
- Shared UI components live in `src/components`.
- Social preview metadata uses the local `public/social-card.svg` asset.
- The project uses standard Vite and npm tooling without vendor-specific build plugins.

## SEO and Metadata

- Per-page `<title>`, meta description, canonical, Open Graph, Twitter Card, and JSON-LD are managed by `src/components/Seo.tsx`.
- Static site identity (canonical hostname, name, default OG image, locale, Twitter handle, contact email) lives in `src/lib/site.ts`. Update `SITE_URL` there when the deployment host changes.
- `SITE_TWITTER` in `src/lib/site.ts` is `null` by default. Set it to a real handle (e.g. `"@architecturemag"`) to emit `twitter:site` meta; while null the meta tag is omitted rather than shipped with a placeholder.
- `public/sitemap.xml` and `public/robots.txt` are served at the deployment root. If you change `SITE_URL`, search-and-replace the hostname in `public/sitemap.xml` and the `Sitemap:` line in `public/robots.txt` to match.
- `index.html` includes a small inline script that reads the persisted theme from `localStorage["editorial-theme"]` and applies the `light` or `dark` class to `<html>` before the React bundle parses. This prevents the dark-mode flash-of-unstyled-content on first paint.

## Social Links

Header, footer, and contact page social icons are sourced from a single `SOCIAL_LINKS` map in `src/lib/site.ts`. All entries are `null` by default — components render nothing when no URL is set, so visitors never click into a placeholder that routes them to facebook.com / twitter.com / instagram.com homepages.

Fill in real URLs (full `https://...`) to surface the icons everywhere they're rendered. The same map is the source of truth for Organization JSON-LD `sameAs` — when adding real profiles, also include them in the publisher graph if desired.

## Theming

- `src/components/ThemeProvider.tsx` is a hand-rolled provider supporting `light`, `dark`, and `system`. When `system` is active it subscribes to `prefers-color-scheme` changes so the page reacts to OS theme switches in real time.
- The provider sets both the `.dark` class on `<html>` and `documentElement.style.colorScheme`, so native UI (scrollbars, form controls, autofill highlights) tracks the theme alongside Tailwind classes.
- The footer theme toggle uses `role="radiogroup"` + `aria-checked` so screen readers announce the active selection.
- `components/ui/sonner.tsx` reads `resolvedTheme` from this provider (not `next-themes`) so toasts match the user's chosen theme.
