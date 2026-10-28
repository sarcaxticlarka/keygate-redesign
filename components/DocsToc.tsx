"use client";
import { useEffect, useState } from "react";

export default function DocsToc({ items }: { items: { id: string; label: string }[] }) {
  const [on, setOn] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { es.forEach((e) => e.isIntersecting && setOn(e.target.id)); }, { rootMargin: "-20% 0px -65% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return <div />;
  return (
    <aside className="docs-toc">
      <h5>On this page</h5>
      {items.map((i) => <a key={i.id} href={`#${i.id}`} className={on === i.id ? "on" : ""}>{i.label}</a>)}
    </aside>
  );
}
