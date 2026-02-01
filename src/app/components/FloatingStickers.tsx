import { useRef, useState, useEffect } from "react";
import { useGame, randomStickers } from "../hooks/useGameState";
import { useReducedMotion } from "@n3wth/ui";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Sticker {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  variant: 'default' | 'glowing' | 'pixelated' | 'outlined' | 'gradient';
}

const STICKER_VARIANTS = ['default', 'glowing', 'pixelated', 'outlined', 'gradient'] as const;

export function FloatingStickers() {
  const { gameState } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const stickerIdRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Spawn stickers based on chaos level
  useEffect(() => {
    if (gameState.chaosMeter < 20 || prefersReducedMotion) return;

    // More chaos = faster spawn rate
    const spawnInterval = Math.max(6000 - gameState.chaosMeter * 40, 1500);

    const interval = setInterval(() => {
      const stickerData = randomStickers[Math.floor(Math.random() * randomStickers.length)];
      const variant = STICKER_VARIANTS[Math.floor(Math.random() * STICKER_VARIANTS.length)];

      const newSticker: Sticker = {
        id: stickerIdRef.current++,
        text: stickerData.text,
        color: stickerData.color,
        x: Math.random() * (window.innerWidth - 200) + 50,
        y: Math.random() * (window.innerHeight - 100) + 50,
        rotation: Math.random() * 40 - 20,
        scale: 0.8 + Math.random() * 0.5,
        variant,
      };

      // Keep max stickers based on chaos level
      const maxStickers = Math.min(Math.floor(gameState.chaosMeter / 15) + 3, 10);
      setStickers(prev => [...prev.slice(-maxStickers + 1), newSticker]);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [gameState.chaosMeter, prefersReducedMotion]);

  // Spawn burst of stickers at high chaos thresholds
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (gameState.chaosMeter === 50 || gameState.chaosMeter === 75 || gameState.chaosMeter === 100) {
      // Burst spawn
      const burstCount = Math.floor(gameState.chaosMeter / 25);
      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          const stickerData = randomStickers[Math.floor(Math.random() * randomStickers.length)];
          const variant = STICKER_VARIANTS[Math.floor(Math.random() * STICKER_VARIANTS.length)];

          setStickers(prev => [...prev.slice(-8), {
            id: stickerIdRef.current++,
            text: stickerData.text,
            color: stickerData.color,
            x: Math.random() * (window.innerWidth - 200) + 50,
            y: Math.random() * (window.innerHeight - 100) + 50,
            rotation: Math.random() * 60 - 30,
            scale: 0.9 + Math.random() * 0.6,
            variant,
          }]);
        }, i * 100);
      }
    }
  }, [gameState.chaosMeter, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[90] overflow-hidden"
    >
      {stickers.map(sticker => (
        <StickerElement
          key={sticker.id}
          sticker={sticker}
          onComplete={() => {
            setStickers(prev => prev.filter(s => s.id !== sticker.id));
          }}
        />
      ))}

      {/* Ambient floating shapes at high chaos */}
      {gameState.chaosMeter >= 60 && !prefersReducedMotion && (
        <AmbientShapes chaosLevel={gameState.chaosMeter} />
      )}
    </div>
  );
}

