import { useState, useRef } from "react";

export function RunawayNoButton() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const dodge = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const maxX = Math.max(rect.width / 2 - 20, 80);
    const maxY = 60;
    const x = (Math.random() - 0.5) * maxX * 2;
    const y = (Math.random() - 0.5) * maxY * 2;
    setPos({ x, y });
  };

  return (
    <div ref={containerRef} className="relative inline-flex h-14 w-full max-w-xs items-center justify-center sm:w-56">
      <button
        type="button"
        onMouseOver={dodge}
        onPointerEnter={dodge}
        onFocus={dodge}
        onClick={dodge}
        onTouchStart={(e) => {
          e.preventDefault();
          dodge();
        }}
        className="rounded-full border-2 border-cocoa/30 bg-white/80 px-10 py-4 text-xl font-bold text-cocoa shadow-soft backdrop-blur will-change-transform"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 120ms ease-out",
        }}
      >
        No 😒
      </button>
    </div>
  );
}
