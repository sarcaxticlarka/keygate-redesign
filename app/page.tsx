import Link from "next/link";
import PixelKey from "@/components/PixelKey";
import Marquee from "@/components/Marquee";
import Terminal from "@/components/Terminal";
import ScrollStatement from "@/components/ScrollStatement";
import { CopyCmd } from "@/components/CodeBlock";
import { Reveal, SplitWords } from "@/components/Motion";
import { SectionHead, CTABand } from "@/components/Page";
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
              <Reveal delay={2.4}><div className="hero-badges"><span className="badge"><b>■</b> AGPL v3</span><span className="badge">Self hosted</span><span className="badge">Go + Postgres</span></div></Reveal>
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
              <div className="stat-row">
                <div className="stat-cell accent"><span className="stat-cap">Paid tiers of the software</span><span className="stat-num">0</span></div>
                <div className="stat-cell"><span className="stat-cap muted">Features held back</span><span className="stat-num">0</span></div>
              </div>
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <Marquee items={ticker} />

      <section className="sec">
        <div className="frame pad">
          <span className="eyebrow" style={{ marginBottom: 28 }}>The idea</span>
          <ScrollStatement hot={["key", "yours", "server"]} text="Every license is a key. Every key is yours. Issue it, meter it, bill it and revoke it, all from your own server." />
        </div>
      </section>

      <Features />
      <Lifecycle />
      <Steps />
      <MiniCompare />

      <section className="sec alt">
        <div className="frame">
          <div className="pad" style={{ borderBottom: "1px solid var(--line)" }}>
            <SectionHead eyebrow="What it costs" title="Free. Commercially included." lead="License the software you sell, or run it for your own customers, and pay nothing. There is no paid tier of the software itself." />
          </div>
          <div className="price">
            <div className="plan hl spot">
              <span className="eyebrow">Self hosted</span>
              <div className="big">Free</div>
              <p style={{ opacity: 0.8, maxWidth: 420 }}>The whole thing, under the AGPL v3. Keep the Powered by Keygate line in the interface, publish your changes if you modify it and let others use it, and give a fork its own name and logo.</p>
              <ul><li>Commercial use included, no license or seat count</li><li>Fork and modify, under your own name</li><li>Every feature, nothing held back for a paid edition</li></ul>
            </div>
            <div className="plan spot">
              <span className="eyebrow">Commercial license</span>
              <div className="big" style={{ fontSize: "clamp(48px,6vw,92px)", lineHeight: 1 }}>By agreement</div>
              <p className="muted" style={{ maxWidth: 420 }}>This lifts those two conditions. Everyday commercial use does not need it; white labelling or keeping your changes closed does.</p>
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

      <CTABand title="Own your licensing." />
    </>
  );
}
