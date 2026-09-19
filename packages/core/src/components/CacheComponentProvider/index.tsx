import { memo, ReactNode, useCallback, useMemo } from "react";
import { CacheComponentContext, KeepAliveContext } from "../CacheContext";

interface CacheComponentProviderProps extends KeepAliveContext {
    children?: ReactNode;
}

const CacheComponentProvider = memo(function (props: CacheComponentProviderProps) {
    const { children, active, refresh, destroy, destroyAll, destroyOther, getCacheNodes, cacheKey } = props;
    const _destory = useCallback(
        (targetKey?: string | string[]) => {
            return destroy(targetKey ?? cacheKey);
        },
        [destroy, cacheKey],
    );
    const _refresh = useCallback(
        (targetKey?: string) => {
            return refresh(targetKey ?? cacheKey);
        },
        [refresh, cacheKey],
    );
    const _destroyOther = useCallback(
        (targetKey?: string) => {
            return destroyOther(targetKey ?? cacheKey);
        },
        [destroyOther, cacheKey],
    );
    const value = useMemo(() => {
        return { active, refresh: _refresh, destroy: _destory, destroyAll, destroyOther: _destroyOther, getCacheNodes, cacheKey };
    }, [active, _refresh, _destory, destroyAll, _destroyOther, getCacheNodes, cacheKey]);
    return <CacheComponentContext.Provider value={value}>{children}</CacheComponentContext.Provider>;
});

export default CacheComponentProvider;
