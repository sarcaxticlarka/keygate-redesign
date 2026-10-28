"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { docsGroups, slugify } from "@/lib/data";

export default function DocsSide() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => setOpen(false), [path]);
  const all = docsGroups.flatMap((g) => g.items);
  const cur = path === "/docs" ? "Overview" : all.find((t) => `/docs/${slugify(t)}` === path) ?? "Docs";
  return (
    <>
      <button className="docs-toggle" onClick={() => setOpen(true)} aria-expanded={open}><span>Docs · <b>{cur}</b></span><span>Menu ▾</span></button>
      <div className={`docs-scrim ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`docs-side ${open ? "open" : ""}`}>
        <label className="side-filter"><span aria-hidden>⌕</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter pages" aria-label="Filter pages" /></label>
        {!q && <Link href="/docs" className={path === "/docs" ? "on" : ""}>Overview</Link>}
        {docsGroups.map((g) => {
          const items = g.items.filter((it) => it.toLowerCase().includes(q.trim().toLowerCase()));
          if (!items.length) return null;
          return (
            <div key={g.title}>
              <h5>{g.title}</h5>
              {items.map((it) => { const href = `/docs/${slugify(it)}`; return <Link key={it} href={href} className={path === href ? "on" : ""}>{it}</Link>; })}
            </div>
          );
        })}
      </aside>
    </>
  );
}
