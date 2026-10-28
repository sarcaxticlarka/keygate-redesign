import Link from "next/link";
import DocsShell from "@/components/DocsShell";
import DocsSearch from "@/components/DocsSearch";
import { Blocks } from "@/components/DocBlocks";
import { allDocs } from "@/lib/docs";
import { docsGroups, slugify } from "@/lib/data";

export const metadata = { title: "Keygate Documentation: Open Source License Management | Keygate" };

const toc = [
  { id: "numbers", label: "By the numbers" },
  { id: "find", label: "Find a guide" },
  { id: "architecture", label: "Architecture" },
  { id: "how-it-fits", label: "How it fits together" },
  { id: "two-apis", label: "Two APIs" },
  { id: "help", label: "Getting help" },
];

const stats: [string, string][] = [
  ["118", "API operations"],
  ["89", "Endpoint paths"],
  ["21", "Webhook events"],
  ["44", "Database migrations"],
  ["700+", "Go tests"],
  [String(allDocs.length), "Guides here"],
];

export default function Docs() {
  const order = docsGroups.flatMap((g) => g.items.map((t) => slugify(t)));
  const items = order.map((s) => allDocs.find((d) => d.slug === s)!).filter(Boolean).map(({ slug, title, group, lead, minutes }) => ({ slug, title, group, lead, minutes }));
  return (
    <DocsShell group="Docs" title="Keygate documentation" toc={toc} lead="An open source, self hosted license server: issue license keys, check them in your app, sell with Stripe and ship updates from your own server.">
      <p className="big">These pages follow the path most people take: get a server running, decide how you want to sell, add the license check to your app, then connect payments and updates.</p>

      <h2 id="numbers">By the numbers</h2>
      <p>Counted from the repository: the OpenAPI spec (v1.3.0), the migrations folder and the test suite.</p>
      <div className="stat-band">{stats.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>

      <h2 id="find">Find a guide</h2>
      <DocsSearch items={items} />

      <h2 id="architecture">Architecture</h2>
      <p>One Go server and one Postgres database. Everything else is optional and switched on by a variable.</p>
      <div className="arch">
        <div>
          <small>Your software</small>
          <div className="node">Desktop app <em>activate · verify</em></div>
          <div className="node">SaaS backend <em>admin API</em></div>
          <div className="node">Updater <em>feed.xml · json</em></div>
        </div>
        <div className="core"><small>Keygate</small><b>License server</b><small>Go · 9000 · auto-migrate</small></div>
        <div>
          <small>Backing services</small>
          <div className="node">PostgreSQL <em>required</em></div>
          <div className="node">Stripe <em>payments</em></div>
          <div className="node">S3 / R2 / MinIO <em>releases</em></div>
          <div className="node">SMTP · Redis <em>optional</em></div>
        </div>
      </div>

      <h2 id="how-it-fits">How it fits together</h2>
      <p>Almost everything in Keygate is built from four things.</p>
      <div className="concepts">
        <div className="concept"><b>Product</b><span>What you sell, such as a desktop app or a web service. Its type (desktop, SaaS or hybrid) decides whether a license is counted by device, by team member or by both.</span></div>
        <div className="concept"><b>Plan</b><span>How you sell the product: a subscription, a perpetual license or a trial. The plan holds the Stripe price, the number of devices and people a license may have and the features it unlocks.</span></div>
        <div className="concept"><b>License</b><span>What a customer owns. Every license has a key like <code className="inl">KG-ABCD2345-EFGH6789-JKLM2345-NPQR6789</code>, with a prefix you can choose per product.</span></div>
        <div className="concept"><b>Activation</b><span>One device or one user on a license. If a license allows three devices, a fourth activation is refused until the customer frees one.</span></div>
      </div>

      <h2 id="two-apis">Two APIs</h2>
      <p>The <strong>license API</strong> lives under <code className="inl">/api/v1/license</code> and is what your app talks to. It takes no API key. The license key in the request is the credential.</p>
      <p>The <strong>admin API</strong> lives under <code className="inl">/api/v1/admin</code> and is for your own servers. It takes an API key made in the dashboard and sent as <code className="inl">Authorization: Bearer kg_live_...</code>.</p>
      <Blocks blocks={[
        { t: "callout", title: "Why no key in the app", text: "Anything you ship inside an app can be pulled out of it, so the license API never asks for a secret. The license key is the credential, and the signed token lets the app verify offline." },
        { t: "cards", items: [
          { title: "API reference", text: "The envelope, auth, pagination, errors and every endpoint.", href: "/docs/api-reference" },
          { title: "Security", text: "How keys, tokens and webhooks are protected.", href: "/docs/security" },
        ] },
      ]} />

      <h2 id="help">Getting help</h2>
      <p>Most setup problems are covered in <Link href="/docs/troubleshooting" style={{ color: "var(--accent-t)" }}>Troubleshooting</Link>. Questions and ideas belong in GitHub Discussions, bugs in the issue tracker.</p>
      <p className="mono muted" style={{ fontSize: 12, marginTop: 40 }}>Last updated October 26, 2026</p>
    </DocsShell>
  );
}
