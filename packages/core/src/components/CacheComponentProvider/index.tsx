import { memo, ReactNode, useMemo } from "react";
import { CacheComponentContext, KeepAliveContext } from "../CacheContext";

interface CacheComponentProviderProps extends KeepAliveContext {
    children?: ReactNode;
}

const CacheComponentProvider = memo(function (props: CacheComponentProviderProps) {
    const { children, active, refresh, destroy, destroyAll, destroyOther, getCacheNodes, _cacheKey } = props;
    const value = useMemo(() => {
        return { active, refresh, destroy, destroyAll, destroyOther, getCacheNodes, _cacheKey };
    }, [active, refresh, destroy, destroyAll, destroyOther, getCacheNodes, _cacheKey]);
    return <CacheComponentContext.Provider value={value}>{children}</CacheComponentContext.Provider>;
});

export default CacheComponentProvider;
