import { useEffect, useLayoutEffect, useRef } from "react";

function useOnCreate(cb: () => any, effect: typeof useEffect | typeof useLayoutEffect) {
    const isMount = useRef<boolean>(false);
    effect(() => {
        if (isMount.current === false) {
            isMount.current = true;
            cb();
        }
    }, []);
}

export default useOnCreate;
