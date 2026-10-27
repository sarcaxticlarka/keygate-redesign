"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsGroups, slugify } from "@/lib/data";

export default function DocsSide() {
  const path = usePathname();
  return (
    <aside className="docs-side">
      <Link href="/docs" className={path === "/docs" ? "on" : ""}>Overview</Link>
      {docsGroups.map((g) => (
        <div key={g.title}>
          <h5>{g.title}</h5>
          {g.items.map((it) => { const href = `/docs/${slugify(it)}`; return <Link key={it} href={href} className={path === href ? "on" : ""}>{it}</Link>; })}
        </div>
      ))}
    </aside>
  );
}
