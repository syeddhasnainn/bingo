import { useEffect, useState } from "react";
import "./index.css";

export function App() {
  const [tiles, setTiles] = useState<number[]>(() => Array.from({ length: 25 }, (_, i) => i + 1));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Gentle, kid-friendly palette per column (B I N G O)
  const columnStyles = [
    {
      letterColor: "text-pink-500",
      tile: "from-pink-200 to-pink-300",
      tileSelected: "from-pink-300 to-pink-400",
      border: "border-pink-300",
      borderSelected: "border-pink-500",
    },
    {
      letterColor: "text-orange-500",
      tile: "from-orange-200 to-orange-300",
      tileSelected: "from-orange-300 to-orange-400",
      border: "border-orange-300",
      borderSelected: "border-orange-500",
    },
    {
      letterColor: "text-amber-500",
      tile: "from-amber-200 to-amber-300",
      tileSelected: "from-amber-300 to-amber-400",
      border: "border-amber-300",
      borderSelected: "border-amber-500",
    },
    {
      letterColor: "text-emerald-500",
      tile: "from-emerald-200 to-emerald-300",
      tileSelected: "from-emerald-300 to-emerald-400",
      border: "border-emerald-300",
      borderSelected: "border-emerald-500",
    },
    {
      letterColor: "text-violet-500",
      tile: "from-violet-200 to-violet-300",
      tileSelected: "from-violet-300 to-violet-400",
      border: "border-violet-300",
      borderSelected: "border-violet-500",
    },
  ] as const;

  function shuffleTiles() {
    setTiles((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    // Reset selections on shuffle so the board restarts
    setSelected(new Set());
    setHasCelebrated(false);
  }

  function toggleTile(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  // Determine completed rows and columns
  const completedRows = Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => r * 5 + c).every((i) => selected.has(i)),
  );
  const completedCols = Array.from({ length: 5 }, (_, c) =>
    Array.from({ length: 5 }, (_, r) => r * 5 + c).every((i) => selected.has(i)),
  );

  const linesCompleted = [...completedRows, ...completedCols].filter(Boolean).length;

  function triggerConfetti() {
    const durationMs = 3800;
    const particleCount = 140;
    const gravity = 0.0009;
    const friction = 0.994;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.4;
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    const pieces: Array<{
      el: HTMLDivElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      spin: number;
      rotation: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("div");
      const size = 6 + Math.random() * 8;
      el.style.position = "absolute";
      el.style.width = `${size}px`;
      el.style.height = `${size * 0.6}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      el.style.borderRadius = Math.random() < 0.3 ? "50%" : "2px";
      el.style.opacity = "1";
      el.style.willChange = "transform, opacity";
      container.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.16;
      const vx = Math.cos(angle) * speed * (0.6 + Math.random() * 0.5);
      const vy = Math.sin(angle) * speed * (0.6 + Math.random() * 0.5) - 0.35;
      const spin = (Math.random() - 0.5) * 0.006;

      pieces.push({ el, x: startX, y: startY, vx, vy, spin, rotation: Math.random() * Math.PI });
    }

    const start = performance.now();
    let last = start;

    function frame(now: number) {
      const elapsed = now - start;
      const dt = Math.min(now - last, 32);
      last = now;

      const life = Math.max(0, 1 - elapsed / durationMs);

      for (const p of pieces) {
        p.vx *= friction;
        p.vy = p.vy * friction + gravity * dt;
        p.x += p.vx * dt * 8;
        p.y += p.vy * dt * 8;
        p.rotation += p.spin * dt * 8;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}rad)`;
        p.el.style.opacity = String(Math.min(1, life + 0.1));
      }

      if (elapsed < durationMs) {
        requestAnimationFrame(frame);
      } else {
        container.remove();
      }
    }

    requestAnimationFrame(frame);
  }

  useEffect(() => {
    if (linesCompleted >= 5 && !hasCelebrated) {
      triggerConfetti();
      setHasCelebrated(true);
    }
  }, [linesCompleted, hasCelebrated]);

  return (
    <div className="p-4 h-dvh max-w-7xl mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-rose-50 to-violet-50 text-slate-800">
      {/* Randomize button at the very top */}
      <div className="w-full max-w-[min(78vmin,38rem)] flex justify-center mb-6">
        <button
          onClick={shuffleTiles}
          className="rounded-lg bg-amber-400 text-amber-950 px-4 py-2 text-sm sm:text-base font-semibold shadow-md transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Randomize
        </button>
      </div>

      {/* BINGO letters above the grid; cut letters sequentially as lines complete */}
      <div className="w-full max-w-[min(78vmin,38rem)] mb-6">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {(() => {
            const letters = "BINGO".split("");
            return letters.map((letter, index) => {
              const isCut = index < Math.min(linesCompleted, letters.length);
              return (
                <div
                  key={letter}
                  className={`text-center font-extrabold text-2xl sm:text-3xl md:text-4xl ${
                    columnStyles[index].letterColor
                  } ${
                    isCut ? "line-through decoration-4 decoration-emerald-400/90" : ""
                  } transition-all duration-300`}
                >
                  {letter}
                </div>
              );
            });
          })()}
        </div>
      </div>
      <div className="">
        {/* Square grid area that fits within viewport without scrolling */}
        <div className="place-self-center mx-auto w-[min(78vmin,38rem)] h-[min(78vmin,38rem)] relative">
          {/* Overlay lines for completed rows/cols */}
          {completedRows.map((done, r) =>
            done ? (
              <div
                key={`row-${r}`}
                className="pointer-events-none absolute left-1 right-1 h-0.5 bg-emerald-400/90 shadow-[0_0_10px_#34d39980]"
                style={{ top: `${(r + 0.5) * 20}%` }}
              />
            ) : null,
          )}
          {completedCols.map((done, c) =>
            done ? (
              <div
                key={`col-${c}`}
                className="pointer-events-none absolute top-1 bottom-1 w-0.5 bg-emerald-400/90 shadow-[0_0_10px_#34d39980]"
                style={{ left: `${(c + 0.5) * 20}%` }}
              />
            ) : null,
          )}

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 h-full">
            {tiles.map((value, index) => {
              const isSelected = selected.has(index);
              const col = index % 5;
              const style = columnStyles[col];
              return (
                <button
                  key={value}
                  onClick={() => toggleTile(index)}
                  className={`group relative aspect-square rounded-xl border bg-gradient-to-br ${
                    isSelected ? style.tileSelected : style.tile
                  } ${
                    isSelected
                      ? `${style.borderSelected} opacity-80`
                      : `${style.border} hover:scale-[1.03] active:scale-[0.98]`
                  } shadow-[0_10px_30px_-12px_rgba(0,0,0,.25)] transition-all duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 select-none cursor-pointer`}
                >
                  <span
                    className={`relative z-10 flex h-full w-full items-center justify-center font-semibold ${
                      isSelected ? "line-through decoration-2 text-slate-600" : "text-slate-900"
                    } text-base sm:text-lg md:text-xl`}
                  >
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
