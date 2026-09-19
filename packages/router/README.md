# KeepAlive for React Router

Supports React Router v6, v7, and v8 with `keepalive-for-react-router@6`.

## Installation

```bash
npm install keepalive-for-react@6 keepalive-for-react-router@6
```

### v6

```bash
npm install react-router-dom@6 keepalive-for-react@6 keepalive-for-react-router@6
```

### v7

```bash
npm install react-router@7 keepalive-for-react@6 keepalive-for-react-router@6
```

### v8

React Router v8.3.1 requires Node.js >=22.22.0 and React / React DOM >=19.2.7. Update these dependencies before using v8.

```bash
npm install react-router@^8.3.1 keepalive-for-react@6 keepalive-for-react-router@6
```

## Usage

```tsx
import KeepAliveRouteOutlet from "keepalive-for-react-router";

function Layout() {
    return (
        <div className="layout">
            <KeepAliveRouteOutlet />
        </div>
    );
}
```

## Props

`KeepAliveRouteOutlet` inherits the [core `KeepAlive` props](../core/README.md#keepalive-props), with an optional `activeCacheKey` and an additional `wrapperComponent`:

```tsx
import type { ComponentType, ReactNode } from "react";
import type { KeepAliveProps } from "keepalive-for-react";

interface KeepAliveRouteOutletProps extends Omit<KeepAliveProps, "activeCacheKey"> {
    wrapperComponent?: ComponentType<{ children: ReactNode }>;
    activeCacheKey?: string;
}
```

| Prop               | Default                               | Description                                                                                                                                                                        |
| ------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeCacheKey`   | `location.pathname + location.search` | Overrides the route's cache key. An empty string falls back to the default. The default distinguishes query strings but ignores the URL hash.                                      |
| `wrapperComponent` | `Fragment`                            | Wraps the outlet inside each cache node. Receives the outlet as `children`.                                                                                                        |
| Other core props   | Core defaults                         | Forwarded to `KeepAlive`, including `max`, `include`, `exclude`, `aliveRef`, `transition`, `viewTransition`, `duration`, `maxAliveTime`, `enableActivity`, and `customClassNames`. |

Although `children` is present in the inherited type, rendered content always comes from `useOutlet()`. Use `wrapperComponent` to wrap that content. `include` and `exclude` match the resulting cache key.

### Custom cache key and state classes

Use the pathname alone to share a cache entry across query-string changes on the same path:

```tsx
import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { useKeepAliveRef } from "keepalive-for-react";
import KeepAliveRouteOutlet from "keepalive-for-react-router";

function RouteWrapper({ children }: { children: ReactNode }) {
    return <main className="route-content">{children}</main>;
}

function Layout() {
    const location = useLocation();
    const aliveRef = useKeepAliveRef();

    return (
        <KeepAliveRouteOutlet
            activeCacheKey={location.pathname}
            wrapperComponent={RouteWrapper}
            aliveRef={aliveRef}
            max={18}
            transition
            customClassNames={{ active: "route-active", inactive: "route-inactive" }}
        />
    );
}
```

Define transition styles using `.route-active` and `.route-inactive`. Omitted `customClassNames` fields retain the core defaults (`active` and `inactive`); each value must be a single non-empty CSS class name.

Inside cached route components, `useKeepAliveContext()` exposes `active`, `cacheKey`, and the cache management methods. `cacheKey` identifies that component's cache node, including while it is inactive. Calls to `refresh()`, `destroy()`, or `destroyOther()` without a key target that node (or preserve it for `destroyOther()`); calls through `aliveRef.current` default to the currently active node.
