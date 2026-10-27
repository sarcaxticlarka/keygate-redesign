"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 32, className, style }: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div className={className} style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </motion.div>
  );
}

// Splits text into words that slide up from a mask.
export function SplitWords({ text, className, delay = 0, as: Tag = "span", accentFrom }: { text: string; className?: string; delay?: number; as?: "h1" | "h2" | "span"; accentFrom?: number }) {
  const words = text.split(" ");
  const M = motion[Tag] as typeof motion.span;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} transition={{ staggerChildren: 0.07, delayChildren: delay }}>
      {words.map((w, i) => (
        <span key={i} className="word" style={{ marginRight: "0.22em" }}>
          <motion.span className={accentFrom !== undefined && i >= accentFrom ? "accent" : undefined} variants={{ hidden: { y: "110%" }, show: { y: 0 } } as Variants} transition={{ duration: 0.9, ease }}>{w}</motion.span>
        </span>
      ))}
    </M>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} transition={{ staggerChildren: 0.09 }}>
      {children}
    </motion.div>
  );
}
export const Item = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div className={className} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease }}>{children}</motion.div>
);
