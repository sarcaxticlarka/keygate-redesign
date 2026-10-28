"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

let lenisRef: Lenis | null = null;

// Jump (no animation) to the top, or to the #hash target when the URL has one.
// Lenis keeps its own scroll position, so a bare window.scrollTo() is overwritten
// on the next frame and the new page opens wherever the old one was scrolled to.
function jump() {
  const hash = window.location.hash.slice(1);
  const el = hash ? document.getElementById(decodeURIComponent(hash)) : null;
  const opts = { immediate: true, force: true } as const;
  if (lenisRef) {
    if (el) lenisRef.scrollTo(el, { ...opts, offset: -80 });
    else lenisRef.scrollTo(0, opts);
  } else if (el) el.scrollIntoView();
  else window.scrollTo(0, 0);
}

export default function Smooth() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef = null; };
  }, []);

  // in-page anchors (docs "On this page") glide instead of jumping
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", a.hash);
      if (lenisRef) lenisRef.scrollTo(el, { offset: -80, duration: 1.1 });
      else el.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  // pointer spotlight: any element with .spot gets --mx/--my
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".spot") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);

  // every route change starts at the top (or at its #hash)
  useEffect(() => {
    jump();
    const t = setTimeout(jump, 60); // once more after the new page has laid out
    return () => clearTimeout(t);
  }, [pathname]);

  return <motion.div className="progress" style={{ scaleX }} />;
}
