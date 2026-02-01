import { useRef, useEffect } from "react";
import gsap from "gsap";

interface FaceProps {
  className?: string;
  mood?: "default" | "happy" | "sassy" | "confused" | "judgy";
}

// Jolene - Southern Mama Bear with big hair and warm smile
export function JoleneFace({ className = "", mood = "default" }: FaceProps) {
  const eyesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Blink animation
    const blink = () => {
      gsap.to(eyesRef.current, {
        scaleY: 0.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        transformOrigin: "center",
      });
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Big Southern Hair */}
      <ellipse cx="50" cy="30" rx="42" ry="28" fill="#8B4513" />
      <ellipse cx="50" cy="35" rx="38" ry="25" fill="#A0522D" />
      <path d="M15 40 Q10 60 20 75" stroke="#8B4513" strokeWidth="8" strokeLinecap="round" />
      <path d="M85 40 Q90 60 80 75" stroke="#8B4513" strokeWidth="8" strokeLinecap="round" />

      {/* Face */}
      <ellipse cx="50" cy="55" rx="30" ry="32" fill="#FCD5B8" />

      {/* Eyes */}
      <g ref={eyesRef}>
        <ellipse cx="38" cy="50" rx="5" ry="6" fill="white" />
        <ellipse cx="62" cy="50" rx="5" ry="6" fill="white" />
        <circle cx="38" cy="51" r="3" fill="#4A3728" />
        <circle cx="62" cy="51" r="3" fill="#4A3728" />
        <circle cx="39" cy="50" r="1" fill="white" />
        <circle cx="63" cy="50" r="1" fill="white" />
      </g>

      {/* Eyebrows */}
      <path d="M32 44 Q38 42 44 44" stroke="#8B4513" strokeWidth="2" fill="none" />
      <path d="M56 44 Q62 42 68 44" stroke="#8B4513" strokeWidth="2" fill="none" />

      {/* Warm Smile */}
      <path d="M35 68 Q50 80 65 68" stroke="#D47878" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="30" cy="62" rx="6" ry="3" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="70" cy="62" rx="6" ry="3" fill="#FFB6C1" opacity="0.5" />

      {/* Earrings */}
      <circle cx="18" cy="55" r="4" fill="#FFD700" />
      <circle cx="82" cy="55" r="4" fill="#FFD700" />
    </svg>
  );
}

// Sally - Chaotic energy, wild eyes, messy bun
export function SallyFace({ className = "", mood = "default" }: FaceProps) {
  const faceRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Chaotic micro-movements
    const shake = () => {
      gsap.to(faceRef.current, {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        duration: 0.05,
      });
    };
    const interval = setInterval(shake, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg ref={faceRef} viewBox="0 0 100 100" className={className} fill="none">
      {/* Messy Bun */}
      <circle cx="50" cy="18" r="18" fill="#FF69B4" />
      <circle cx="42" cy="15" r="8" fill="#FF1493" />
      <circle cx="58" cy="12" r="6" fill="#FF1493" />
      <circle cx="55" cy="20" r="7" fill="#DB7093" />

      {/* Hair wisps */}
      <path d="M30 25 Q25 15 35 10" stroke="#FF69B4" strokeWidth="3" fill="none" />
      <path d="M70 25 Q75 15 65 10" stroke="#FF69B4" strokeWidth="3" fill="none" />

      {/* Face */}
      <ellipse cx="50" cy="55" rx="28" ry="30" fill="#FFE4C4" />

      {/* Wild Eyes - different sizes for chaotic energy */}
      <ellipse cx="36" cy="48" rx="7" ry="8" fill="white" />
      <ellipse cx="64" cy="48" rx="6" ry="7" fill="white" />
      <circle cx="36" cy="49" r="4" fill="#2F4F4F" />
      <circle cx="64" cy="48" r="3.5" fill="#2F4F4F" />
      <circle cx="37" cy="47" r="1.5" fill="white" />
      <circle cx="65" cy="47" r="1.5" fill="white" />

      {/* Raised chaotic eyebrows */}
      <path d="M28 38 Q36 34 44 40" stroke="#FF69B4" strokeWidth="2" fill="none" />
      <path d="M56 40 Q64 34 72 38" stroke="#FF69B4" strokeWidth="2" fill="none" />

      {/* Excited Open Mouth */}
      <ellipse cx="50" cy="70" rx="12" ry="8" fill="#D14D72" />
      <path d="M40 68 Q50 62 60 68" fill="white" />

      {/* Freckles */}
      <circle cx="35" cy="58" r="1" fill="#D2691E" opacity="0.5" />
      <circle cx="40" cy="60" r="1" fill="#D2691E" opacity="0.5" />
      <circle cx="60" cy="60" r="1" fill="#D2691E" opacity="0.5" />
      <circle cx="65" cy="58" r="1" fill="#D2691E" opacity="0.5" />
    </svg>
  );
}

