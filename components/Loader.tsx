"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// 7x7 pixel key silhouette
const KEY = [
  "0111000", "1000100", "1000100", "0111000", "0010000", "0011000", "0010000",
].join("");

export default function Loader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("kg-loaded") === "1"; } catch {}
    if (seen) { setShow(false); return; }
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setShow(false); try { sessionStorage.setItem("kg-loaded", "1"); } catch {} }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="loader" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} initial={{ clipPath: "inset(0 0 0% 0)" }}>
          <div className="loader-grid">
            {KEY.split("").map((c, i) => (
              <i key={i} style={{ opacity: c === "1" ? (n > (i / 49) * 100 ? 1 : 0.12) : 0.04, transition: "opacity .2s" }} />
            ))}
          </div>
          <span className="loader-label">Keygate / unlocking</span>
          <span className="loader-count">{String(n).padStart(3, "0")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