function StickerElement({
  sticker,
  onComplete
}: {
  sticker: Sticker;
  onComplete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!ref.current || prefersReducedMotion) {
      // Still remove after delay if reduced motion
      setTimeout(onComplete, 5000);
      return;
    }

    const tl = gsap.timeline({
      onComplete,
    });

    // Entrance with bounce
    tl.from(ref.current, {
      scale: 0,
      rotation: sticker.rotation - 360,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(2.5)",
    })
    // Float around
    .to(ref.current, {
      y: "random(-40, 40)",
      x: "random(-30, 30)",
      rotation: sticker.rotation + "random(-10, 10)",
      duration: "random(2, 4)",
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    })
    // Exit with spin
    .to(ref.current, {
      scale: 0,
      rotation: sticker.rotation + 180,
      opacity: 0,
      duration: 0.4,
      ease: "back.in(2)",
    });
  }, { scope: ref });

  // Get variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      left: sticker.x,
      top: sticker.y,
      transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
    };

    switch (sticker.variant) {
      case 'glowing':
        return {
          ...baseStyles,
          backgroundColor: sticker.color,
          color: sticker.color === "#dbf226" ? "#000" : "#fff",
          boxShadow: `
            0 0 20px ${sticker.color},
            0 0 40px ${sticker.color}50,
            inset 0 0 10px rgba(255, 255, 255, 0.3)
          `,
          border: `2px solid ${sticker.color}`,
        };

      case 'pixelated':
        return {
          ...baseStyles,
          backgroundColor: sticker.color,
          color: sticker.color === "#dbf226" ? "#000" : "#fff",
          imageRendering: 'pixelated',
          border: '3px solid #000',
          boxShadow: `
            4px 4px 0 #000,
            8px 8px 0 ${sticker.color}50
          `,
        };

      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: sticker.color,
          border: `3px solid ${sticker.color}`,
          boxShadow: `4px 4px 0 ${sticker.color}`,
        };

      case 'gradient':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${sticker.color}, ${sticker.color}80, white)`,
          color: '#000',
          border: '2px solid #000',
          boxShadow: '5px 5px 0 #000',
        };

      default:
        return {
          ...baseStyles,
          backgroundColor: sticker.color,
          color: sticker.color === "#dbf226" ? "#000" : "#fff",
          border: '2px solid #000',
          boxShadow: '4px 4px 0 #000',
        };
    }
  };

  return (
    <div
      ref={ref}
      className="absolute font-gothic text-sm uppercase tracking-wide px-4 py-2 whitespace-nowrap select-none"
      style={getVariantStyles()}
    >
      {/* Inner content with optional effects */}
      <span className="relative z-10">{sticker.text}</span>

      {/* Shine overlay for glowing variant */}
      {sticker.variant === 'glowing' && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
            animation: 'shine 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Corner decorations for pixelated variant */}
      {sticker.variant === 'pixelated' && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-black" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black" />
        </>
      )}
    </div>
  );
}

// Ambient background shapes at high chaos
function AmbientShapes({ chaosLevel }: { chaosLevel: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeCount = Math.floor((chaosLevel - 60) / 10) + 2;

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.utils.toArray<HTMLElement>('.ambient-shape').forEach((shape, i) => {
      gsap.to(shape, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        rotation: "random(-180, 180)",
        scale: "random(0.8, 1.2)",
        duration: "random(8, 15)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
    });
  }, { scope: containerRef });

  const shapes = Array.from({ length: shapeCount }, (_, i) => ({
    id: i,
    type: ['circle', 'square', 'triangle', 'cross'][i % 4],
    color: ['#ff00c3', '#04d9ff', '#dbf226', '#ff5e00', '#7c3aed'][i % 5],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 40,
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {shapes.map(shape => (
        <div
          key={shape.id}
          className="ambient-shape absolute opacity-10"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
        >
          {shape.type === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: shape.size,
                height: shape.size,
                backgroundColor: shape.color,
                boxShadow: `0 0 ${shape.size}px ${shape.color}`,
              }}
            />
          )}
          {shape.type === 'square' && (
            <div
              style={{
                width: shape.size,
                height: shape.size,
                backgroundColor: shape.color,
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {shape.type === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
              }}
            />
          )}
          {shape.type === 'cross' && (
            <div className="relative" style={{ width: shape.size, height: shape.size }}>
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2"
                style={{
                  width: shape.size,
                  height: shape.size / 4,
                  backgroundColor: shape.color,
                }}
              />
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  width: shape.size / 4,
                  height: shape.size,
                  backgroundColor: shape.color,
                }}
              />
            </div>
          )}
        </div>
      ))}

      <style>{`
        @keyframes shine {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
