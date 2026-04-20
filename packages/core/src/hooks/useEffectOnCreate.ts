import { useEffect } from "react";
import useOnCreate from "./useOnCreate";

const useEffectOnCreate = (cb: () => void): void => {
    useOnCreate(cb, useEffect);
};

export default useEffectOnCreate;
