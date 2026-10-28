"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, GITHUB } from "@/lib/data";
import { ThemeButton, ThemePanel } from "./ThemeSwitcher";

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden>
      <rect width="22" height="22" fill="var(--accent)" />
      <g fill="var(--on-accent)"><rect x="6" y="4" width="10" height="4" /><rect x="6" y="8" width="4" height="4" /><rect x="12" y="8" width="4" height="4" /><rect x="9" y="12" width="4" height="6" /></g>
    </svg>
  );
}

const I = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  compare: <path d="M4 5h7v14H4zM13 5h7v14h-7z" />,
  docs: <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4zM9 9h6M9 13h6" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  bolt: <path d="M13 3L5 13h6l-1 8 8-10h-6z" />,
};
const Icon = ({ d }: { d: keyof typeof I }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">{I[d]}</svg>
);

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const active = (href: string) => (href === "/" ? path === "/" : !href.includes("#") && path.startsWith(href));

  return (
    <>
      <header className="nav">
        <div className="nav-in">
          <Link href="/" className="nav-logo"><Logo /> Keygate</Link>
          <nav className="nav-cells">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`nav-cell ${active(n.href) ? "active" : ""}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="nav-right">
            <ThemeButton />
            <a className="nav-cell" href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
            <Link className="nav-cell nav-cta" href="/docs/quick-start">Get Started</Link>
          </div>
          <div className="nav-mob-right">
            <ThemeButton compact />
            <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} style={{ zIndex: 95 }}>{open ? "CLOSE" : "MENU"}</button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
            <div className="menu-links">
              {[{ href: "/", label: "Home" }, ...nav.filter((n) => !n.href.includes("#")), { href: "/docs/quick-start", label: "Quick start" }].map((n, i) => (
                <motion.div key={n.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <Link href={n.href} className={active(n.href) ? "on" : ""}>{n.label}<span>0{i + 1}</span></Link>
                </motion.div>
              ))}
            </div>
            <div className="menu-theme"><ThemePanel /></div>
            <div className="menu-foot">
              <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
              <Link className="btn solid" href="/docs/quick-start">Deploy <span className="arrow">→</span></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="dock" aria-label="Primary">
        <Link href="/" className={active("/") ? "on" : ""}><Icon d="home" />Home</Link>
        <Link href="/compare" className={active("/compare") ? "on" : ""}><Icon d="compare" />Compare</Link>
        <Link href="/docs" className={active("/docs") ? "on" : ""}><Icon d="docs" />Docs</Link>
        <Link href="/sponsorships" className={active("/sponsorships") ? "on" : ""}><Icon d="heart" />Sponsor</Link>
        <Link href="/docs/quick-start" className="go"><Icon d="bolt" />Deploy</Link>
      </nav>
    </>
  );
}
