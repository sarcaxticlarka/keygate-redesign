"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((it, i) => (
        <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}><span>{it.q}</span><span className="pm">+</span></button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div className="faq-a" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <p>{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
