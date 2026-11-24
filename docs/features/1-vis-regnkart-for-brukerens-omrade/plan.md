# Vis regnkart for brukerens område: plan

See [desc.md](desc.md) for the request. The factory built from this plan (policy 0.6, 2026-11-24).

The research plan comprehensively addresses all four acceptance criteria and is ready for implementation:

✓ **AC1** (map centered on user with current precipitation): Proposes a 3×3 tile grid using RainViewer API with user marker centered.  
✓ **AC2** (menu access, no restrictions): NavLink in AppLayout with no auth checks.  
✓ **AC3** (position missing → alert, no map): RainMapPage checks geo status first; shows Alert and skips map when unavailable.  
✓ **AC4** (data unavailable → info alert, no map): Handles empty `radar.past` and fetch errors with Alert; no map shown.

**Strengths of the plan:**
- Frontend-only architecture avoids backend complexity and aligns with time constraints.
- File structure matches the design system guidance (`frontend-react` skill).
- Tests cover all acceptance criteria, edge cases (wrapping tiles, geolocation errors), and coordinate math.
- Proper attribution for OpenStreetMap and RainViewer in figure caption.
- Reasonable risk assessment: identifies API limits, geolocation HTTPS requirement, and deployment needs.
- UI language in Norwegian bokmål throughout.
- Mocking strategy (fetch, geolocation, router, QueryClient) is complete and correct for Vitest + Testing Library.

**Minor clarifications (no changes needed):**
- The plan correctly uses `defineConfig` from `'vitest/config'` for combined vite + vitest setup.
- Coordinate math for Web Mercator and tile wrapping are mathematically sound.
- 10-second geolocation timeout with 5-minute cache is reasonable.
- Zoom level 7 is appropriate for the regional scope.

The plan is ready to execute.

---

```markdown
## Plan: Issue #1, "Regnkart" (rain map) page

### Context found during discovery (no need to repeat)
- The repository is empty. It has one commit, and its only file is `README.md` (`# weather-api`). There is no `memory.md`, `CLAUDE.md`, backend, frontend, Bicep, CI, package manifest or tests. This is a greenfield change.
- Apply these skills: `frontend-react` (Vite + React + strict TS + React Router + TanStack Query; layout `src/[Project].Web/src/{app,modules,shared}`; lazy routes; Vitest + Testing Library tests next to files; all HTTP through `shared/lib`; no other deps) and `design-system` (tokens below; page frame = header + left nav + content; Alert for page messages; skeleton while loading). `dotnet-architecture` is **not** needed. No backend is required, see the decision below.
- Design tokens to copy into the repo (`/home/agent/.claude/skills/design-system/tokens.css`): colours `--color-primary #2f5bd3`, `--color-background #f6f7f9`, `--color-surface #fff`, `--color-surface-muted #eef0f4`, `--color-text #1b1f27`, `--color-text-muted #5b6372`, `--color-border #d6dae2`, `--color-info #1f5fa8`/`-surface #e6f0fb`, `--color-warning #8a5a00`/`-surface #fff3d6`, `--color-danger #b42318`/`-surface #fdecea`; spacing `--space-1..7` = 4/8/12/16/24/32px; radius 4/8/12; `--content-max-width 1120px`, `--nav-width 220px`, `--header-height 56px`; `--focus-ring 0 0 0 3px rgba(47,91,211,.35)`; font `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Frame CSS: `.app-header` (height header-height, flex, space-between, padding 0 space-5, surface bg, bottom border) holding `.brand` (bold, font-size-lg, primary colour). `.app-nav` (nav-width, padding space-4 space-3, surface, right border) holds links; the active link gets surface-muted bg + primary colour + medium weight. `main` has padding space-6, and `.content` has max-width content-max-width with auto margin.
- Alert: `.alert` (flex, gap space-3, padding space-3 space-4, radius-md, 1px border, max-width 640px) with `<strong>` title + `<p>` body in text colour. Variants are info/warning/danger, using `role="status"` (info/warning) or `role="alert"` (danger).
- **Time budget:** earlier runs failed on a 15-minute timeout and on the turn limit. Write the files by hand; do not run interactive scaffolders like `npm create vite`. Run `npm install` once.

### Key decisions
- **Frontend only, with no backend or API key.** Data sources:
  - Base map: OpenStreetMap raster tiles `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
  - Current precipitation: the RainViewer public API, `GET https://api.rainviewer.com/public/weather-maps.json`. The response is `{ host: string, radar: { past: {time:number, path:string}[], nowcast?: [...] } }`. The **last** `radar.past` entry is "now". The tile URL is `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`. Ignore `nowcast`, because forecasts are out of scope.
