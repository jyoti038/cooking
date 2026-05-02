import { useEffect, useMemo, useState } from "react";

export function Sparkles({ count = 10 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onR = () => setReduced(mq.matches);
    mq.addEventListener("change", onR);
    return () => mq.removeEventListener("change", onR);
  }, []);

  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 7,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 2.5,
      })),
    [count],
  );

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {items.map((s) => (
        <span
          key={s.id}
          className="absolute animate-sparkle rounded-full bg-white shadow-glow will-change-transform"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
