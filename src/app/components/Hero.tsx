import { useRef, useState, useEffect } from "react";
import { Phone, Zap, Skull, Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGame } from "../hooks/useGameState";
import { useReducedMotion } from "@n3wth/ui";

gsap.registerPlugin(ScrollTrigger);

// Floating chaos particles
const ChaosParticle = ({ delay, color }: { delay: number; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      },
      {
        y: -100,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: `+=${Math.random() * 720 - 360}`,
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: -1,
        ease: "none",
      }
    );
  }, { scope: ref });

  const icons = [Zap, Skull, Heart, Star];
  const Icon = icons[Math.floor(Math.random() * icons.length)];

  return (
    <div ref={ref} className="absolute pointer-events-none opacity-20" style={{ color }}>
      <Icon className="w-6 h-6" />
    </div>
  );
};

export function Hero() {
  const phoneNumber = "+1 (855) 580-0508";
  const containerRef = useRef<HTMLDivElement>(null);
  const { addChaos } = useGame();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  // Track mouse for parallax effects
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  useGSAP(() => {
    if (prefersReducedMotion) return;
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" }
    });

    // Set initial states for ALL animated elements
    gsap.set(".hero-title-line-1", { y: 100, opacity: 0, rotationX: -90 });
    gsap.set(".hero-title-line-2", { y: -80, opacity: 0, scale: 0.85, rotationX: 90 });
    gsap.set(".hero-underline", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".hero-subtitle", { y: 40, opacity: 0, filter: "blur(10px)" });
    gsap.set(".hero-sticker", { scale: 0, rotation: -45, opacity: 0 });
    gsap.set(".hero-tape", { scaleX: 0, opacity: 0 });
    gsap.set(".hero-button", { scale: 0, rotation: -10 });
    gsap.set(".hero-starburst", { scale: 0, opacity: 0, rotation: -180 });
    gsap.set(".hero-button-zone", { opacity: 0, y: 50 });
    gsap.set(".hero-scribble", { x: 30, opacity: 0 });
    gsap.set(".hero-marquee", { y: 100, opacity: 0 });
    gsap.set(".hero-orb", { scale: 0, opacity: 0 });
    gsap.set(".hero-ring", { scale: 0.5, opacity: 0 });
    gsap.set(".hero-diagonal", { scaleX: 0 });

    // Epic entrance sequence
    tl.to(".hero-bg-grid", {
      opacity: 0.4,
      duration: 1.2,
      ease: "power2.out"
    })
    .to(".hero-orb", {
      scale: 1,
      opacity: 1,
      duration: 2,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=1")
    .to(".hero-ring", {
      scale: 1,
      opacity: 0.3,
      duration: 1.5,
      stagger: 0.3,
      ease: "elastic.out(1, 0.5)"
    }, "-=1.5")
    .to(".hero-diagonal", {
      scaleX: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.inOut"
    }, "-=1")
    .to(".hero-title-line-1", {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 1.4,
      ease: "power3.out"
    }, "-=0.5")
    .to(".hero-title-line-2", {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationX: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.6")
    .to(".hero-underline", {
      scaleX: 1,
      duration: 0.8,
      ease: "power4.inOut"
    }, "-=0.6")
    .to(".hero-subtitle", {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "back.out(1.2)"
    }, "-=0.4")
    .to(".hero-sticker", {
      scale: 1,
      rotation: -12,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(2)"
    }, "-=0.6")
    .to(".hero-tape", {
      scaleX: 1,
      opacity: 0.75,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.5")
    .to(".hero-button-zone", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.5)"
    }, "-=0.3")
    .to(".hero-button", {
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "elastic.out(1, 0.4)"
    }, "<")
    .to(".hero-starburst", {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1,
      ease: "power2.out"
    }, "<")
    .to(".hero-scribble", {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.5")
    .to(".hero-marquee", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    // Parallax on scroll
    gsap.to(".hero-title-container", {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5
      }
    });

    gsap.to(".hero-sticker", {
      y: 200,
      rotation: 25,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 2
      }
    });

    // Phone number stays always visible - no fading on scroll

    // Floating orbs animation
    gsap.to(".hero-orb-1", {
      x: 50,
      y: -30,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".hero-orb-2", {
      x: -40,
      y: 40,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".hero-orb-3", {
      x: 30,
      y: 50,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Infinite animations
    gsap.to(".hero-starburst", {
      rotation: "+=360",
      duration: 30,
      repeat: -1,
      ease: "none"
    });

    gsap.to(".hero-ring", {
      rotation: "+=360",
      duration: 20,
      repeat: -1,
      ease: "none",
      stagger: { each: 5, from: "start" }
    });

    gsap.to(".hero-button", {
      boxShadow: "18px 18px 0px #ff00c3, 0 0 60px rgba(255, 0, 195, 0.3)",
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Subtle glitch on title
    const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    glitchTl.to(".hero-title-line-2", {
      x: -4,
      skewX: 3,
      filter: "hue-rotate(90deg)",
      duration: 0.08,
      ease: "none"
    })
    .to(".hero-title-line-2", {
      x: 4,
      skewX: -3,
      filter: "hue-rotate(-90deg)",
      duration: 0.08,
      ease: "none"
    })
    .to(".hero-title-line-2", {
      x: 0,
      skewX: 0,
      filter: "hue-rotate(0deg)",
      duration: 0.08,
      ease: "none"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="hero-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] pt-16">

      {/* Chaos Particles - floating icons */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <ChaosParticle
              key={i}
              delay={i * 0.8}
              color={["#dbf226", "#ff00c3", "#04d9ff", "#ff5e00"][i % 4]}
            />
          ))}
        </div>
      )}

      {/* Dynamic Background Grid - more intense */}
      <div className="hero-bg-grid absolute inset-0 opacity-0 pointer-events-none"
           style={{
             backgroundImage: `
               radial-gradient(circle at 50% 50%, #dbf226 1px, transparent 1px),
               radial-gradient(circle at 25% 25%, #ff00c3 0.5px, transparent 0.5px),
               linear-gradient(#1a1a1a 1px, transparent 1px),
               linear-gradient(90deg, #1a1a1a 1px, transparent 1px)
             `,
             backgroundSize: '60px 60px, 40px 40px, 30px 30px, 30px 30px'
           }} />

      {/* Animated Gradient Orbs - MASSIVE and more vibrant */}
      <div className="hero-orb hero-orb-1 absolute top-[10%] left-[15%] w-[420px] h-[420px] bg-[#ff00c3]/25 rounded-full blur-[140px] hidden md:block" />
      <div className="hero-orb hero-orb-2 absolute bottom-[8%] right-[8%] w-[520px] h-[520px] bg-[#04d9ff]/20 rounded-full blur-[160px] hidden md:block" />
      <div className="hero-orb hero-orb-3 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-[#dbf226]/12 rounded-full blur-[110px]" />

      {/* Animated rings */}
      <div className="hero-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-[#dbf226]/20 rounded-full pointer-events-none" />
      <div className="hero-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border-2 border-[#ff00c3]/15 rounded-full pointer-events-none" />
      <div className="hero-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] border border-[#04d9ff]/20 rounded-full pointer-events-none" />

      {/* Diagonal accent lines */}
      <div className="hero-diagonal absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dbf226] to-transparent transform -rotate-3 origin-left" style={{ top: '20%' }} />
      <div className="hero-diagonal absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#ff00c3] to-transparent transform rotate-2 origin-right" style={{ top: '80%' }} />

      {/* Floating Tape Elements - more scattered */}
      <div className="hero-tape absolute top-12 left-8 w-32 h-8 tape rotate-[-12deg]" />
      <div className="hero-tape absolute bottom-32 right-12 w-40 h-9 tape rotate-[15deg]" />
      <div className="hero-tape absolute top-1/4 right-6 w-28 h-7 tape rotate-[-6deg]" />
      <div className="hero-tape absolute bottom-1/4 left-16 w-24 h-6 tape rotate-[8deg]" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-24 h-24 border-l-4 border-t-4 border-[#dbf226]/50 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-24 h-24 border-r-4 border-b-4 border-[#ff00c3]/50 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-[95vw] md:max-w-7xl mx-auto text-center px-4"
           style={{
             transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`,
             transition: 'transform 0.1s ease-out'
           }}>

        {/* Anti-Design Sticker - ENHANCED */}
        <div className="hero-sticker absolute -top-4 md:-top-16 left-4 md:left-20 z-30 pointer-events-none">
          <div className="bg-[#ff00c3] text-white p-4 md:p-6 font-gothic text-2xl md:text-4xl uppercase border-4 border-white shadow-[8px_8px_0px_#000] relative overflow-hidden group">
            <span className="block leading-none">NO</span>
            <span className="block leading-none">FILTER</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>
        </div>

        {/* Second sticker */}
        <div className="hero-sticker absolute -top-8 md:-top-8 right-8 md:right-32 z-30 pointer-events-none">
          <div className="bg-[#dbf226] text-black p-2 md:p-4 font-gothic text-lg md:text-2xl uppercase border-4 border-black shadow-[6px_6px_0px_#ff5e00] rotate-12">
            <span className="block leading-tight">CALL</span>
            <span className="block leading-tight">NOW</span>
          </div>
        </div>

        {/* Massive Title */}
        <div className="hero-title-container relative mb-8 md:mb-12" style={{ perspective: '1000px' }}>
          <h1 className="font-syne font-black text-[14vw] md:text-[11vw] leading-[0.8] tracking-tighter uppercase relative z-10">
            <span className="hero-title-line-1 block text-transparent bg-clip-text bg-gradient-to-r from-[#dbf226] via-[#ff00c3] to-[#04d9ff] cursor-default select-none animate-gradient-x drop-shadow-[0_0_30px_rgba(219,242,38,0.3)]"
                  style={{ backgroundSize: '200% auto' }}>
              They Won't
            </span>
            <span className="hero-title-line-2 block text-white glitch-text relative"
                  data-text="SHUT UP"
                  style={{ textShadow: '6px 6px 0px #ff5e00, -3px -3px 0px #04d9ff, 0 0 40px rgba(255,255,255,0.1)' }}>
              Shut Up
            </span>
          </h1>

          {/* Scribble Underline - animated */}
          <div className="hero-underline absolute -bottom-2 left-1/2 -translate-x-1/2 w-[75%] h-3 md:h-4 bg-gradient-to-r from-[#dbf226] via-[#ff5e00] to-[#dbf226] transform rotate-[-1deg]" />

          {/* Decorative dots around title */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-[#ff00c3] rounded-full animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-[#04d9ff] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Subtitle with Tape - enhanced */}
        <div className="relative inline-block mb-8 md:mb-10 transform rotate-[1deg] hover:rotate-0 transition-all duration-500 hover:scale-105">
          <div className="hero-tape absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-7 tape" />
          <p className="hero-subtitle font-scribble text-lg md:text-2xl lg:text-3xl bg-black/80 text-white px-6 py-5 border-2 border-dashed border-[#dbf226] shadow-[6px_6px_0px_#dbf226] backdrop-blur-sm">
            Call four AI friends. Real voices. No menu. No app. Just talk.
          </p>
        </div>

        {/* Trust strip */}
        <div className="hero-trust flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white/70 mb-10">
          <span className="trust-chip">Real voices</span>
          <span className="trust-chip">24/7 pickup</span>
          <span className="trust-chip">No app required</span>
          <span className="trust-chip"><strong>Under 5 sec</strong> to connect</span>
        </div>

        {/* Interactive Button Zone - SUPERCHARGED */}
        <div className="hero-button-zone relative flex justify-center py-8">
          <div className="relative group">

            {/* Pulsing ring behind button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] rounded-full border-2 border-[#dbf226]/30 animate-pulse-ring" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[220%] rounded-full border border-[#ff00c3]/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />

            {/* Spinning Star Burst - dual layer */}
            <div className="hero-starburst absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280%] h-[280%] pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#dbf226] opacity-20">
                <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
              </svg>
            </div>
            <div className="hero-starburst absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] h-[220%] pointer-events-none" style={{ animationDirection: 'reverse' }}>
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#ff00c3] opacity-10 rotate-45">
                <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
              </svg>
            </div>

            <Button
              className="hero-button relative z-20 bg-white hover:bg-[#ff00c3] text-black hover:text-white border-4 border-white text-xl md:text-3xl lg:text-4xl py-7 md:py-10 px-12 md:px-20 rounded-full font-gothic tracking-wider uppercase transition-all duration-300 hover:scale-110 active:scale-95 shadow-[12px_12px_0px_#dbf226] overflow-hidden cursor-pointer btn-neon"
              onClick={() => {
                addChaos(30);
                window.location.href = `tel:${phoneNumber}`;
              }}
            >
              <div className="flex items-center gap-4">
                <Phone className="w-7 h-7 md:w-10 md:h-10 animate-[wiggle_0.4s_ease-in-out_infinite]" />
                <span className="drop-shadow-sm">{phoneNumber}</span>
              </div>

              {/* Holographic Sheen */}
              <div className="absolute inset-0 holo-foil opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none" />

              {/* Shine sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </Button>

            {/* Secondary action */}
            <div className="mt-6 flex justify-center">
              <a
                href="#what-to-expect"
                className="inline-flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 hover:text-[#dbf226] transition-colors"
              >
                See how it works <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Scribble Call-to-action - enhanced */}
            <div className="hero-scribble absolute -right-4 md:-right-48 -bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 font-scribble text-base md:text-xl rotate-[8deg] whitespace-nowrap">
              <span className="block text-[#ff5e00]">just dial</span>
              <span className="block text-[#ff5e00]">(no signup needed)</span>
              <span className="block font-bold text-[#dbf226] text-lg md:text-2xl">→ talk now</span>
            </div>

            {/* Left side decoration */}
            <div className="hero-scribble absolute -left-4 md:-left-44 -bottom-16 md:bottom-auto md:top-1/2 md:-translate-y-1/2 font-mono text-xs md:text-sm text-white/40 rotate-[-8deg] hidden md:block">
              <span className="block">AVAILABLE 24/7</span>
              <span className="block">NO WAITING ROOM</span>
              <span className="block text-[8px]">no filter either</span>
            </div>
          </div>
        </div>

        {/* Micro flow */}
        <div className="hero-microflow mt-8 md:mt-10 w-full flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white/50">
          <span className="trust-chip">Dial</span>
          <span className="trust-chip">Talk</span>
          <span className="trust-chip">Hang up</span>
          <span className="trust-chip">Call back anytime</span>
        </div>
      </div>

      {/* Marquee Footer - DOUBLE LAYER - Endless Loop */}
      <div className="hero-marquee absolute bottom-12 left-0 w-[110%] -ml-[5%]">
        {/* Back layer - subtle */}
        <div className="bg-[#ff00c3]/80 py-2 transform rotate-[1deg] border-y-2 border-white/50 overflow-hidden mb-1">
          <div className="flex whitespace-nowrap font-mono text-xs text-white/70 animate-marquee-reverse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0">
                <span className="mx-4">REAL CONVERSATIONS</span>
                <span className="mx-2">///</span>
                <span className="mx-4">DIAL NOW</span>
                <span className="mx-2">///</span>
                <span className="mx-4">24/7 AVAILABLE</span>
                <span className="mx-2">///</span>
                <span className="mx-4">NO HOLD MUSIC</span>
                <span className="mx-2">///</span>
                <span className="mx-4">INSTANT CONNECTION</span>
                <span className="mx-2">///</span>
                <span className="mx-4">REAL CONVERSATIONS</span>
                <span className="mx-2">///</span>
                <span className="mx-4">DIAL NOW</span>
                <span className="mx-2">///</span>
                <span className="mx-4">24/7 AVAILABLE</span>
                <span className="mx-2">///</span>
                <span className="mx-4">NO HOLD MUSIC</span>
                <span className="mx-2">///</span>
                <span className="mx-4">INSTANT CONNECTION</span>
                <span className="mx-2">///</span>
              </div>
            ))}
          </div>
        </div>
        {/* Front layer - main */}
        <div className="bg-[#dbf226] py-4 transform rotate-[-1.5deg] border-y-4 border-black overflow-hidden shadow-[0_4px_20px_rgba(219,242,38,0.3)]">
          <div className="flex whitespace-nowrap font-gothic text-base md:text-lg text-black animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex shrink-0">
                <span className="mx-4">HONEST FRIENDSHIP</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">REAL ADVICE</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">GENUINE CONNECTION</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">FOUR PERSPECTIVES</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">UNCONDITIONAL SUPPORT</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">HONEST FRIENDSHIP</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">REAL ADVICE</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">GENUINE CONNECTION</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">FOUR PERSPECTIVES</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
                <span className="mx-4">UNCONDITIONAL SUPPORT</span>
                <span className="mx-2 text-[#ff00c3]">&#9733;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
