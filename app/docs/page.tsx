import Link from "next/link";
import { Reveal, SplitWords } from "@/components/Motion";

export const metadata = { title: "Keygate Documentation: Open Source License Management | Keygate" };

export default function Docs() {
  return (
    <>
      <span className="eyebrow">Docs</span>
      <h1 className="display" style={{ marginTop: 20 }}><SplitWords as="span" text="Keygate documentation" delay={0.1} /></h1>
      <Reveal><p style={{ fontSize: 20 }}>An open source, self hosted license server: issue license keys, check them in your app, sell with Stripe and ship updates from your own server.</p></Reveal>
      <p>These pages follow the path most people take: get a server running, decide how you want to sell, add the license check to your app, then connect payments and updates.</p>
      <h2>Start here</h2>
      <div className="doc-cards">
        <Link href="/docs/quick-start" className="doc-card"><b>Quick start</b><p>Run Keygate on your machine and activate a license key from the command line.</p></Link>
        <Link href="/docs/installation" className="doc-card"><b>Installation</b><p>Put it on a real server with HTTPS, backups and a plan for upgrades.</p></Link>
        <Link href="/docs/activating-licenses-in-your-app" className="doc-card"><b>Activating licenses in your app</b><p>The few calls your app makes, and how it keeps working offline.</p></Link>
        <Link href="/docs/selling-with-stripe" className="doc-card"><b>Selling with Stripe</b><p>A customer pays and the license appears. Renewals and refunds follow on their own.</p></Link>
      </div>
      <h2>How it fits together</h2>
      <p>Almost everything in Keygate is built from four things.</p>
      <div className="concepts">
        <div className="concept"><b>Product</b><span>What you sell, such as a desktop app or a web service. Its type (desktop, SaaS or hybrid) decides whether a license is counted by device, by team member or by both.</span></div>
        <div className="concept"><b>Plan</b><span>How you sell the product: a subscription, a perpetual license or a trial. The plan holds the Stripe price, the number of devices and people a license may have and the features it unlocks.</span></div>
        <div className="concept"><b>License</b><span>What a customer owns. Every license has a key like <code className="inl">KG-ABCD2345-EFGH6789-JKLM2345-NPQR6789</code>, with a prefix you can choose per product.</span></div>
        <div className="concept"><b>Activation</b><span>One device or one user on a license. If a license allows three devices, a fourth activation is refused until the customer frees one.</span></div>
      </div>
      <h2>Two APIs</h2>
      <p>The <strong>license API</strong> lives under <code className="inl">/api/v1/license</code> and is what your app talks to. It takes no API key. The license key in the request is the credential.</p>
      <p>The <strong>admin API</strong> lives under <code className="inl">/api/v1/admin</code> and is for your own servers. It takes an API key made in the dashboard and sent as <code className="inl">Authorization: Bearer kg_live_...</code>.</p>
      <h2>Getting help</h2>
      <p>Most setup problems are covered in Troubleshooting. Questions and ideas belong in GitHub Discussions, bugs in the issue tracker.</p>
      <p className="mono muted" style={{ fontSize: 12, marginTop: 40 }}>Last updated October 26, 2026</p>
    </>
  );
}
