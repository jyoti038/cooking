import { useEffect, useMemo, useState } from "react";

const EMOJIS = ["💕", "💖", "🌸", "✨", "🤍", "💗"];

export function FloatingHearts({ count }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 640px)");
    setReduced(mq.matches);
    setIsMobile(mqMobile.matches);
    const onR = () => setReduced(mq.matches);
    const onM = () => setIsMobile(mqMobile.matches);
    mq.addEventListener("change", onR);
    mqMobile.addEventListener("change", onM);
    return () => {
      mq.removeEventListener("change", onR);
      mqMobile.removeEventListener("change", onM);
    };
  }, []);

  // Lower counts dramatically — fewer animated nodes = less paint cost.
  const finalCount = count ?? (isMobile ? 5 : 10);

  const items = useMemo(
    () =>
      Array.from({ length: finalCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        duration: 14 + Math.random() * 10,
        size: 16 + Math.random() * 22,
        drift: (Math.random() - 0.5) * 160,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [finalCount],
  );

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute animate-float-up select-none will-change-transform"
          style={{
            left: `${it.left}%`,
            top: 0,
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
            ["--drift" as string]: `${it.drift}px`,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
