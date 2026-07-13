# Changelog

## v2.0.0 (2026-07-13)

vue-hooks v2 is a major release: the React 19 API surface lands in full, renders are scheduled through Vue's own scheduler, and the toolchain moves to Vite+.

### Breaking Changes

- **Effect timing**: `useEffect` callbacks no longer run during render. They run after the component is mounted / the DOM has been patched, deferred to a macrotask (after paint). Use the new `useLayoutEffect` for synchronous, before-paint work.
- **Scheduling**: state updates (`useState`, `useReducer`, ...) are queued through Vue's scheduler instead of re-rendering synchronously. Updates in the same tick are batched into a single re-render.
- **Package**: the package is now ESM-only (`dist/index.mjs` + `dist/index.d.mts`), `vue >= 3.5` is a peer dependency, and Node.js >= 24 is required.
- **License**: relicensed from ISC to MIT.

### New APIs

Hooks:

- `useLayoutEffect` — synchronous effects right after the DOM update, before paint
- `useTransition` — non-urgent updates with an `isPending` flag
- `useDeferredValue` — defer a value by one scheduler flush
- `useOptimistic` — optimistic state that resets when the real state catches up
- `useActionState` — async actions with pending state
- `useSyncExternalStore` — subscribe to external stores
- `useEffectEvent` — stable identity, always-latest implementation
- `useImperativeHandle` — expose a custom handle on a parent ref
- `useId` — stable unique IDs
- `useFormStatus` — submission status of the nearest `Form`
- `use` — read promises (Suspense) and contexts

Components:

- `Suspense` — React style boundary that catches promises thrown by `use`
- `StrictMode` — double-invoked renders and effects in descendants
- `Activity` — hide children while preserving their state
- `ViewTransition` — animate transition updates with the View Transitions API
- `Form` — action-driven form, pairs with `useFormStatus`

Functions:

- `startTransition` / `addTransitionType` — transitions with view-transition types
- `cache` — memoization by argument identity (stable promise identity for `use`)
- `cacheSignal` — `AbortSignal` scoped to the component lifetime
- `act` — test helper that flushes renders and effects

### Infrastructure

- Migrated to the [Vite+](https://viteplus.dev/) unified toolchain: `vp dev` / `vp test` / `vp check` / `vp pack`, all configured from a single `vite.config.ts` (no npm scripts — tasks run via `vpr`).
- Tests run in **Vitest Browser Mode** on real Chromium (Playwright provider).
- Type checking is handled by `vp check` (oxlint-tsgolint with `typeCheck` enabled) on TypeScript 7 (native).
- pnpm v11 workspace with dependency versions managed via the pnpm **catalog**.
- Library build via `vp pack` (tsdown + rolldown, dts generated with the native tsgo compiler).
- GitHub Actions CI with the official `setup-vp` action.
