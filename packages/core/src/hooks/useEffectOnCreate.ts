import { useEffect } from "react";
import useOnCreate from "./useOnCreate";

const useEffectOnCreate = (cb: () => any): void => {
    useOnCreate(cb, useEffect);
};

export default useEffectOnCreate;
