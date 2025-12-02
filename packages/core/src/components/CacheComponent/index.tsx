import { ComponentType, Activity, Fragment, memo, ReactNode, RefObject, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { delayAsync, domAttrSet, isInclude } from "../../utils";

export interface CacheComponentProps {
    children: ReactNode;
    errorElement?: ComponentType<{
        children: ReactNode;
    }>;
    containerDivRef: RefObject<HTMLDivElement | null>;
    cacheNodeClassName: string;
    renderCount: number;
    active: boolean;
    cacheKey: string;
    transition: boolean;
    viewTransition: boolean;
    duration: number;
    exclude?: Array<string | RegExp> | string | RegExp;
    include?: Array<string | RegExp> | string | RegExp;
    destroy: (cacheKey: string | string[]) => Promise<void>;
    activityChildrenContainerClassName: string;
}

const cacheDivMarkedClassName = "keepalive-cache-div";

function getChildNodes(dom?: HTMLDivElement) {
    return dom ? Array.from(dom.children) : [];
}

function removeDivNodes(nodes: Element[]) {
    nodes.forEach(node => {
        if (node.classList.contains(cacheDivMarkedClassName)) {
            node.remove();
        }
    });
}

function renderCacheDiv(containerDiv: HTMLDivElement, cacheDiv: HTMLDivElement) {
    const removeNodes = getChildNodes(containerDiv);
    removeDivNodes(removeNodes);
    containerDiv.appendChild(cacheDiv);
    cacheDiv.classList.remove("inactive");
    cacheDiv.classList.add("active");
}

function switchActiveNodesToInactive(containerDiv: HTMLDivElement, cacheKey: string) {
    const nodes = getChildNodes(containerDiv);
    const activeNodes = nodes.filter(node => node.classList.contains("active") && node.getAttribute("data-cache-key") !== cacheKey);
    activeNodes.forEach(node => {
        node.classList.remove("active");
        node.classList.add("inactive");
    });
    return activeNodes;
}

function isCached(
    cacheKey: string,
    exclude?: Array<string | RegExp> | string | RegExp,
    include?: Array<string | RegExp> | string | RegExp,
) {
    if (include) {
        return isInclude(include, cacheKey);
    } else {
        if (exclude) {
            return !isInclude(exclude, cacheKey);
        }
        return true;
    }
}

const CacheComponent = memo(
    function (props: CacheComponentProps): any {
        const { errorElement: ErrorBoundary = Fragment, cacheNodeClassName, children, cacheKey, exclude, include } = props;
        const { active, renderCount, destroy, transition, viewTransition, duration, containerDivRef, activityChildrenContainerClassName } =
            props;
        const activatedRef = useRef(false);

        activatedRef.current = activatedRef.current || active;

        const cacheDiv = useMemo(() => {
            const cacheDiv = document.createElement("div");
            domAttrSet(cacheDiv)
                .set("data-cache-key", cacheKey)
                .set("style", "height: 100%")
                .set("data-render-count", renderCount.toString());
            cacheDiv.className = cacheDivMarkedClassName + (cacheNodeClassName ? ` ${cacheNodeClassName}` : "");
            return cacheDiv;
        }, [renderCount, cacheNodeClassName]);

        useEffect(() => {
            const cached = isCached(cacheKey, exclude, include);
            const containerDiv = containerDivRef.current;
            if (!containerDiv) {
                console.warn(`keepalive: cache container not found`);
                return;
            }
            if (transition) {
                (async () => {
                    if (active) {
                        const inactiveNodes = switchActiveNodesToInactive(containerDiv, cacheKey);
                        // duration - 40ms is to avoid the animation effect ending too early
                        await delayAsync(duration - 40);
                        removeDivNodes(inactiveNodes);
                        if (containerDiv.contains(cacheDiv)) {
                            return;
                        }
                        renderCacheDiv(containerDiv, cacheDiv);
                    } else {
                        if (!cached) {
                            await delayAsync(duration);
                            destroy(cacheKey);
                        }
                    }
                })();
            } else {
                if (active) {
                    const makeChange = () => {
                        const inactiveNodes = switchActiveNodesToInactive(containerDiv, cacheKey);
                        removeDivNodes(inactiveNodes);
                        if (containerDiv.contains(cacheDiv)) {
                            return;
                        }
                        renderCacheDiv(containerDiv, cacheDiv);
                    };
                    if (viewTransition && (document as any).startViewTransition) {
                        (document as any).startViewTransition(makeChange);
                    } else {
                        makeChange();
                    }
                } else {
                    if (!cached) {
                        destroy(cacheKey);
                    }
                }
            }
        }, [active, containerDivRef, cacheKey, exclude, include]);

        return activatedRef.current
            ? createPortal(
                  <ErrorBoundary>
                      <Activity mode={active ? "visible" : "hidden"}>
                          <ActivityChildrenContainer className={activityChildrenContainerClassName}>{children}</ActivityChildrenContainer>
                      </Activity>
                  </ErrorBoundary>,
                  cacheDiv,
                  cacheKey,
              )
            : null;
    },
    (prevProps, nextProps) => {
        return (
            prevProps.active === nextProps.active &&
            prevProps.renderCount === nextProps.renderCount &&
            prevProps.children === nextProps.children &&
            prevProps.exclude === nextProps.exclude &&
            prevProps.include === nextProps.include
        );
    },
);

function ActivityChildrenContainer({ children, className }: { children: ReactNode; className: string }) {
    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const dom = divRef.current;
        if (!dom) return;

        const observer = new MutationObserver(() => {
            // 使用 requestAnimationFrame 避免可能的无限循环
            requestAnimationFrame(() => {
                if (dom.style.display !== "block") {
                    dom.style.display = "block";
                }
            });
        });

        observer.observe(dom, {
            attributes: true,
            attributeFilter: ["style"], // 只监听 style 变化
        });

        return () => {
            observer.disconnect(); // 同步断开，无需延迟
        };
    }, []);

    return (
        <div className={className} ref={divRef} style={{ height: "100%" }}>
            {children}
        </div>
    );
}

export default CacheComponent;
