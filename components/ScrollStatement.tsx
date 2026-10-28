"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({ w, p, range, hot }: { w: string; p: MotionValue<number>; range: [number, number]; hot: boolean }) {
  const opacity = useTransform(p, range, [0.13, 1]);
  const y = useTransform(p, range, [10, 0]);
  return <motion.span className={`sw-word ${hot ? "hot" : ""}`} style={{ opacity, y }}>{w}</motion.span>;
}

// Words light up one by one as the section scrolls through the viewport.
export default function ScrollStatement({ text, hot = [] }: { text: string; hot?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="statement">
      {words.map((w, i) => (
        <Word key={i} w={w} p={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]} hot={hot.includes(w.replace(/[.,]/g, ""))} />
      ))}
    </p>
  );
}
