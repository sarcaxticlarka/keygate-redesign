import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CTABand } from "@/components/Page";
import CompareTable from "@/components/CompareTable";
import { Reveal } from "@/components/Motion";
import { vendors, vendorRows, type VendorKey } from "@/lib/data";

export function generateStaticParams() { return Object.keys(vendors).map((vendor) => ({ vendor })); }

export default async function Vs({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;
  const v = vendors[vendor as VendorKey];
  if (!v) notFound();
  const others = (Object.keys(vendors) as VendorKey[]).filter((k) => k !== vendor);
  return (
    <>
      <PageHero crumbs={[{ label: "Compare", href: "/compare" }, { label: v.name }]} title={`Keygate vs ${v.name}`} accentFrom={2} lead={v.blurb} />
      <section className="sec">
        <div className="frame pad">
          <Reveal><CompareTable columns={["Keygate", v.name]} rows={vendorRows(vendor as VendorKey)} /></Reveal>
          <p className="mono muted" style={{ fontSize: 12, marginTop: 20 }}>✓ yes · ~ partial · ✕ no. Checked October 2026.</p>
        </div>
      </section>
      <section className="sec alt">
        <div className="frame pad">
          <span className="eyebrow">Which one fits</span>
          <p className="display" style={{ fontSize: "clamp(28px,3.6vw,52px)", maxWidth: 980, margin: "24px 0 40px", lineHeight: 1.08 }}>{v.pick}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {others.map((k) => <Link key={k} href={`/compare/${k}`} className="btn">vs {vendors[k].name} <span className="arrow">→</span></Link>)}
          </div>
        </div>
      </section>
      <CTABand title="Try Keygate on your own server." />
    </>
  );
}
