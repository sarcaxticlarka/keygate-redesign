import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal, SplitWords } from "./Motion";

// One header for every inner page: breadcrumb trail, big title, lead.
export function PageHero({ crumbs, title, accentFrom, lead, children }: { crumbs: { label: string; href?: string }[]; title: string; accentFrom?: number; lead: ReactNode; children?: ReactNode }) {
  return (
    <section className="sec page-hero">
      <div className="frame">
        <div className="inner">
          <div>
            <div className="crumbs">
              <Link href="/">Keygate</Link>
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: "contents" }}>
                  <span>/</span>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}
                </span>
              ))}
            </div>
            <h1 className="display"><SplitWords as="span" text={title} accentFrom={accentFrom} delay={0.1} /></h1>
          </div>
          <Reveal delay={0.35}><div className="page-meta"><p className="lead">{lead}</p>{children}</div></Reveal>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: ReactNode }) {
  return (
    <div className="split">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <div style={{ marginTop: 20 }}><SplitWords as="h2" className="display" text={title} /></div>
      </div>
      {lead && <Reveal><p className="lead">{lead}</p></Reveal>}
    </div>
  );
}

// Same closing band on every page.
export function CTABand({ title = "Ready to own your licensing?", primary = { href: "/docs/quick-start", label: "Deploy now" }, secondary = { href: "https://github.com/tabloy/keygate", label: "View source ↗" } }: { title?: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="sec accent">
      <div className="frame cta-band">
        <h2 className="display">{title}</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={primary.href} className="btn solid">{primary.label} <span className="arrow">→</span></Link>
          <Link href={secondary.href} className="btn" target={secondary.href.startsWith("http") ? "_blank" : undefined}>{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}
