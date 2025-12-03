import * as React from "react";

// React 19+ 原生 Activity 组件
const NativeActivity = (React as any).Activity;

export interface ActivityProps {
    children: React.ReactNode;
    mode: "visible" | "hidden";
}

/**
 * Activity 兼容组件
 * - React 19+: 使用原生 Activity
 * - React 18: 使用 Fragment fallback（用户自行处理隐藏逻辑）
 */
export const Activity: React.ComponentType<ActivityProps> = NativeActivity ?? React.Fragment;

export const hasNativeActivity = !!NativeActivity;
