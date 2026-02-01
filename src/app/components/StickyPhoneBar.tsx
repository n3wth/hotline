import { useRef, useState, useEffect } from "react";
import { Phone, Zap } from "lucide-react";
import { useReducedMotion } from "@n3wth/ui";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useGame } from "../hooks/useGameState";

export function StickyPhoneBar() {
  const phoneNumber = "+1 (415) 360-0751";
  const barRef = useRef<HTMLDivElement>(null);
  const { addChaos, gameState } = useGame();
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useGSAP(() => {
    if (!barRef.current || prefersReducedMotion) return;

    gsap.from(barRef.current, {
      y: -60,
      opacity: 0,
      duration: 0.8,
      delay: 3,
      ease: "back.out(1.5)",
    });

    // Continuous subtle pulse on phone icon
    gsap.to(".phone-pulse", {
      scale: 1.2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, { scope: barRef });

  // Color based on chaos level
  const getBarStyle = () => {
    if (gameState.chaosMeter >= 80) {
      return {
        background: "linear-gradient(90deg, #7c3aed, #ff00c3, #7c3aed)",
        borderColor: "#7c3aed",
      };
    } else if (gameState.chaosMeter >= 60) {
      return {
        background: "linear-gradient(90deg, #ff00c3, #ff5e00, #ff00c3)",
        borderColor: "#ff00c3",
      };
    } else if (gameState.chaosMeter >= 40) {
      return {
        background: "linear-gradient(90deg, #ff5e00, #dbf226, #ff5e00)",
        borderColor: "#ff5e00",
      };
    }
    return {
      background: "linear-gradient(90deg, #dbf226, #04d9ff, #dbf226)",
      borderColor: "#dbf226",
    };
  };

  const barStyle = getBarStyle();

  return (
    <div
      ref={barRef}
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
        scrolled ? "py-2" : "py-3"
      }`}
      style={{
        background: scrolled ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: `2px solid ${barStyle.borderColor}`,
        boxShadow: scrolled
          ? `0 4px 30px ${barStyle.borderColor}40`
          : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-current"
            style={{ color: barStyle.borderColor }}
          >
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-gothic text-sm uppercase tracking-widest text-white/80 hidden sm:block">
            Hotline
          </span>
        </div>

        {/* Phone Number - ALWAYS VISIBLE */}
        <a
          href={`tel:${phoneNumber}`}
          onClick={() => addChaos(15)}
          onMouseEnter={() => {
            setIsHovered(true);
            if (!prefersReducedMotion) {
              gsap.to(".phone-bar-text", {
                scale: 1.05,
                duration: 0.2,
                ease: "back.out(2)",
              });
            }
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            if (!prefersReducedMotion) {
              gsap.to(".phone-bar-text", {
                scale: 1,
                duration: 0.2,
              });
            }
          }}
          className="group relative flex items-center gap-3 px-5 py-2 rounded-full transition-all duration-300 cursor-pointer"
          style={{
            background: isHovered ? barStyle.background : "transparent",
            backgroundSize: "200% auto",
          }}
        >
          {/* Pulsing ring behind */}
          <div
            className="phone-pulse absolute inset-0 rounded-full opacity-30 pointer-events-none"
            style={{
              background: barStyle.background,
              backgroundSize: "200% auto",
              filter: "blur(8px)",
            }}
          />

          {/* Phone Icon */}
          <div
            className="relative z-10 p-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "rgba(0,0,0,0.3)" : barStyle.borderColor,
              color: isHovered ? "white" : "black",
            }}
          >
            <Phone className="w-4 h-4" />
          </div>

          {/* Phone Number Text */}
          <span
            className="phone-bar-text relative z-10 font-mono text-base md:text-lg font-bold tracking-wide transition-all duration-300"
            style={{
              color: isHovered ? "white" : barStyle.borderColor,
              textShadow: isHovered ? "0 0 20px currentColor" : "none",
            }}
          >
            {phoneNumber}
          </span>

          {/* Call Now Badge */}
          <span
            className={`relative z-10 px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-all duration-300 ${
              isHovered
                ? "bg-white text-black"
                : "bg-transparent border border-current"
            }`}
            style={{ color: isHovered ? "black" : barStyle.borderColor }}
          >
            Call Now
          </span>
        </a>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: barStyle.borderColor }}
          />
          <span className="text-[10px] font-mono text-white/50 uppercase hidden sm:block">
            24/7 Live
          </span>
        </div>
      </div>

      {/* Animated gradient line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 animate-gradient-x"
        style={{
          background: barStyle.background,
          backgroundSize: "200% auto",
        }}
      />
    </div>
  );
}
