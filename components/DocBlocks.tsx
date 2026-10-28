import Link from "next/link";
import type { ReactNode } from "react";
import CodeBlock, { CodeTabs } from "./CodeBlock";
import endpoints from "@/lib/endpoints.json";
import type { Block } from "@/lib/docs-types";

// `code` and **bold** inside plain strings
export function Inline({ text }: { text: string }): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="inl">{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

const EVENTS = ["license.created", "license.activated", "license.deactivated", "license.expiry_changed", "license.updates_changed", "license.expired", "license.canceled", "license.suspended", "license.reinstated", "license.revoked", "license.payment_failed", "license.payment_recovered", "license.quantity_changed", "quota.warning", "quota.exceeded", "seat.added", "seat.removed", "plan.changed", "release.published", "release.yanked", "release.unyanked"];

type EP = [string, string, string];
const eps = endpoints.tags as unknown as Record<string, EP[]>;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h":
            return <h2 key={i} id={b.id}><a href={`#${b.id}`} className="anchor" aria-label="Link to section">#</a>{b.text}</h2>;
          case "p":
            return <p key={i}><Inline text={b.text} /></p>;
          case "code":
            return <CodeBlock key={i} title={b.title} code={b.code} />;
          case "tabs":
            return <CodeTabs key={i} items={b.items} />;
          case "callout":
            return <div key={i} className="callout"><b>{b.title}</b><Inline text={b.text} /></div>;
          case "list":
            return <ul key={i} className="doc-list">{b.items.map((it, j) => <li key={j}><span><Inline text={it} /></span></li>)}</ul>;
          case "steps":
            return (
              <ol key={i} className="doc-steps">
                {b.items.map((s, j) => (
                  <li key={j}><span className="num">{String(j + 1).padStart(2, "0")}</span><div><b>{s.title}</b><p><Inline text={s.text} /></p></div></li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="doc-table-wrap">
                <table className="doc-table">
                  <thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>{r.map((c, k) => <td key={k} data-label={b.head[k] || ""}><div className="cell"><Inline text={c} /></div></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "cards":
            return (
              <div key={i} className="doc-cards">
                {b.items.map((c) => <Link key={c.href} href={c.href} className="doc-card spot"><b>{c.title}</b><p>{c.text}</p></Link>)}
              </div>
            );
          case "events":
            return <div key={i} className="event-grid">{EVENTS.map((e) => { const [a, n] = e.split("."); return <span key={e} className="event"><i>{a}.</i>{n}</span>; })}</div>;
          case "endpoints":
            return (
              <div key={i}>
                {b.tags.filter((t) => eps[t]).map((t) => (
                  <div key={t} className="ep-group">
                    <h3>{t} <span>{eps[t].length}</span></h3>
                    {eps[t].map(([m, path, sum]) => (
                      <div key={m + path} className="ep"><span className={`verb ${m.toLowerCase()}`}>{m}</span><code>{path}</code><em>{sum}</em></div>
                    ))}
                  </div>
                ))}
              </div>
            );
        }
      })}
    </>
  );
}
