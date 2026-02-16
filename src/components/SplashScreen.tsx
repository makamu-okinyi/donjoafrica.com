import { useState, useEffect } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"draw" | "glow" | "fade">("draw");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glow"), 1800);
    const t2 = setTimeout(() => setPhase("fade"), 2800);
    const t3 = setTimeout(onComplete, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <svg
        viewBox="0 0 340 80"
        className="w-[70vw] max-w-md"
        aria-label="Donjo"
      >
        <defs>
          <linearGradient id="donjo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="none"
          stroke="url(#donjo-grad)"
          strokeWidth="1.5"
          fontSize="64"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="-2"
          className={`splash-text ${phase}`}
        >
          Donjo
        </text>
      </svg>

      <style>{`
        .splash-text {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
        }
        .splash-text.draw {
          animation: draw-in 1.6s ease-out forwards;
        }
        .splash-text.glow, .splash-text.fade {
          stroke-dashoffset: 0;
          fill: hsl(var(--foreground));
          transition: fill 0.6s ease;
        }
        @keyframes draw-in {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
