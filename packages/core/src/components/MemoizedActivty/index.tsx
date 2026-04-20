import { Activity } from "../../compat/Activity";
import { ReactNode, useLayoutEffect, useRef, useState, memo } from "react";

interface MemoizedActivtyProps {
    children: ReactNode;
    active: boolean;
    duration: number;
}

function _MemoizedActivty({ children, active, duration }: MemoizedActivtyProps) {
    const [delayedActive, setDelayedActive] = useState(active);
    const delayedActiveTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
    useLayoutEffect(() => {
        if (active) {
            setDelayedActive(true);
        } else {
            if (delayedActiveTimerRef.current) {
                clearTimeout(delayedActiveTimerRef.current);
            }
            delayedActiveTimerRef.current = setTimeout(() => {
                setDelayedActive(false);
                if (delayedActiveTimerRef.current) {
                    clearTimeout(delayedActiveTimerRef.current);
                }
            }, duration);
        }
        return () => {
            if (delayedActiveTimerRef.current) {
                clearTimeout(delayedActiveTimerRef.current);
            }
        };
    }, [active]);
    return <Activity mode={delayedActive ? "visible" : "hidden"}>{children}</Activity>;
}

const MemoizedActivty = memo(_MemoizedActivty, (prevProps, nextProps) => {
    return prevProps.active === nextProps.active && prevProps.duration === nextProps.duration;
});

MemoizedActivty.displayName = "MemoizedActivty";

export default MemoizedActivty;
