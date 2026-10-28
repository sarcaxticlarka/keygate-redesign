import Link from "next/link";
import { notFound } from "next/navigation";
import DocsShell from "@/components/DocsShell";
import { Blocks } from "@/components/DocBlocks";
import { allDocs, getDoc, ordered } from "@/lib/docs";

export function generateStaticParams() { return allDocs.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDoc((await params).slug);
  return d ? { title: `${d.title} | Keygate Docs`, description: d.lead } : {};
}

export default async function Doc({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDoc(slug);
  if (!d) notFound();
  const i = ordered.findIndex((x) => x.slug === slug);
  const prev = ordered[i - 1], next = ordered[i + 1];
  const toc = d.blocks.flatMap((b) => (b.t === "h" ? [{ id: b.id, label: b.text }] : []));
  return (
    <DocsShell group={d.group} title={d.title} lead={d.lead} minutes={d.minutes} toc={toc}>
      <Blocks blocks={d.blocks} />
      <div className="doc-cards" style={{ marginTop: 56 }}>
        {prev ? <Link href={`/docs/${prev.slug}`} className="doc-card spot"><p className="mono">← Previous</p><b>{prev.title}</b></Link> : <span className="doc-card" />}
        {next ? <Link href={`/docs/${next.slug}`} className="doc-card spot" style={{ textAlign: "right" }}><p className="mono">Next →</p><b>{next.title}</b></Link> : <span className="doc-card" />}
      </div>
      <p className="mono muted" style={{ fontSize: 12, marginTop: 28 }}>Source: README, docs/api-contract.md and docs/openapi.yaml in the Keygate repository.</p>
    </DocsShell>
  );
}
