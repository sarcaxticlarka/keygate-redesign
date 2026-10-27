"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CodeBlock from "./CodeBlock";
import { Reveal, SplitWords } from "./Motion";
import { matrix } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

const verify = `<span class="k">POST</span> /api/v1/license/verify
{
  <span class="s">"license_key"</span>: <span class="s">"KG-LE376JPT-MJHHUNGZ-UCZJFD47-6E8RA6AL"</span>,
  <span class="s">"identifier"</span>: <span class="s">"device-abc-123"</span>
}

<span class="c">→ 200 OK</span>
{ <span class="s">"status"</span>: <span class="s">"active"</span>, <span class="s">"plan_name"</span>: <span class="s">"Professional"</span>,
  <span class="s">"grace_days"</span>: <span class="n">7</span>, <span class="s">"token"</span>: <span class="s">"eyJsaWQiOiI1YTA4..."</span> }`;
const verifyRaw = `curl -X POST /api/v1/license/verify -d '{"license_key":"KG-...","identifier":"device-abc-123"}'`;

const usage = `<span class="k">POST</span> /api/v1/license/usage
{ <span class="s">"feature"</span>: <span class="s">"api_calls"</span>, <span class="s">"quantity"</span>: <span class="n">1</span> }

<span class="c">→ 200 OK</span>
{ <span class="s">"accepted"</span>: <span class="k">true</span>, <span class="s">"used"</span>: <span class="n">9847</span>, <span class="s">"limit"</span>: <span class="n">10000</span>,
  <span class="s">"remaining"</span>: <span class="n">153</span>, <span class="s">"period"</span>: <span class="s">"monthly"</span> }`;

export function Features() {
  return (
    <section id="features" className="sec light">
      <div className="frame feat">
        <div className="feat-left">
          <div className="feat-sticky">
            <span className="eyebrow">Built for real licensing workflows</span>
            <SplitWords as="h2" className="display" text="Not a toy project." />
            <Reveal><p className="lead">Keygate handles the edge cases that break homegrown solutions: concurrent activations, atomic quota enforcement, webhook idempotency and payment lifecycle management.</p></Reveal>
            <Reveal delay={0.1}><Link href="/docs" className="btn solid">Read the docs <span className="arrow">→</span></Link></Reveal>
          </div>
        </div>
        <div className="feat-right">
          <article className="card">
            <div className="card-head"><span className="card-tag">LICENSING</span><span className="card-idx">01 / 04</span></div>
            <h3>Every model, one API</h3>
            <p>Subscription, perpetual or trial, node locked or floating. Activation limits per device or user, grace periods, and Ed25519 signed tokens your app verifies offline, so a copy of your binary cannot mint its own.</p>
            <div className="chips"><span className="chip">3 license types + floating</span><span className="chip">Device & user limits</span><span className="chip">Ed25519 offline</span></div>
            <CodeBlock title="verify" code={verifyRaw} html={verify} />
          </article>
          <article className="card">
            <div className="card-head"><span className="card-tag">METERING</span><span className="card-idx">02 / 04</span></div>
            <h3>Atomic usage tracking</h3>
            <p>Track API calls, storage, bandwidth, or define your own metrics. Quotas are enforced atomically with <code className="mono">SELECT FOR UPDATE</code>, so two concurrent requests never both pass a limit check.</p>
            <Meter />
            <div className="chips"><span className="chip">Custom metrics</span><span className="chip">Race-condition-proof</span><span className="chip">Auto-reset periods</span></div>
            <CodeBlock title="usage" code="POST /api/v1/license/usage" html={usage} />
          </article>
          <article className="card">
            <div className="card-head"><span className="card-tag">PAYMENTS</span><span className="card-idx">03 / 04</span></div>
            <h3>Stripe, end to end</h3>
            <p>Customer pays, license auto-provisions. Payment fails, dunning emails fire. Checkout, plan changes with proration, cancellations, refunds and the billing portal, wired once and then self-running.</p>
            <div className="chips"><span className="chip">Auto-provisioning</span><span className="chip">Dunning & lifecycle</span><span className="chip">Upgrade / downgrade</span></div>
          </article>
          <article className="card">
            <div className="card-head"><span className="card-tag">ADMIN</span><span className="card-idx">04 / 04</span></div>
            <h3>One dashboard for everything</h3>
            <p>Products, plans, customers, licenses, API keys, webhooks, analytics, audit logs, teams and email templates, managed from a single panel with search, filters and CSV/JSON export.</p>
            <Dash />
          </article>
        </div>
      </div>
    </section>
  );
}

function Meter() {
  return (
    <div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}><span>api_calls · monthly</span><span>9,847 / 10,000</span></div>
      <div className="meter"><motion.i initial={{ width: 0 }} whileInView={{ width: "98.47%" }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} /></div>
    </div>
  );
}

function Dash() {
  const rows = [
    ["KG-LE37…8RA6AL", "Professional", "active", ""],
    ["KG-9QH2…TT41ZP", "Starter", "trial", "warn"],
    ["KG-4MC8…W0AA7R", "Enterprise", "active", ""],
    ["KG-X2PB…J99KDE", "Professional", "revoked", "off"],
  ];
  return (
    <div className="dash-mock">
      <div className="row"><span>Key</span><span>Plan</span><span>Status</span><span /></div>
      {rows.map((r, i) => (
        <motion.div key={i} className="row" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6, ease }}>
          <span>{r[0]}</span><span>{r[1]}</span><span><i className={`dot ${r[3]}`} />{r[2]}</span><span>⋯</span>
        </motion.div>
      ))}
    </div>
  );
}

