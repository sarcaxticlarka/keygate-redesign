"use client";
import { useState } from "react";

export type Mark = "yes" | "no" | "partial";
const sym = { yes: "✓", no: "✕", partial: "~" } as const;
export const M = ({ v }: { v: Mark }) => <span className={`mark ${v}`} aria-label={v}>{sym[v]}</span>;

// Desktop: full table. Mobile: pick a rival, read rows as side-by-side cards.
export default function CompareTable({ columns, rows }: { columns: string[]; rows: { feature: string; v: Mark[] }[] }) {
  const rivals = columns.slice(1);
  const [sel, setSel] = useState(0);
  return (
    <>
      <div className="tbl-wrap only-d">
        <table className="cmp">
          <thead><tr><th>Feature</th>{columns.map((c, i) => <th key={c} className={i === 0 ? "kg" : ""}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature}><td>{r.feature}</td>{r.v.map((v, i) => <td key={i} className={i === 0 ? "kg" : ""}><M v={v} /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="only-m">
        {rivals.length > 1 && (
          <div className="mc-tabs" role="tablist">
            {rivals.map((r, i) => <button key={r} role="tab" aria-pressed={sel === i} onClick={() => setSel(i)}>{r}</button>)}
          </div>
        )}
        <div className="mc-head"><span>Feature</span><span style={{ color: "var(--accent-t)" }}>Keygate</span><span>{rivals[sel]}</span></div>
        <div className="mc-list">
          {rows.map((r) => (
            <div key={r.feature} className="mc-row"><span>{r.feature}</span><span className="kgc"><M v={r.v[0]} /></span><span><M v={r.v[sel + 1]} /></span></div>
          ))}
        </div>
      </div>
    </>
  );
}
