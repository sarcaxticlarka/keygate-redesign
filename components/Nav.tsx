"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, GITHUB } from "@/lib/data";

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden>
      <rect width="22" height="22" fill="#d2ff3f" />
      <g fill="#0b0c0e"><rect x="6" y="4" width="10" height="4" /><rect x="6" y="8" width="4" height="4" /><rect x="12" y="8" width="4" height="4" /><rect x="9" y="12" width="4" height="6" /></g>
    </svg>
  );
}

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = (href: string) => !href.includes("#") && path.startsWith(href);
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
            <a className="nav-cell" href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
            <Link className="nav-cell nav-cta" href="/docs/quick-start">Get Started</Link>
          </div>
          <button className="nav-burger mono" onClick={() => setOpen(!open)} aria-label="Menu">{open ? "CLOSE" : "MENU"}</button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu">
          {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <a href={GITHUB}>GitHub ↗</a>
          <Link href="/docs/quick-start" style={{ background: "var(--lime)", color: "var(--ink)" }}>Get Started →</Link>
        </div>
      )}
    </>
  );
}
