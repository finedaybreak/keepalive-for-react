import { createContext } from "react";
import { KeepAliveAPI } from "../KeepAlive";

export interface KeepAliveContext extends KeepAliveAPI {
    /**
     * whether the component is active
     */
    active: boolean;
    /**
     * the cache key of the component
     */
    _cacheKey: string;
}

export const CacheComponentContext = createContext<KeepAliveContext>({
    active: false,
    _cacheKey: "",
    refresh: () => {},
    destroy: () => Promise.resolve(),
    destroyAll: () => Promise.resolve(),
    destroyOther: () => Promise.resolve(),
    getCacheNodes: () => [],
});
