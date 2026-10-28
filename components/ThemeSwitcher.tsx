"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { THEMES, useTheme, type Mode } from "@/lib/theme";

const MODES: { id: Mode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "Auto" },
];

export function ThemePanel() {
  const { mode, theme, setMode, setTheme } = useTheme();
  return (
    <div>
      <h6>Appearance</h6>
      <div className="seg">
        {MODES.map((m) => (
          <button key={m.id} aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</button>
        ))}
      </div>
      <h6>Accent</h6>
      <div className="swatches">
        {THEMES.map((t) => (
          <button key={t.id} className="sw" aria-pressed={theme === t.id} onClick={() => setTheme(t.id)}>
            <i style={{ background: t.color }} />{t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemeButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div ref={ref} style={{ display: "flex", height: "100%" }}>
      <button className="theme-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Theme">
        <span className="swatch-dot" />{!compact && "Theme"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="theme-pop" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <ThemePanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