// Viv - Sophisticated, sharp features, wine glass
export function VivFace({ className = "", mood = "default" }: FaceProps) {
  const eyebrowRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Judgy eyebrow raise
    const raise = () => {
      gsap.to(eyebrowRef.current, {
        y: -2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });
    };
    const interval = setInterval(raise, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      {/* Sleek Hair */}
      <path d="M15 50 Q15 20 50 15 Q85 20 85 50 L85 60 Q85 65 80 70 L75 45 L70 70 L50 45 L30 70 L25 45 L20 70 Q15 65 15 60 Z" fill="#1a1a1a" />

      {/* Face - more angular */}
      <path d="M25 45 Q25 35 50 32 Q75 35 75 45 L72 75 Q50 85 28 75 Z" fill="#FCD5B8" />

      {/* Sharp Eyes */}
      <path d="M32 48 L45 46 L45 54 L32 52 Z" fill="white" />
      <path d="M55 46 L68 48 L68 52 L55 54 Z" fill="white" />
      <ellipse cx="40" cy="50" rx="3" ry="3.5" fill="#4B0082" />
      <ellipse cx="60" cy="50" rx="3" ry="3.5" fill="#4B0082" />
      <circle cx="41" cy="49" r="1" fill="white" />
      <circle cx="61" cy="49" r="1" fill="white" />

      {/* Sharp Eyebrows */}
      <path d="M30 44 L46 42" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path ref={eyebrowRef} d="M54 42 L70 44" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />

      {/* Thin Knowing Smirk */}
      <path d="M40 68 Q50 70 62 66" stroke="#8B4557" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Wine Glass */}
      <g transform="translate(75, 60) rotate(15)">
        <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke="#7c3aed" strokeWidth="1" />
        <path d="M0 5 L0 18" stroke="#7c3aed" strokeWidth="1" />
        <path d="M-5 18 L5 18" stroke="#7c3aed" strokeWidth="1" />
        <ellipse cx="0" cy="0" rx="6" ry="3" fill="#722F37" opacity="0.7" />
      </g>
    </svg>
  );
}

// Edward - Sweet confused French boy
export function EdwardFace({ className = "", mood = "default" }: FaceProps) {
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Confused head tilt
    const tilt = () => {
      gsap.to(headRef.current, {
        rotation: Math.random() * 10 - 5,
        duration: 0.5,
        ease: "power2.out",
        transformOrigin: "center bottom",
      });
    };
    const interval = setInterval(tilt, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <g ref={headRef}>
        {/* Fluffy Hair */}
        <ellipse cx="50" cy="28" rx="28" ry="18" fill="#D4A574" />
        <ellipse cx="35" cy="30" rx="12" ry="10" fill="#C4956A" />
        <ellipse cx="65" cy="30" rx="12" ry="10" fill="#C4956A" />
        <path d="M35 22 Q50 15 65 22" stroke="#B8865A" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Face */}
        <ellipse cx="50" cy="55" rx="26" ry="28" fill="#FCD5B8" />

        {/* Big Confused Eyes */}
        <circle cx="38" cy="50" r="8" fill="white" />
        <circle cx="62" cy="50" r="8" fill="white" />
        <circle cx="38" cy="51" r="4" fill="#4169E1" />
        <circle cx="62" cy="51" r="4" fill="#4169E1" />
        <circle cx="39" cy="49" r="1.5" fill="white" />
        <circle cx="63" cy="49" r="1.5" fill="white" />

        {/* Worried Eyebrows */}
        <path d="M30 42 Q38 46 46 44" stroke="#B8865A" strokeWidth="2" fill="none" />
        <path d="M54 44 Q62 46 70 42" stroke="#B8865A" strokeWidth="2" fill="none" />

        {/* Small Confused Mouth */}
        <ellipse cx="50" cy="68" rx="5" ry="4" fill="#D4A5A5" />

        {/* Blush */}
        <ellipse cx="30" cy="60" rx="5" ry="3" fill="#FFB6C1" opacity="0.4" />
        <ellipse cx="70" cy="60" rx="5" ry="3" fill="#FFB6C1" opacity="0.4" />

        {/* Question mark floating */}
        <text x="75" y="30" fill="#04d9ff" fontSize="14" fontWeight="bold" opacity="0.7">?</text>
      </g>
    </svg>
  );
}

// Export a mapping for easy access
export const characterFaces: Record<string, React.FC<FaceProps>> = {
  Jolene: JoleneFace,
  Sally: SallyFace,
  Viv: VivFace,
  Edward: EdwardFace,
};
