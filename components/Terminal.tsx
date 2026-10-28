"use client";
import { useEffect, useState } from "react";

type Seg = { t: string; c?: string };
const SCRIPT: Seg[] = [
  { t: "$ ", c: "k" }, { t: "curl -X POST :9000/api/v1/license/verify \\\n    -d " }, { t: "'{\"license_key\":\"KG-LE37…\",\"identifier\":\"device-1\"}'", c: "s" },
  { t: "\n\n→ 200 OK\n", c: "c" },
  { t: "{ " }, { t: "\"status\"", c: "s" }, { t: ": " }, { t: "\"active\"", c: "s" }, { t: ", " }, { t: "\"plan\"", c: "s" }, { t: ": " }, { t: "\"Professional\"", c: "s" }, { t: ",\n  " },
  { t: "\"grace_days\"", c: "s" }, { t: ": " }, { t: "7", c: "n" }, { t: ", " }, { t: "\"token\"", c: "s" }, { t: ": " }, { t: "\"eyJsaWQi…\"", c: "s" }, { t: " }" },
];
const TOTAL = SCRIPT.reduce((n, s) => n + s.t.length, 0);

export default function Terminal() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(TOTAL); return; }
    let i = 0, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setN(i);
      if (i >= TOTAL) { timer = setTimeout(() => { i = 0; setN(0); tick(); }, 3800); return; }
      const ch = SCRIPT.flatMap((s) => s.t.split(""))[i] ?? "";
      timer = setTimeout(tick, ch === "\n" ? 260 : 18 + Math.random() * 26);
    };
    timer = setTimeout(tick, 1900);
    return () => clearTimeout(timer);
  }, []);

  let left = n;
  return (
    <div className="term" aria-label="Example license verification">
      <div className="term-bar"><i /><i /><i /><span>verify · live</span></div>
      <div className="term-body">
        {SCRIPT.map((s, i) => {
          if (left <= 0) return null;
          const part = s.t.slice(0, left);
          left -= s.t.length;
          return <span key={i} className={s.c}>{part}</span>;
        })}
        <span className="caret" />
      </div>
    </div>
  );
}
