import KeepAlive, { KeepAliveProps, KeepAliveRef, useKeepAliveRef } from "./components/KeepAlive";
import useEffectOnActive from "./hooks/useEffectOnActive";
import useKeepAliveContext from "./hooks/useKeepAliveContext";
import useLayoutEffectOnActive from "./hooks/useLayoutEffectOnActive";
import useEffectOnCreate from "./hooks/useEffectOnCreate";
import useLayoutEffectOnCreate from "./hooks/useLayoutEffectOnCreate";

/**
 * @deprecated since version 3.0.2. Use `useKeepAliveRef` instead.
 */
const useKeepaliveRef = useKeepAliveRef;

export {
    KeepAlive,
    useKeepAliveRef,
    useKeepaliveRef,
    useEffectOnActive,
    useLayoutEffectOnActive,
    useKeepAliveContext,
    useEffectOnCreate,
    useLayoutEffectOnCreate,
};

export type { KeepAliveRef, KeepAliveProps };
