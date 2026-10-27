import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, SplitWords } from "@/components/Motion";
import { vendors, type VendorKey } from "@/lib/data";

const sym = { yes: "✓", no: "✕", partial: "~" } as const;

export function generateStaticParams() { return Object.keys(vendors).map((vendor) => ({ vendor })); }

export default async function Vs({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const v = vendors[vendor as VendorKey];
  if (!v) notFound();
  return (
    <>
      <section className="sec page-hero"><div className="frame"><div className="inner">
        <h1 className="display"><SplitWords as="span" text={`Keygate vs ${v.name}`} accentFrom={2} delay={0.1} /></h1>
        <Reveal delay={0.4}><p className="lead">{v.blurb}</p></Reveal>
      </div></div></section>
      <section className="sec"><div className="frame pad">
        <Reveal>
          <div className="tbl-wrap" style={{ marginTop: 0 }}>
            <table className="cmp">
              <thead><tr><th>Feature</th><th className="kg">Keygate</th><th>{v.name}</th></tr></thead>
              <tbody>{v.rows.map((r) => (
                <tr key={r[0]}><td>{r[0]}</td><td className="kg"><span className={`mark ${r[1]}`}>{sym[r[1] as "yes"]}</span></td><td><span className={`mark ${r[2]}`}>{sym[r[2] as "yes"]}</span></td></tr>
              ))}</tbody>
            </table>
          </div>
        </Reveal>
        <p className="mono muted" style={{ fontSize: 12, marginTop: 20 }}>✓ yes · ~ partial · ✕ no. Checked October 2026.</p>
      </div></section>
      <section className="sec light"><div className="frame pad">
        <span className="eyebrow">Which one fits</span>
        <p className="display" style={{ fontSize: "clamp(28px,3.6vw,52px)", maxWidth: 980, margin: "24px 0 40px", lineHeight: 1.08 }}>{v.pick}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/docs/quick-start" className="btn solid">Try Keygate <span className="arrow">→</span></Link>
          <Link href="/compare" className="btn">All comparisons</Link>
        </div>
      </div></section>
    </>
  );
}