- **No map library.** Render a 3×3 grid of `<img>` tiles (base layer + semi-transparent radar layer on top) centred on the user's tile, with a marker at the user's exact position. This avoids adding Leaflet, which the skill says to ask about first.
- **Zoom = 7.** The RainViewer free tier is capped at low zoom levels. This is a regional view.
- **Position missing:** show only a warning Alert, with no map. The acceptance criterion says to show the message *instead of* a map, so the optional default-area map is skipped.
- **No data:** show an info Alert in two cases: when `radar.past` is empty, or when the request fails or returns malformed data.
- **UI language:** Norwegian bokmål, matching the issue and the menu label "Regnkart".

### 1. Location (all new files under `src/WeatherApi.Web/`)
| File | Symbol / purpose |
|---|---|
| `package.json` | scripts: `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"test": "vitest run"`; deps `react ^19`, `react-dom ^19`, `react-router-dom ^7`, `@tanstack/react-query ^5`; devDeps `typescript ^5`, `vite ^6`, `@vitejs/plugin-react ^4`, `vitest ^3`, `jsdom ^26`, `@testing-library/react ^16`, `@testing-library/dom ^10`, `@testing-library/jest-dom ^6`, `@types/react ^19`, `@types/react-dom ^19` |
| `tsconfig.json` | `strict: true`, `jsx: react-jsx`, `module: ESNext`, `moduleResolution: bundler`, `target: ES2022`, `lib: [ES2022, DOM, DOM.Iterable]`, `types: ["vitest/globals", "@testing-library/jest-dom"]`, `noEmit: true`, `include: ["src"]` (single file; keep `tsc -b` working, or use `tsc --noEmit` in build) |
| `vite.config.ts` | `plugins: [react()]`, `test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' }` (import `defineConfig` from `vitest/config`) |
| `index.html` | `<html lang="nb">`, `<div id="root">`, script `/src/main.tsx`, title "Weather" |
| `src/main.tsx` | `createRoot(...).render(<App/>)`, imports `app/styles/tokens.css` + `app/styles/app.css` |
| `src/test/setup.ts` | `import '@testing-library/jest-dom/vitest'` |
| `src/app/App.tsx` | `QueryClientProvider` (new `QueryClient({ defaultOptions: { queries: { retry: false } } })`) + `RouterProvider router={router}` |
| `src/app/router.tsx` | `export const routes: RouteObject[]` = `[{ path: '/', element: <AppLayout/>, children: [{ index: true, element: <Navigate to="/regnkart" replace/> }, ...rainMapRoutes] }]`; `export const router = createBrowserRouter(routes)` |
| `src/app/AppLayout.tsx` | header (brand "Weather"), `<nav aria-label="Hovedmeny">` with `<NavLink to="/regnkart">Regnkart</NavLink>` (active class), `<main><div className="content"><Suspense fallback={<Skeleton/>}><Outlet/></Suspense></div></main>`. No auth checks |
| `src/app/styles/tokens.css` | copy of the token variables (values only, same names) |
| `src/app/styles/app.css` | frame, page-header, alert, skeleton, rain-map classes using only tokens; `:focus-visible { box-shadow: var(--focus-ring); outline: none }` |
| `src/shared/lib/apiClient.ts` | `export class ApiError extends Error { status: number }`; `export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T>`, which calls `fetch` and throws `ApiError` when `!res.ok` |
| `src/shared/hooks/useGeolocation.ts` | `type GeolocationState = { status: 'pending' } \| { status: 'success'; latitude: number; longitude: number } \| { status: 'unavailable' }`; `useGeolocation()`. If `!('geolocation' in navigator)`, set unavailable. Otherwise call `getCurrentPosition(success, () => unavailable, { timeout: 10000, maximumAge: 300000 })`, with an `active` flag to ignore results after unmount |
| `src/shared/components/ui/Alert.tsx` | props `{ variant: 'info'\|'warning'\|'danger'; title: string; children?: ReactNode }`; role `alert` for danger, else `status` |
| `src/shared/components/ui/PageHeader.tsx` | `<header className="page-header"><h1>{title}</h1></header>` |
| `src/shared/components/ui/Skeleton.tsx` | `<div className="skeleton" aria-busy="true" aria-label="Laster" />` |
| `src/modules/rainmap/types.ts` | `RainViewerFrame {time:number; path:string}`, `RainViewerMaps {host:string; radar:{past:RainViewerFrame[]}}`, `RadarFrame {time:number; tileUrlTemplate:string}` (template contains `{z}/{x}/{y}`) |
| `src/modules/rainmap/api/rainMapApi.ts` | `RAINVIEWER_MAPS_URL`; `fetchLatestRadarFrame(signal?): Promise<RadarFrame \| null>`. It returns `null` when `past` is missing or empty, and otherwise returns the last frame with `tileUrlTemplate = `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`` |
| `src/modules/rainmap/api/useLatestRadarFrame.ts` | `useQuery({ queryKey: ['rainmap','latest-frame'], queryFn: ({signal}) => fetchLatestRadarFrame(signal), staleTime: 5*60_000 })` |
| `src/modules/rainmap/components/tileMath.ts` | `MAP_ZOOM = 7`; `lonLatToTile(lon, lat, z): {x:number; y:number; fracX:number; fracY:number}` (Web Mercator: `n=2**z; fx=(lon+180)/360*n; fy=(1-Math.log(Math.tan(latR)+1/Math.cos(latR))/Math.PI)/2*n`; x=floor, frac=remainder); `buildTileGrid(center, z): {x:number;y:number;row:number;col:number}[]` (9 tiles, rows/cols 0..2, x wrapped with `((x % n)+n)%n`, rows outside 0..n-1 omitted); `fillTemplate(template, z, x, y)` |
| `src/modules/rainmap/components/RainMap.tsx` | props `{latitude, longitude, tileUrlTemplate}`. Renders `<figure>` with `role="img"` and `aria-label="Kart over nåværende nedbør rundt din posisjon"`: a CSS grid of 3×3 cells. Each cell is an OSM `<img alt="">` plus a radar `<img alt="" data-testid="radar-tile" className="rain-map__radar">` (opacity .7, absolutely positioned). A marker `<span className="rain-map__marker">` sits at `left: ((1+fracX)/3*100)%`, `top: ((1+fracY)/3*100)%`. `<figcaption>` holds "Kartdata © OpenStreetMap-bidragsytere · Nedbør: RainViewer". Width 100% up to 768px, `aspect-ratio: 1` |
| `src/modules/rainmap/pages/RainMapPage.tsx` | default export. Uses `useGeolocation` and `useLatestRadarFrame`. Render order: `PageHeader "Regnkart"`, then the status-specific content below |
| `src/modules/rainmap/routes.tsx` | `const RainMapPage = lazy(() => import('./pages/RainMapPage'))`; `export const rainMapRoutes: RouteObject[] = [{ path: 'regnkart', element: <RainMapPage/> }]` |
| `.gitignore` (repo root) | `node_modules/`, `dist/` |
| `README.md` | Short "Kjør frontend" section: `cd src/WeatherApi.Web && npm install && npm run dev / npm test / npm run build`; note the external data sources |

