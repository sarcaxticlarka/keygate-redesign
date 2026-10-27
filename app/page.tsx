import Link from "next/link";
import PixelKey from "@/components/PixelKey";
import Marquee from "@/components/Marquee";
import { CopyCmd } from "@/components/CodeBlock";
import { Reveal, SplitWords } from "@/components/Motion";
import { Features, Lifecycle, Steps, MiniCompare } from "@/components/HomeSections";
import { GITHUB } from "@/lib/data";

const ticker = ["Ed25519 signed tokens", "SELECT FOR UPDATE quotas", "Stripe lifecycle", "Floating licenses", "Offline verification", "Webhook idempotency", "Audit logs", "Update feeds for Sparkle, Velopack, Tauri", "AGPL v3"];

export default function Home() {
  return (
    <>
      <section className="sec hero">
        <div className="frame">
          <div className="hero-top">
            <div className="hero-title">
              <h1 className="display">
                <SplitWords as="span" text="License management" delay={1.6} /><br />
                <SplitWords as="span" text="you actually own." delay={1.9} accentFrom={1} />
              </h1>
            </div>
            <div className="hero-side">
              <Reveal delay={2.2}>
                <p>Stop paying per-seat fees to manage your own software licenses. Keygate is an open-source license server you deploy on your infrastructure. Keys, activations, usage metering and payments, all in one place.</p>
              </Reveal>
              <Reveal delay={2.35}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="hero-cta">
                    <Link href="/docs/quick-start" className="btn solid">Deploy Now <span className="arrow">→</span></Link>
                    <a href={GITHUB} className="btn" target="_blank" rel="noreferrer">Star on GitHub ↗</a>
                  </div>
                  <CopyCmd cmd="docker compose up -d" />
                </div>
              </Reveal>
            </div>
          </div>
          <div className="hero-stage">
            <div className="pixel-wrap"><PixelKey /><span className="pixel-tag">fig. 01 — one key, built from nothing</span></div>
            <div className="hero-right">
              <div className="stat-cell lime"><span className="mono" style={{ fontSize: 12, letterSpacing: ".1em" }}>PAID TIERS OF THE SOFTWARE</span><span className="stat-num">0</span></div>
              <div className="stat-cell"><span className="mono muted" style={{ fontSize: 12, letterSpacing: ".1em" }}>FEATURES HELD BACK</span><span className="stat-num">0</span></div>
            </div>
          </div>
        </div>
      </section>
      <Marquee items={ticker} />
      <Features />
      <Lifecycle />
      <Steps />
      <MiniCompare />

      <section className="sec light">
        <div className="frame">
          <div className="pad" style={{ borderBottom: "1px solid var(--line-l)" }}>
            <div className="split">
              <div><span className="eyebrow">What it costs</span><div style={{ marginTop: 20 }}><SplitWords as="h2" className="display" text="Free. Commercially included." /></div></div>
              <Reveal><p className="lead">License the software you sell, or run it for your own customers, and pay nothing. There is no paid tier of the software itself.</p></Reveal>
            </div>
          </div>
          <div className="price">
            <div className="plan dark">
              <span className="eyebrow">Self hosted</span>
              <div className="big">Free</div>
              <p style={{ opacity: .7, maxWidth: 420 }}>The whole thing, under the AGPL v3. Keep the Powered by Keygate line in the interface, publish your changes if you modify it and let others use it, and give a fork its own name and logo.</p>
              <ul><li>Commercial use included, no license or seat count</li><li>Fork and modify, under your own name</li><li>Every feature, nothing held back for a paid edition</li></ul>
            </div>
            <div className="plan">
              <span className="eyebrow">Commercial license</span>
              <div className="big" style={{ fontSize: "clamp(48px,6vw,92px)", lineHeight: 1 }}>By agreement</div>
              <p style={{ opacity: .7, maxWidth: 420 }}>This lifts those two conditions. Everyday commercial use does not need it; white labelling or keeping your changes closed does.</p>
              <ul><li>Take the Powered by Keygate line out</li><li>Keep your changes private while serving others</li><li>Resell Keygate under your own terms</li></ul>
              <a href="mailto:hello@keygate.app" className="btn solid" style={{ width: "fit-content" }}>Ask about a commercial license <span className="arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="frame pad">
          <div className="split">
            <div>
              <span className="eyebrow">Sponsors</span>
              <p className="lead" style={{ marginTop: 20 }}>Keygate is free and self hosted. These people help keep it that way.</p>
              <div className="backers"><span>Troy</span><span>Thomas K.</span></div>
            </div>
            <div style={{ justifySelf: "end" }}><Link href="/sponsorships" className="btn">Become a sponsor <span className="arrow">→</span></Link></div>
          </div>
        </div>
      </section>

      <section className="sec cta">
        <div className="frame pad">
          <span className="eyebrow">Open source license management for any software business</span>
          <h2 className="display" style={{ marginTop: 28 }}><SplitWords as="span" text="Own your" /><br /><SplitWords as="span" text="licensing." delay={0.15} accentFrom={0} /></h2>
          <p className="lead" style={{ margin: "32px 0" }}>Whether you sell desktop apps, SaaS subscriptions, API access or enterprise software, Keygate handles license keys, activations, usage limits and recurring payments in one self-hosted platform.</p>
          <div className="hero-cta">
            <Link href="/docs" className="btn solid">Read the docs <span className="arrow">→</span></Link>
            <a href={GITHUB} className="btn" target="_blank" rel="noreferrer">View source ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