const lifecycle = [
  ["checkout.session.completed", "Create license + subscription"],
  ["invoice.payment_failed", "Start dunning sequence"],
  ["customer.subscription.deleted", "Mark license canceled"],
  ["charge.refunded", "Revoke license on a full refund"],
];

export function Lifecycle() {
  return (
    <section className="sec">
      <div className="frame pad" style={{ paddingBottom: 0 }}>
        <div className="split">
          <div><span className="eyebrow">Stripe lifecycle</span><div style={{ marginTop: 20 }}><SplitWords as="h2" className="display" text="Webhooks you never write." /></div></div>
          <Reveal><p className="lead">Four events cover the whole payment lifecycle. Keygate handles each one and keeps your licenses in step with what customers actually paid for.</p></Reveal>
        </div>
      </div>
      <div className="frame" style={{ borderTop: 0 }}>
        <div className="life-grid" style={{ margin: 0, marginTop: 64 }}>
          {lifecycle.map(([evt, doit], i) => (
            <motion.div key={i} className="life-cell" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.12, ease }}>
                <motion.span className="life-line" initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.1, delay: i * 0.25, ease }} />
                <span className="life-num">{i + 1}</span>
                <div><div className="life-evt">{evt}</div><div className="life-do" style={{ marginTop: 10 }}>→ {doit}</div></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stepData = [
  { t: "Deploy", d: "Postgres and the server come up together, ready for the next step.", title: "terminal", code: "curl -O https://raw.githubusercontent.com/tabloy/keygate/main/docker-compose.yml\ncurl -o .env https://raw.githubusercontent.com/tabloy/keygate/main/.env.example\n# Set JWT_SECRET and LICENSE_SIGNING_KEY in .env, then:\ndocker compose up -d" },
  { t: "Create a product", d: "The setup page creates your account, a product and a plan in a minute. Then issue your first license from the dashboard.", title: "terminal", code: "# The setup page creates your account, a product\n# and its first plan. Then issue a license.\nopen http://localhost:9000" },
  { t: "Activate a license", d: "The same call your app makes. It activates the device and answers with a signed token you can check offline.", title: "terminal", code: `curl -X POST http://localhost:9000/api/v1/license/activate \\\n  -H 'Content-Type: application/json' \\\n  -d '{"license_key":"KG-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX","identifier":"device-1"}'` },
];

export function Steps() {
  const [i, setI] = useState(0);
  const s = stepData[i];
  return (
    <section className="sec light">
      <div className="frame">
        <div className="pad" style={{ borderBottom: "1px solid var(--line-l)" }}>
          <div className="split">
            <div><span className="eyebrow">Quick start</span><div style={{ marginTop: 20 }}><SplitWords as="h2" className="display" text="Running in three steps." /></div></div>
            <Reveal><p className="lead">One server and one database. No account, no API key, nothing to sign up for.</p></Reveal>
          </div>
        </div>
        <div className="steps">
          <div className="steps-tabs">
            {stepData.map((x, n) => (
              <button key={n} className={`step-tab ${n === i ? "on" : ""}`} onClick={() => setI(n)} onMouseEnter={() => setI(n)}>
                <span className="n">0{n + 1}</span><span className="t">{x.t}</span>
              </button>
            ))}
          </div>
          <motion.div key={i} className="step-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p>{s.d}</p>
            <CodeBlock title={s.title} code={s.code} />
            <Link href="/docs/quick-start" className="btn" style={{ width: "fit-content" }}>Read the full quick start <span className="arrow">→</span></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function MiniCompare() {
  const cols = ["Keygate", "Keygen", "Cryptlex", "LicenseSpring"];
  const sym = { yes: "✓", no: "✕", partial: "~" } as const;
  return (
    <section className="sec">
      <div className="frame pad" style={{ paddingBottom: 0 }}>
        <div className="split">
          <div><span className="eyebrow">How Keygate compares</span><div style={{ marginTop: 20 }}><SplitWords as="h2" className="display" text="Honest side by side." /></div></div>
          <Reveal><p className="lead">Checked against each vendor's own documentation and pricing in October 2026. Spot something out of date? Open an issue on GitHub.</p></Reveal>
        </div>
        <Reveal>
          <div className="tbl-wrap">
            <table className="cmp">
              <thead><tr><th>Feature</th>{cols.map((c, i) => <th key={c} className={i === 0 ? "kg" : ""}>{c}</th>)}</tr></thead>
              <tbody>
                {matrix.map((r) => (
                  <tr key={r.feature}><td>{r.feature}</td>{r.v.map((v, i) => <td key={i} className={i === 0 ? "kg" : ""}><span className={`mark ${v}`}>{sym[v]}</span></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
      <div className="frame" style={{ borderTop: 0 }}>
        <div className="pad" style={{ paddingTop: 40, paddingBottom: 56 }}>
          <Link href="/compare" className="btn">See the full comparisons <span className="arrow">→</span></Link>
        </div>
      </div>
    </section>
  );
}
