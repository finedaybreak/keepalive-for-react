import eventBus from "../event";

function useOnDestroy(cb: () => any, _key: string) {
    eventBus.on("destroy", cacheKeys => {
        if (cacheKeys.includes(_key)) {
            cb();
        }
    });
    eventBus.on("destroyAll", () => {
        cb();
    });
    eventBus.on("destroyOther", cacheKey => {
        if (cacheKey !== _key) {
            cb();
        }
    });
    eventBus.on("refresh", cacheKey => {
        if (cacheKey === _key) {
            cb();
        }
    });
}

export default useOnDestroy;
