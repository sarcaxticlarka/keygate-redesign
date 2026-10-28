import FAQ from "@/components/FAQ";
import { PageHero, SectionHead, CTABand } from "@/components/Page";

export const metadata = { title: "Sponsor Keygate - Support Open Source License Management | Keygate" };

const tiers = [
  ["Buy a coffee", "Any amount", "one time", "A one off thank you. No strings, no tier."],
  ["Backer", "$5", "/month", "Your name on this page, listed while the membership is active."],
  ["Supporter", "$25", "/month", "Your name on this page and in the README on GitHub."],
  ["Business", "$100", "/month", "Your logo on this page and in the README, linked to your site."],
];
const faq = [
  ["Can I give once instead of monthly?", "Yes. The coffee tier takes any amount, once. Memberships are for people who would rather it be steady and small."],
  ["Do sponsors get priority support?", "No. Bugs are ranked by how much damage they do, not by who reported them. If you need a guaranteed response time, that is a support agreement rather than a sponsorship, and it is worth writing about."],
  ["I use Keygate in my business. Do I owe anything?", "No. Running it, including for your own customers, is free under the AGPL as long as the attribution stays and you publish any changes you make. A commercial license is only for lifting those two conditions."],
  ["How do I get my logo up?", "Sign up for the business tier and send a PNG or SVG with the link you want it to point at. It goes up on this page and in the README on the next release."],
  ["What happens if I cancel?", "Nothing breaks. The listing comes down at the end of the period, and you keep everything you already had, because sponsoring never gated anything in the first place."],
].map(([q, a]) => ({ q, a }));

export default function Sponsor() {
  return (
    <>
      <PageHero crumbs={[{ label: "Sponsor" }]} title="Sponsor Keygate" accentFrom={1} lead="Keygate is free and self hosted, and stays that way. Sponsoring covers the time that goes into releases, issues and docs. Everything here is about visibility, not access." />
      <section className="sec alt">
        <div className="frame">
          <div className="tiers">
            {tiers.map(([n, a, per, d]) => (
              <div key={n} className="tier spot"><b>{n}</b><div className="amt">{a} <small>{per}</small></div><p>{d}</p></div>
            ))}
          </div>
          <div className="pad" style={{ borderTop: "1px solid var(--line)", paddingTop: 40, paddingBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <p className="lead" style={{ maxWidth: 560 }}>Memberships and one off tips are handled on Ko-fi. Cancel whenever you like.</p>
            <a className="btn solid" href="https://ko-fi.com" target="_blank" rel="noreferrer">Sponsor on Ko-fi <span className="arrow">→</span></a>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="frame pad">
          <span className="eyebrow">Where it goes</span>
          <div className="three">
            {[["Releases and fixes", "Reported bugs, the tests that keep them from coming back, and a release that people can upgrade to without surprises."],
              ["Running the project", "The site, the docs, CI minutes, and the Stripe and storage accounts the end to end tests run against."],
              ["Docs and translations", "Guides that answer a question before it becomes an issue, and keeping the English and Chinese interfaces in step."]].map(([h, p]) => (
              <div key={h}><h3>{h}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="frame pad">
          <span className="eyebrow">Sponsors</span>
          <p className="lead" style={{ marginTop: 20 }}>Backers and supporters are listed here by name. Business sponsors get their logo.</p>
          <div className="backers"><span>Troy</span><span>Thomas K.</span></div>
        </div>
      </section>
      <section className="sec">
        <div className="frame pad">
          <SectionHead eyebrow="Questions" title="Fair questions." />
          <div style={{ marginTop: 40 }}><FAQ items={faq} /></div>
          <p className="muted" style={{ marginTop: 32 }}>Need a commercial license instead? Write to <a href="mailto:hello@keygate.app" style={{ color: "var(--accent-t)" }}>hello@keygate.app</a></p>
        </div>
      </section>
      <CTABand title="Keep it free. Keep it yours." primary={{ href: "https://ko-fi.com", label: "Sponsor" }} />
    </>
  );
}