### 2. Change: steps
1. Create the config files (`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`), then run `npm install` once in `src/WeatherApi.Web` to generate `package-lock.json`, which gets committed.
2. Create the token and frame CSS and the shared UI (`Alert`, `PageHeader`, `Skeleton`), plus `apiClient` and `useGeolocation`.
3. Create the rainmap module (types → api → tileMath → RainMap → page → routes).
4. Create the app shell (`AppLayout`, `router`, `App`, `main`). In `RainMapPage`, show content by status:
   - geo `pending` **or** query `isPending` → `<Skeleton/>` with the text "Finner posisjonen din …".
   - geo `unavailable` → `<Alert variant="warning" title="Vi fant ikke posisjonen din">Gi nettleseren tilgang til posisjonen din og last inn siden på nytt for å se regnkartet for området ditt.</Alert>`, with **no map**. This check comes before the data check.
   - query `isError` **or** `data === null` → `<Alert variant="info" title="Nedbørsdata er ikke tilgjengelig akkurat nå">Prøv igjen om litt.</Alert>`, with no map.
   - Otherwise → the intro `<p>` "Nedbør akkurat nå rundt der du er. Blått betyr regn." plus `<RainMap …/>`, and below it a small text "Oppdatert kl. HH:MM" from `time*1000` (format with `toLocaleTimeString('nb-NO', {hour:'2-digit', minute:'2-digit'})`).
5. Run `npm run build` and `npm test`. Fix any failures.

