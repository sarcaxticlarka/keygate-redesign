"use client";
import { useCallback, useEffect, useState } from "react";

export type Mode = "dark" | "light" | "system";
export const THEMES = [
  { id: "lime", label: "Lime", color: "#d2ff3f" },
  { id: "violet", label: "Violet", color: "#a48cff" },
  { id: "ember", label: "Ember", color: "#ff7a3d" },
  { id: "ocean", label: "Ocean", color: "#3fd0ff" },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];

// Runs before first paint (inlined in <head>) so the page never flashes the wrong theme.
export const themeInitScript = `(function(){try{var d=document.documentElement,m=localStorage.getItem("kg-mode")||"dark",t=localStorage.getItem("kg-theme")||"lime";if(m==="system")m=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.mode=m;d.dataset.theme=t;if(sessionStorage.getItem("kg-loaded")==="1")d.dataset.seen="1"}catch(e){}})()`;

function resolve(mode: Mode) {
  return mode === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : mode;
}

export function useTheme() {
  const [mode, setModeState] = useState<Mode>("dark");
  const [theme, setThemeState] = useState<ThemeId>("lime");

  useEffect(() => {
    try {
      setModeState((localStorage.getItem("kg-mode") as Mode) || "dark");
      setThemeState((localStorage.getItem("kg-theme") as ThemeId) || "lime");
    } catch {}
    const sync = () => {
      try {
        setModeState((localStorage.getItem("kg-mode") as Mode) || "dark");
        setThemeState((localStorage.getItem("kg-theme") as ThemeId) || "lime");
      } catch {}
    };
    window.addEventListener("kg-theme", sync);
    return () => window.removeEventListener("kg-theme", sync);
  }, []);

  // follow the OS while mode === "system"
  useEffect(() => {
    if (mode !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: light)");
    const on = () => { document.documentElement.dataset.mode = resolve("system"); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [mode]);

  const setMode = useCallback((m: Mode) => {
    try { localStorage.setItem("kg-mode", m); } catch {}
    document.documentElement.dataset.mode = resolve(m);
    window.dispatchEvent(new Event("kg-theme"));
  }, []);
  const setTheme = useCallback((t: ThemeId) => {
    try { localStorage.setItem("kg-theme", t); } catch {}
    document.documentElement.dataset.theme = t;
    window.dispatchEvent(new Event("kg-theme"));
  }, []);

  return { mode, theme, setMode, setTheme };
}
