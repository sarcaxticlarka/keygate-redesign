"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Item = { slug: string; title: string; group: string; lead: string; minutes: number };

export default function DocsSearch({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = t ? items.filter((d) => (d.title + " " + d.lead + " " + d.group).toLowerCase().includes(t)) : items;
    const m = new Map<string, Item[]>();
    list.forEach((d) => m.set(d.group, [...(m.get(d.group) ?? []), d]));
    return [...m.entries()];
  }, [q, items]);
  return (
    <div>
      <label className="search">
        <span aria-hidden>⌕</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides, endpoints, errors…" aria-label="Search the docs" />
        {q && <button onClick={() => setQ("")} aria-label="Clear">✕</button>}
      </label>
      {groups.length === 0 && <p className="muted" style={{ marginTop: 24 }}>Nothing matches “{q}”. Try “webhook”, “stripe” or “floating”.</p>}
      {groups.map(([g, list]) => (
        <div key={g} className="guide-group">
          <h3>{g}</h3>
          <div className="guide-grid">
            {list.map((d) => (
              <Link key={d.slug} href={`/docs/${d.slug}`} className="guide spot">
                <span className="mono muted">{d.minutes} min</span>
                <b>{d.title}</b>
                <p>{d.lead}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
