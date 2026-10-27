"use client";
import { useEffect, useRef } from "react";

// Pixels fall from above and lock into a key silhouette. The cursor lights nearby cells.
const MAP = [
  "..........................",
  "......#########...........",
  "....#############.........",
  "...####.......####........",
  "..####.........####.......",
  "..###...........###.......",
  "..###...........###.......",
  "..####.........####.......",
  "...####.......####........",
  "....#############.........",
  "......#########...........",
  ".........####.............",
  ".........####.............",
  ".........########.........",
  ".........####.............",
  ".........####.............",
  ".........########.........",
  ".........####.............",
  ".........####.............",
  "..........................",
];

export default function PixelKey() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = MAP.length, cols = MAP[0].length;
    type Cell = { c: number; r: number; y: number; vy: number; delay: number; done: boolean; glow: number };
    const cells: Cell[] = [];
    MAP.forEach((line, r) => line.split("").forEach((ch, c) => {
      if (ch === "#") cells.push({ c, r, y: reduce ? 0 : -(300 + Math.random() * 500), vy: 0, delay: (rows - r) * 3 + Math.random() * 14, done: reduce, glow: 0 });
    }));
    let w = 0, h = 0, size = 0, ox = 0, oy = 0, dpr = 1, frame = 0, raf = 0;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const b = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = b.width; h = b.height;
      cv.width = w * dpr; cv.height = h * dpr;
      size = Math.floor(Math.min(w / (cols + 2), h / (rows + 2)));
      ox = (w - cols * size) / 2; oy = (h - rows * size) / 2;
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    const move = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; };
    const leave = () => { mouse.x = mouse.y = -999; };
    cv.addEventListener("pointermove", move); cv.addEventListener("pointerleave", leave);

    const draw = () => {
      frame++;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // faint background grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(ox + c * size + .5, 0); ctx.lineTo(ox + c * size + .5, h); ctx.stroke(); }
      for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0, oy + r * size + .5); ctx.lineTo(w, oy + r * size + .5); ctx.stroke(); }

      for (const k of cells) {
        if (!k.done && frame > k.delay) {
          k.vy += 1.1; k.y += k.vy;
          if (k.y >= 0) { k.y = 0; k.vy = 0; k.done = true; k.glow = 1; }
        }
        const x = ox + k.c * size, y = oy + k.r * size + k.y;
        const dx = x + size / 2 - mouse.x, dy = y + size / 2 - mouse.y;
        const near = Math.max(0, 1 - Math.hypot(dx, dy) / (size * 4));
        k.glow = Math.max(k.glow * 0.94, near);
        const g = k.glow;
        ctx.fillStyle = g > 0.02 ? `rgba(${Math.round(238 - g * 28)},${Math.round(235 + g * 20)},${Math.round(221 - g * 158)},1)` : "#eeebdd";
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerleave", leave); };
  }, []);

  return <canvas ref={ref} aria-label="Pixel key assembling" />;
}