### 3. Tests (Vitest + Testing Library, next to files)
Shared fixture: `{ host: 'https://tilecache.rainviewer.com', radar: { past: [{ time: 1700000000, path: '/v2/radar/a' }, { time: 1700000600, path: '/v2/radar/b' }] } }`. Mock `fetch` with `vi.stubGlobal('fetch', vi.fn(...))`. Mock geolocation with `Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition: vi.fn((ok, err) => ok({ coords: { latitude: 59.91, longitude: 10.75 } })) }, configurable: true })`. Wrap renders in a fresh `QueryClient({queries:{retry:false}})` + `createMemoryRouter(routes, { initialEntries: ['/regnkart'] })`, and use `findBy*` because routes are lazy.

- `components/tileMath.test.ts`
  - `lonLatToTile(10.75, 59.91, 7)` → `x: 67, y: 37`, with `fracX` ≈ 0.82 and `fracY` ≈ 0.21 (`toBeCloseTo(…, 1)`).
  - `buildTileGrid({x:67,y:37}, 7)` → 9 tiles, first `{x:66,y:36,row:0,col:0}`, last `{x:68,y:38,row:2,col:2}`.
  - `buildTileGrid({x:0,y:10}, 7)` → the left column has `x: 127` (wrap).
  - `fillTemplate('h/{z}/{x}/{y}.png', 7, 67, 37)` → `'h/7/67/37.png'`.
- `api/rainMapApi.test.ts`
  - fixture → `{ time: 1700000600, tileUrlTemplate: 'https://tilecache.rainviewer.com/v2/radar/b/256/{z}/{x}/{y}/2/1_1.png' }` (the latest frame is used).
  - `radar.past: []` → `null`.
  - fetch `status: 500` → rejects with `ApiError`.
- `shared/hooks/useGeolocation.test.ts` (`renderHook`)
  - success → `{status:'success', latitude:59.91, longitude:10.75}`.
  - error callback → `{status:'unavailable'}`.
  - geolocation missing from navigator → `unavailable`.
- `pages/RainMapPage.test.tsx`
  - **AC1:** geo success + fixture → heading "Regnkart"; `findByRole('img', { name: /nåværende nedbør/ })` exists; there are 9 `radar-tile` images and one has `src` containing `/v2/radar/b/256/7/67/37/`.
  - **AC3:** geo error → `findByText('Vi fant ikke posisjonen din')`; `queryByRole('img', {name:/nedbør/})` is null.
  - **AC4:** `past: []` → `findByText('Nedbørsdata er ikke tilgjengelig akkurat nå')`; no map.
  - **AC4 (error):** fetch 500 → the same info message; no map.
  - Loading: geolocation never calls back → skeleton (`aria-label="Laster"`) is shown.
- `app/AppLayout.test.tsx`
  - **AC2:** render `routes` at `/` with no user or auth setup. `getByRole('navigation', {name:'Hovedmeny'})` contains `getByRole('link', {name:'Regnkart'})` with `href="/regnkart"`. The index route redirects so the Regnkart heading appears.

### 4. Risk
- **No existing coverage:** this is the first code in the repo, so nothing can regress. The risks are about setup:
  - Version compatibility between vite, vitest and plugin-react. If install fails, pin vite ^6 + vitest ^3.
  - `tsc -b` with a single tsconfig. Fall back to `tsc --noEmit && vite build`.
  - jsdom has no geolocation, so every test must stub it.
- **RainViewer free API limits:** zoom cap, rate limits and possible future changes. If tiles fail, the user sees the map without rain. Only an empty frame list or a failed request triggers the "no data" message. Precipitation data for one specific area cannot be detected from raster tiles.
- **OSM tile usage policy:** attribution is required, and the policy is not meant for heavy production traffic.
- **Geolocation needs a secure context:** HTTPS or localhost. Over plain HTTP it falls back to the "position missing" message.
- **Map scale:** at zoom 7 the map shows a region, not a street-level neighbourhood.

### 5. Infrastructure and configuration
None in the templates. The repo has no Bicep and the issue does not ask for infrastructure, so following `azure-infrastructure`, no templates should be added. Under `## Uncertainty`, report:
- To deploy, the static Vite build (`src/WeatherApi.Web/dist`) needs a host, for example a Container App serving static files or Static Web Apps.
- It needs no secrets, identities or app settings.
- The browser must be able to reach `api.rainviewer.com`, `tilecache.rainviewer.com` and `tile.openstreetmap.org`. Any Content Security Policy must allow these in `connect-src`/`img-src`.
- The page must be served over HTTPS for geolocation to work.
```

---
