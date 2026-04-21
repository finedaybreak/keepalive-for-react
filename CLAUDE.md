# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

pnpm workspace (see `pnpm-workspace.yaml`). Two publishable packages, plus two runnable examples:

-   `packages/core` → `keepalive-for-react` — the `<KeepAlive/>` component and hooks. Only runtime dep is `mitt`.
-   `packages/router` → `keepalive-for-react-router` — thin `<KeepAliveRouteOutlet/>` wrapper that reads `react-router`'s `useLocation`/`useOutlet` and feeds them into core. Peer-depends on `keepalive-for-react` and `react-router >= 6`.
-   `examples/react-router-dom-simple-starter`, `examples/simple-tabs-starter` — Vite + React playgrounds used to smoke-test changes.

Versions of the two packages are **linked** in `.changeset/config.json` — they always bump together, so a change in core should almost always have a matching changeset for router (even if router's code didn't change).

## Commands

All run from repo root unless noted:

```bash
pnpm install                 # install workspace
pnpm build                   # tsup build for every package (pnpm -r build)
pnpm clean                   # rm -rf dist in every package
pnpm format                  # prettier --write on ts/tsx/json
pnpm changeset               # author a changeset
pnpm version                 # apply changesets (bump versions + changelogs)
pnpm release                 # build + changeset publish
pnpm example:router          # run the react-router example
pnpm example:tabs            # run the simple-tabs example
```

Per-package build: `pnpm --filter keepalive-for-react build` (or `...-router`). Both use `tsup` with `src/index.ts` as entry, emitting `cjs`+`esm`+`.d.ts`, with `react`/`react-dom`/`react/jsx-runtime` external. There is **no test suite** — verify changes by running the examples.

Pre-commit: husky runs `lint-staged` which runs prettier on staged files.

## Architecture

### Core runtime model (`packages/core/src/components/KeepAlive/index.tsx`)

`KeepAlive` holds a `cacheNodes: CacheNode[]` state (`{ cacheKey, ele, lastActiveTime, renderCount }`). On every `activeCacheKey`/`children` change (inside `useLayoutEffect` + `safeStartTransition`):

-   If a node for the key exists → update its `ele` and `lastActiveTime`. If `maxAliveTime` has elapsed (global number or per-key `MaxAliveConfig[]`), bump `renderCount` (forces a remount) and emit `destroy` so `onCreate` cleanups fire.
-   If not → push a new node. When length exceeds `max`, the LRU node (lowest `lastActiveTime`) is evicted and `destroy` is emitted for its key.

`refresh`/`destroy`/`destroyAll`/`destroyOther` all emit via the `mitt` event bus (`src/event/index.ts`) before mutating state — this is the _only_ way create-time cleanups (`useEffectOnCreate`) are notified, so **any code path that removes or remounts a cache node must emit the right event first**. See commit `6c73bd1` for the precedent.

`aliveRef` exposes this API imperatively via `useImperativeHandle`; `useKeepAliveRef()` is just `useRef<KeepAliveRef>(null)`.

### DOM hand-off (`packages/core/src/components/CacheComponent/index.tsx`)

Each cache node renders into its own imperatively-created `<div class="keepalive-cache-div">` via `createPortal`. `KeepAlive` renders one `containerDivRef` element; `CacheComponent` uses a `useLayoutEffect` to move the currently-active cache div into that container and toggle `.active`/`.inactive` classes on siblings.

Three swap modes, picked from props:

-   **`transition`**: mark prev siblings `.inactive`, wait `duration - 40ms`, remove them, then append the new div. Relies on user CSS keying off `.active`/`.inactive`.
-   **`viewTransition`**: wraps the sync swap in `document.startViewTransition(...)`.
-   **default**: synchronous swap inside the same `useLayoutEffect`.

When inactive **and** not in `include` / matching `exclude`, `CacheComponent` calls `destroy(cacheKey)` itself — this is how `include`/`exclude` eviction flows back into the parent's state.

A cache node only renders its children once `activatedRef.current` has ever been true, so cached-but-never-visited children are not mounted.

### Context + hooks

`CacheComponentProvider` wraps each cache node's children in `CacheComponentContext`, exposing `{ active, refresh, destroy, destroyAll, destroyOther, getCacheNodes, _cacheKey }`. `_cacheKey` is the private hook used by create-time lifecycle hooks to match `destroy` events.

-   `useEffectOnActive` / `useLayoutEffectOnActive` — via `useOnActive`, skip when `!active`, optional `skipMount` to no-op the first render.
-   `useEffectOnCreate` / `useLayoutEffectOnCreate` — via `useOnCreate`, run once, store the returned cleanup, then subscribe to the event bus so cleanup fires on `destroy`/`destroyAll`/`destroyOther`/`refresh` for the matching `_cacheKey`.
-   `useKeepAliveContext` — direct read of the context.

### React version compatibility (`packages/core/src/compat/`)

-   `Activity.tsx` feature-detects `React.Activity` (19.2+) and sets `hasNativeActivity`; `MemoizedActivty` delays the `visible`→`hidden` flip by `duration` ms so native Activity plays nicely with the transition swap.
-   `safeStartTransition.ts` falls back to a synchronous call when `startTransition` isn't defined (< React 18).
-   `enableActivity` is off by default. Turning it on changes the semantics of `useEffect` inside children: effects re-run on every activation instead of once at mount.

Peer-deps allow React `>=16.8.0`. README pins the split: use `keepalive-for-react@4.x` for React 18, `@5.x` for React 19.2+. React's `StrictMode` is known-incompatible in dev and must not be used.

### Router adapter (`packages/router/src/components/KeepAliveRouteOutlet/index.tsx`)

Tiny component: `activeCacheKey` defaults to `location.pathname + location.search`, and `children` is `useOutlet()` (optionally wrapped in `wrapperComponent`). All other `KeepAliveProps` are forwarded. If you need anything router-specific, add it here — core has no router awareness.
