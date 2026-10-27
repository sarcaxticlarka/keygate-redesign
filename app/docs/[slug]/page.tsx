import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import { docsGroups, slugify } from "@/lib/data";

const all = docsGroups.flatMap((g) => g.items.map((title) => ({ title, group: g.title, slug: slugify(title) })));
export function generateStaticParams() { return all.map((a) => ({ slug: a.slug })); }

const quick = `curl -O https://raw.githubusercontent.com/tabloy/keygate/main/docker-compose.yml
curl -o .env https://raw.githubusercontent.com/tabloy/keygate/main/.env.example
# Set JWT_SECRET and LICENSE_SIGNING_KEY in .env, then:
docker compose up -d`;
const activate = `curl -X POST http://localhost:9000/api/v1/license/activate \\
  -H 'Content-Type: application/json' \\
  -d '{"license_key":"KG-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX","identifier":"device-1"}'`;

export default async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = all.findIndex((a) => a.slug === slug);
  if (i < 0) notFound();
  const d = all[i], prev = all[i - 1], next = all[i + 1];
  return (
    <>
      <span className="eyebrow">{d.group}</span>
      <h1 className="display" style={{ marginTop: 20 }}>{d.title}</h1>
      {slug === "quick-start" ? (
        <>
          <p style={{ fontSize: 20 }}>Run Keygate on your machine and activate a license key from the command line. One server and one database, no account to create.</p>
          <h2>1. Deploy</h2>
          <p>Postgres and the server come up together.</p>
          <CodeBlock title="terminal" code={quick} />
          <h2>2. Create a product</h2>
          <p>Open <code className="inl">http://localhost:9000</code>. The setup page creates your account, a product and its first plan. Then issue a license from the dashboard.</p>
          <h2>3. Activate a license</h2>
          <p>The same call your app makes. It activates the device and answers with a signed token you can check offline.</p>
          <CodeBlock title="terminal" code={activate} />
        </>
      ) : (
        <p style={{ fontSize: 20 }}>This page is a placeholder in the redesign. The full guide for “{d.title}” lives in the Keygate documentation; this prototype focuses on the UI.</p>
      )}
      <div className="doc-cards" style={{ marginTop: 64 }}>
        {prev ? <Link href={`/docs/${prev.slug}`} className="doc-card"><p className="mono">← Previous</p><b>{prev.title}</b></Link> : <span className="doc-card" />}
        {next ? <Link href={`/docs/${next.slug}`} className="doc-card" style={{ textAlign: "right" }}><p className="mono">Next →</p><b>{next.title}</b></Link> : <span className="doc-card" />}
      </div>
    </>
  );
}
