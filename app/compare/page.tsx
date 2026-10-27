import Link from "next/link";
import { Reveal, SplitWords } from "@/components/Motion";
import { vendors, type VendorKey } from "@/lib/data";

export const metadata = { title: "Keygen, Cryptlex and LicenseSpring Alternatives | Keygate" };
const sym = { yes: "✓", no: "✕", partial: "~" } as const;
const quick = [0, 2, 6, 7, 9];

export default function Compare() {
  return (
    <>
      <section className="sec page-hero"><div className="frame"><div className="inner">
        <h1 className="display"><SplitWords as="span" text="Compare Keygate" accentFrom={1} delay={0.1} /></h1>
        <Reveal delay={0.4}><p className="lead">Checked against each vendor's own documentation and pricing. Every product here is good at something; these pages show where Keygate differs and when another tool fits better.</p></Reveal>
      </div></div></section>
      <section className="sec"><div className="frame">
        <div className="vs-links" style={{ marginTop: 0, borderTop: 0 }}>
          {(Object.keys(vendors) as VendorKey[]).map((k) => (
            <Link key={k} href={`/compare/${k}`} className="vs-link">
              <span className="mono muted" style={{ fontSize: 12, letterSpacing: ".1em" }}>KEYGATE VS</span>
              <span className="display">{vendors[k].name}</span>
              <table className="cmp" style={{ minWidth: 0 }}>
                <tbody>
                  {quick.map((q) => { const r = vendors[k].rows[q]; return (
                    <tr key={q}><td style={{ fontSize: 13, padding: "10px 0", border: 0, borderBottom: "1px solid currentColor", background: "none" }}>{r[0]}</td>
                      <td style={{ border: 0, borderBottom: "1px solid currentColor", background: "none" }}><span className={`mark ${r[1]}`}>{sym[r[1] as "yes"]}</span></td>
                      <td style={{ border: 0, borderBottom: "1px solid currentColor", background: "none" }}><span className={`mark ${r[2]}`}>{sym[r[2] as "yes"]}</span></td></tr>
                  ); })}
                </tbody>
              </table>
              <span className="mono" style={{ fontSize: 13 }}>View full comparison →</span>
            </Link>
          ))}
        </div>
      </div></section>
      <section className="sec light"><div className="frame pad">
        <span className="eyebrow">What sets Keygate apart</span>
        <div className="three" style={{ borderColor: "var(--line-l)" }}>
          {[
            ["Free to self host, with every feature", "Keygate is open source. The version you run yourself has every feature, with no paid edition and no limits on products, licenses or activations."],
            ["Payments without glue code", "Connect Stripe and checkouts create licenses, renewals extend them, and failed payments, cancellations and refunds update them. There is no webhook handler for you to write."],
            ["Licensing and updates in one place", "Store signed releases in S3 compatible storage and serve update feeds for Sparkle, Velopack and Tauri, limited to customers whose license covers the update."],
          ].map(([h, p]) => (<div key={h} style={{ borderColor: "var(--line-l)" }}><h3>{h}</h3><p style={{ color: "#4b4c46" }}>{p}</p></div>))}
        </div>
      </div></section>
    </>
  );
}
