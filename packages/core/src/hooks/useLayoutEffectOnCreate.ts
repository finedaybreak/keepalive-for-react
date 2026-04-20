import { useLayoutEffect } from "react";
import useOnCreate from "./useOnCreate";

const useLayoutEffectOnCreate = (cb: () => any): void => {
    useOnCreate(cb, useLayoutEffect);
};

export default useLayoutEffectOnCreate;
