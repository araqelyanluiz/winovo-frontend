# Copilot / AI Agent Instructions — winovo-frontend

Overview
- This repository is an Angular (v21) standalone-component application with Server-Side Rendering (SSR) using `@angular/ssr` + an Express `src/server.ts` handler.
- Key entry points: `src/main.ts` (browser), `src/main.server.ts` (server bootstrap), `src/server.ts` (Express SSR server).

Quick commands
- Dev server: `npm start` → runs `ng serve` (hot-reload dev server).
- Build: `npm run build` → runs `ng build` (browser + server outputs configured in `angular.json`).
- Unit tests: `npm test` → runs `ng test` (Angular unit test builder).
- Serve built SSR output: `npm run serve:ssr:winovo-frontend` → runs the server in `dist/.../server/server.mjs`.

Architecture & important patterns
- Standalone-components + `bootstrapApplication`: app uses Angular's standalone approach (see [src/app/app.ts](src/app/app.ts#L1)). Avoid NgModule assumptions.
- SSR-aware code: many services guard browser-only APIs with `isPlatformBrowser` or `typeof localStorage === 'undefined'` (examples: `src/app/core/services/theme/theme.service.ts` and `src/app/core/services/localization/localization.service.ts`). When modifying code, keep SSR safety in mind.
- Application startup uses `APP_INITIALIZER` in `src/app/app.config.ts` to: load config, initialize theme, localization, and register core icons. Follow that sequence when adding boot-time behavior.

Config & runtime data
- Default config lives under `src/app/core/services/config/default-config.json` and is exposed via the `ConfigService` (used by APP_INITIALIZER). There's also an `assets` mapping in `angular.json` that copies `src/app/core/config/config.json` ➜ `/assets/config` at build time; check both locations when changing config behavior.
- Localization files are served from `/assets/i18n/{lang}.json` (see `CustomTranslateLoader` in `src/app/app.config.ts`). Use `public/assets/i18n/` to add translations.

Icons
- Icon system uses an `IconRegistry` at `src/app/shared/components/icon/icon.registry.ts`. Two patterns are used:
  - Inline registration for critical icons at startup (`IconInitService.registerCoreIcons`) to avoid extra HTTP requests.
  - Dynamic loading via `registerIconFromUrl(name, url)` which returns an Observable and caches loads.
- When adding new icons, prefer inline registration for commonly used SVGs or add to `public/assets/icons/` and load via the registry when needed.

Testing & debugging notes
- Tests run with Angular's unit-test builder (`ng test`). The repo includes `vitest` in devDependencies but the canonical test entry is `npm test`.
- For SSR runtime debugging, build production SSR output then run `npm run serve:ssr:winovo-frontend` and inspect server logs (Express listens on `process.env.PORT || 4000`).

Conventions and code patterns to follow
- File layout: pages are under `src/app/pages/*`, shared components under `src/app/shared/*`, and layout components under `src/app/layout/*`. New features should follow this structure.
- Prefer signals/effects and standalone components (see `App` component usage of `signal()` and `bootstrapApplication`). Avoid introducing NgModule-based patterns.
- Use `APP_INITIALIZER` for anything that must be ready before the app renders (config, translations, icon registration).
- Keep browser-only DOM or `window`/`localStorage` usage behind platform checks; SSR will run code during server rendering.

Integration points & external deps
- SSR: `@angular/ssr` + Express (`src/server.ts`) — be mindful of middleware order and static file serving from the browser dist folder.
- Translations: `@ngx-translate/core` + HTTP loader requesting `/assets/i18n/{lang}.json`.
- Styling: global `src/styles.css`; Tailwind/PostCSS dev dependencies exist in `package.json`.

Examples (copyable patterns)
- Registering an inline icon at startup: see `src/app/core/services/icon-init/icon-init.service.ts` — use `iconRegistry.registerIcons([...])` inside `initialize()` called from APP_INITIALIZER.
- Fetching translations: the custom loader in `src/app/app.config.ts` uses `HttpClient` to GET `/assets/i18n/${lang}.json`.

If something is unclear
- Tell me which area you want expanded (startup, SSR, icons, localization, routing) and I will add focused examples or update this file.

---
Generated/updated automatically by an AI agent. Please review for accuracy and edit if project structure changes.
