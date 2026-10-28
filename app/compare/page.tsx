import Link from "next/link";
import { PageHero, SectionHead, CTABand } from "@/components/Page";
import { M, type Mark } from "@/components/CompareTable";
import CompareTable from "@/components/CompareTable";
import { Reveal } from "@/components/Motion";
import { vendors, matrix, type VendorKey } from "@/lib/data";

export const metadata = { title: "Keygen, Cryptlex and LicenseSpring Alternatives | Keygate" };
const quick = [0, 2, 6, 7, 9];

export default function Compare() {
  return (
    <>
      <PageHero crumbs={[{ label: "Compare" }]} title="Compare Keygate" accentFrom={1} lead="Checked against each vendor's own documentation and pricing. Every product here is good at something; these pages show where Keygate differs and when another tool fits better." />

      <section className="sec">
        <div className="frame">
          <div className="vs-links">
            {(Object.keys(vendors) as VendorKey[]).map((k) => (
              <Link key={k} href={`/compare/${k}`} className="vs-link spot">
                <span className="mono muted" style={{ fontSize: 12, letterSpacing: ".1em" }}>KEYGATE VS</span>
                <span className="display">{vendors[k].name}</span>
                <div className="mini-rows">
                  {quick.map((q) => { const r = vendors[k].rows[q]; return (
                    <div key={q} className="mini-row"><span>{r[0]}</span><M v={r[1] as Mark} /><M v={r[2] as Mark} /></div>
                  ); })}
                </div>
                <span className="mono" style={{ fontSize: 13 }}>View full comparison →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="frame pad">
          <SectionHead eyebrow="Everything at once" title="The full matrix." lead="✓ yes · ~ partial · ✕ no. Checked October 2026." />
          <Reveal><div style={{ marginTop: 40 }}><CompareTable columns={["Keygate", "Keygen", "Cryptlex", "LicenseSpring"]} rows={matrix} /></div></Reveal>
        </div>
      </section>

      <section className="sec alt">
        <div className="frame pad">
          <span className="eyebrow">What sets Keygate apart</span>
          <div className="three">
            {[
              ["Free to self host, with every feature", "Keygate is open source. The version you run yourself has every feature, with no paid edition and no limits on products, licenses or activations."],
              ["Payments without glue code", "Connect Stripe and checkouts create licenses, renewals extend them, and failed payments, cancellations and refunds update them. There is no webhook handler for you to write."],
              ["Licensing and updates in one place", "Store signed releases in S3 compatible storage and serve update feeds for Sparkle, Velopack and Tauri, limited to customers whose license covers the update."],
            ].map(([h, p]) => (<div key={h}><h3>{h}</h3><p>{p}</p></div>))}
          </div>
        </div>
      </section>
      <CTABand title="See it for yourself." />
    </>
  );
}
