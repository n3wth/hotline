import { useRef, useEffect, useState } from "react";
import { useGame } from "../hooks/useGameState";
import { Badge, useReducedMotion } from "@n3wth/ui";
import { Zap, Flame, Skull, Sparkles, AlertTriangle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CHAOS_LEVELS = [
  { threshold: 0, label: "CALM", icon: Sparkles, color: "#04d9ff", bgGlow: "rgba(4, 217, 255, 0.3)" },
  { threshold: 20, label: "BUILDING", icon: Zap, color: "#dbf226", bgGlow: "rgba(219, 242, 38, 0.3)" },
  { threshold: 40, label: "CHAOTIC", icon: Flame, color: "#ff5e00", bgGlow: "rgba(255, 94, 0, 0.4)" },
  { threshold: 60, label: "UNHINGED", icon: AlertTriangle, color: "#ff00c3", bgGlow: "rgba(255, 0, 195, 0.4)" },
  { threshold: 80, label: "MAXIMUM", icon: Skull, color: "#7c3aed", bgGlow: "rgba(124, 58, 237, 0.5)" },
];

export function ChaosMeter() {
  const { gameState } = useGame();
  const meterRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Get current chaos level data
  const getCurrentLevel = () => {
    for (let i = CHAOS_LEVELS.length - 1; i >= 0; i--) {
      if (gameState.chaosMeter >= CHAOS_LEVELS[i].threshold) {
        return CHAOS_LEVELS[i];
      }
    }
    return CHAOS_LEVELS[0];
  };

  const currentLevel = getCurrentLevel();
  const LevelIcon = currentLevel.icon;

  // Animate fill on chaos change
  useEffect(() => {
    if (!fillRef.current || prefersReducedMotion) return;

    // Animate fill width
    gsap.to(fillRef.current, {
      width: `${gameState.chaosMeter}%`,
      duration: 0.6,
      ease: "power3.out",
    });

    // Pulse effect when chaos increases
    if (gameState.chaosMeter > 0) {
      gsap.to(meterRef.current, {
        scale: 1.08,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });

      // Glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });

      // Spawn particles on chaos increase
      if (particlesRef.current && gameState.chaosMeter > 20) {
        const particles = particlesRef.current.children;
        gsap.fromTo(particles,
          { scale: 0, opacity: 1, y: 0 },
          {
            scale: 1.5,
            opacity: 0,
            y: -30,
            x: "random(-20, 20)",
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }
    }
  }, [gameState.chaosMeter, prefersReducedMotion]);

  // Entrance animation
  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.from(meterRef.current, {
      x: 120,
      opacity: 0,
      duration: 1,
      delay: 2.5,
      ease: "elastic.out(1, 0.5)",
    });

    // Continuous subtle pulse at high chaos
    if (gameState.chaosMeter >= 60) {
      gsap.to(meterRef.current, {
        boxShadow: `0 0 30px ${currentLevel.bgGlow}`,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, { scope: meterRef, dependencies: [gameState.chaosMeter] });

  // Ambient glow animation
  useGSAP(() => {
    if (prefersReducedMotion) return;

    gsap.to(glowRef.current, {
      opacity: 0.5,
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: glowRef });

  return (
    <div
      ref={meterRef}
      className="fixed top-4 right-4 z-[100] cursor-pointer select-none"
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => !prefersReducedMotion && gsap.to(meterRef.current, { scale: 1.05, duration: 0.2 })}
      onMouseLeave={() => !prefersReducedMotion && gsap.to(meterRef.current, { scale: 1, duration: 0.2 })}
    >
      {/* Background glow */}
      <div
        ref={glowRef}
        className="absolute -inset-4 rounded-lg blur-xl pointer-events-none"
        style={{ backgroundColor: currentLevel.bgGlow }}
      />

      {/* Main container */}
      <div
        className="relative bg-black/95 backdrop-blur-md border-2 p-4 transition-all duration-300"
        style={{
          borderColor: currentLevel.color,
          boxShadow: `
            6px 6px 0px ${currentLevel.color},
            0 0 20px ${currentLevel.bgGlow}
          `,
          width: isExpanded ? '220px' : '200px',
        }}
      >
        {/* Corner accents */}
        <div
          className="absolute -top-1 -left-1 w-3 h-3"
          style={{ backgroundColor: currentLevel.color }}
        />
        <div
          className="absolute -bottom-1 -right-1 w-3 h-3"
          style={{ backgroundColor: currentLevel.color }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <LevelIcon
              className="w-4 h-4 animate-pulse"
              style={{ color: currentLevel.color }}
            />
            <span className="font-gothic text-[10px] text-white uppercase tracking-[0.2em]">
              Chaos Level
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[8px] px-2 py-0.5 border font-mono uppercase"
            style={{
              borderColor: currentLevel.color,
              color: currentLevel.color,
            }}
          >
            {currentLevel.label}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-white/5 border border-white/20 overflow-hidden">
          {/* Fill */}
          <div
            ref={fillRef}
            className="h-full relative"
            style={{
              backgroundColor: currentLevel.color,
              width: `${gameState.chaosMeter}%`,
              boxShadow: `0 0 15px ${currentLevel.color}`,
            }}
          >
            {/* Animated stripes inside fill */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 4px,
                  rgba(255, 255, 255, 0.3) 4px,
                  rgba(255, 255, 255, 0.3) 8px
                )`,
                animation: 'slideStripes 1s linear infinite',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div
              className="w-full h-px bg-white/40 absolute"
              style={{ animation: 'scan 2s linear infinite' }}
            />
          </div>

          {/* Percentage marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/50"
            style={{ left: `${gameState.chaosMeter}%` }}
          />
        </div>

        {/* Percentage display */}
        <div className="flex justify-between items-center mt-2">
          <span
            className="font-mono text-lg font-bold"
            style={{ color: currentLevel.color }}
          >
            {gameState.chaosMeter}%
          </span>

          {/* Mini level indicators */}
          <div className="flex gap-1">
            {CHAOS_LEVELS.map((level, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: gameState.chaosMeter >= level.threshold
                    ? level.color
                    : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: gameState.chaosMeter >= level.threshold
                    ? `0 0 8px ${level.color}`
                    : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10">
            {/* Secret count */}
            {gameState.secretsFound.length > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-white/40 font-mono uppercase">Secrets Found</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-xs transition-all duration-300"
                      style={{
                        color: i < gameState.secretsFound.length ? '#dbf226' : 'rgba(255,255,255,0.2)',
                        textShadow: i < gameState.secretsFound.length ? '0 0 8px #dbf226' : 'none',
                      }}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Visit counter */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/40 font-mono uppercase">Session</span>
              <span className="text-[10px] text-white/60 font-mono">
                Visit #{gameState.visitCount}
              </span>
            </div>
          </div>
        )}

        {/* Floating particles container */}
        <div
          ref={particlesRef}
          className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xs"
              style={{ color: currentLevel.color }}
            >
              &#9733;
            </span>
          ))}
        </div>

        {/* Click hint */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-white/20 font-mono whitespace-nowrap">
          {isExpanded ? 'click to collapse' : 'click to expand'}
        </div>
      </div>

      <style>{`
        @keyframes slideStripes {
          0% { background-position: 0 0; }
          100% { background-position: 16px 0; }
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
