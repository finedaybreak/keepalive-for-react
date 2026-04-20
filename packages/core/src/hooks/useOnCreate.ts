import { useEffect, useLayoutEffect, useRef } from "react";
import { isFn } from "../utils";
import useKeepAliveContext from "./useKeepAliveContext";
import useOnDestroy from "./onDestory";

function useOnCreate(cb: () => any, effect: typeof useEffect | typeof useLayoutEffect) {
    const isMount = useRef<boolean>(false);
    const destroyedRef = useRef<boolean>(false);
    const { _cacheKey } = useKeepAliveContext();
    effect(() => {
        let destroyCb: any;
        if (isMount.current === false) {
            isMount.current = true;
            destroyCb = cb();
        }
        useOnDestroy(() => {
            if (isFn(destroyCb) && !destroyedRef.current) {
                destroyedRef.current = true;
                destroyCb();
            }
        }, _cacheKey);
    }, []);
}

export default useOnCreate;
