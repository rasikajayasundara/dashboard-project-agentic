import { useEffect, useRef } from "react";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function colorWithAlpha(base, alpha) {
  if (base.startsWith("rgba")) {
    return base.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${alpha})`);
  }
  if (base.startsWith("rgb(")) {
    const inner = base.match(/rgb\(([^)]+)\)/)?.[1] || "30, 100, 210";
    return `rgba(${inner}, ${alpha})`;
  }
  return base;
}

export default function BackgroundBubbles({ color = "rgba(23, 49, 87, 0.12)", maxBubbles = 24 }) {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const bubblesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      const dpr    = Math.max(1, window.devicePixelRatio || 1);
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnBubbles = () => {
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const count = Math.min(maxBubbles, Math.max(12, Math.floor((w * h) / 45000)));
      const arr = [];
      for (let i = 0; i < count; i++) {
        const baseR = rand(18, 80);
        arr.push({
          x: rand(0, w), y: rand(0, h),
          r: baseR,
          a: rand(0.04, 0.11),
          vx: rand(-0.06, 0.06),
          vy: rand(-0.03, 0.03),
          pulse: rand(0.004, 0.001),
          t: Math.random() * Math.PI * 2,
        });
      }
      bubblesRef.current = arr;
    };

    const step = () => {
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const b of bubblesRef.current) {
        b.t += b.pulse;
        const scale = 1 + Math.sin(b.t) * 0.12;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * scale, 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha(color, b.a);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const onResize = () => { setSize(); spawnBubbles(); };

    setSize();
    spawnBubbles();
    rafRef.current = requestAnimationFrame(step);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, maxBubbles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
