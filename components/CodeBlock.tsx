"use client";
import { useState } from "react";

export default function CodeBlock({ title, code, html }: { title: string; code: string; html?: string }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setOk(true); setTimeout(() => setOk(false), 1400); } catch {}
  };
  return (
    <div className="codebox">
      <div className="code-bar"><span>{title}</span><button className="copy" onClick={copy}>{ok ? "Copied ✓" : "Copy"}</button></div>
      {html ? <div className="code" dangerouslySetInnerHTML={{ __html: html }} /> : <div className="code">{code}</div>}
    </div>
  );
}

export function CopyCmd({ cmd }: { cmd: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="cmd" onClick={async () => { try { await navigator.clipboard.writeText(cmd); setOk(true); setTimeout(() => setOk(false), 1400); } catch {} }}>
      <span><span className="prompt">$</span> {cmd}</span>
      <small>{ok ? "copied ✓" : "copy"}</small>
    </button>
  );
}
