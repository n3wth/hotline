import { useRef, useState } from "react";
import { Phone, Users, LogOut, ArrowRight, Zap, AlertTriangle, Skull } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGame } from "../hooks/useGameState";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: Phone,
    secondaryIcon: Zap,
    title: "You Call",
    subtitle: "Instant Connection",
    description: "Dial the number. Someone picks up immediately. No hold music, no waiting. Just a conversation.",
    rotate: -4,
    color: "#dbf226",
    gradientFrom: "#dbf226",
    gradientTo: "#a3e635",
    bgPattern: "radial-gradient(circle at 20% 80%, #dbf22610 0%, transparent 50%)"
  },
  {
    number: "02",
    icon: Users,
    secondaryIcon: AlertTriangle,
    title: "They Listen",
    subtitle: "Real Talk",
    description: "Four distinct personalities. Sally's direct. Viv's discerning. Edward's thoughtful. Jolene brings warmth. Take your pick.",
    rotate: 3,
    color: "#ff00c3",
    gradientFrom: "#ff00c3",
    gradientTo: "#f472b6",
    bgPattern: "radial-gradient(circle at 80% 20%, #ff00c310 0%, transparent 50%)"
  },
  {
    number: "03",
    icon: LogOut,
    secondaryIcon: Skull,
    title: "You Decide",
    subtitle: "Your Call",
    description: "Hang up whenever. Call back whenever. No subscriptions, no commitments. Just connection on your terms.",
    rotate: -2,
    color: "#04d9ff",
    gradientFrom: "#04d9ff",
    gradientTo: "#22d3ee",
    bgPattern: "radial-gradient(circle at 50% 50%, #04d9ff10 0%, transparent 50%)"
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { addChaos } = useGame();

  useGSAP(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // Mouse tracking for 3D tilt
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotationY: x * 10,
        rotationX: -y * 10,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const onEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        scale: 1.05,
        y: -10,
        boxShadow: `12px 12px 0px ${step.color}, 0 30px 60px rgba(0,0,0,0.4)`,
        duration: 0.4,
        ease: "power3.out"
      });
    };

    const onLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        boxShadow: `8px 8px 0px ${step.color}`,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
    };
  }, { scope: cardRef });

  const IconPrimary = step.icon;
  const IconSecondary = step.secondaryIcon;

  return (
    <div
      ref={cardRef}
      className="step-card relative bg-white text-black p-6 md:p-8 border-4 border-black will-change-transform cursor-pointer"
      style={{
        transform: `rotate(${step.rotate}deg)`,
        boxShadow: `8px 8px 0px ${step.color}`,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      onClick={() => addChaos(3)}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{ background: step.bgPattern }}
      />

      {/* Animated border glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `inset 0 0 30px ${step.color}30`
        }}
      />

      {/* Corner decorations - enhanced */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-black" />
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-black" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-black" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-black" />

      {/* Tape on top - enhanced */}
      <div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 tape transform -rotate-2 z-10"
        style={{ backgroundColor: `${step.color}cc` }}
      >
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)"
             }} />
      </div>

      {/* Step Number - dramatic */}
      <div className="flex justify-between items-start mb-6 relative">
        <div className="relative">
          <span
            className="text-7xl md:text-8xl font-syne font-black leading-none"
            style={{
              color: step.color,
              textShadow: `4px 4px 0 #000, -1px -1px 0 #000`,
              WebkitTextStroke: "2px black"
            }}
          >
            {step.number}
          </span>
          {/* Decorative line under number */}
          <div
            className="absolute -bottom-1 left-0 w-full h-1"
            style={{ background: `linear-gradient(90deg, ${step.gradientFrom}, ${step.gradientTo})` }}
          />
        </div>

        {/* Icon stack */}
        <div className="relative">
          <div
            className="p-4 rounded-full border-4 border-black relative z-10 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${step.gradientFrom}, ${step.gradientTo})`,
              transform: isHovered ? "scale(1.1) rotate(10deg)" : "scale(1)"
            }}
          >
            <IconPrimary className="w-6 h-6 md:w-7 md:h-7 text-black" />
          </div>
          {/* Secondary icon floating */}
          <div
            className="absolute -bottom-2 -right-2 p-2 bg-black rounded-full transition-all duration-300"
            style={{
              transform: isHovered ? "translate(4px, 4px) rotate(-10deg)" : "translate(0, 0)"
            }}
          >
            <IconSecondary className="w-3 h-3" style={{ color: step.color }} />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <p
        className="font-mono text-[9px] uppercase tracking-[0.3em] mb-2 transform -rotate-1"
        style={{ color: step.color }}
      >
        {step.subtitle}
      </p>

      {/* Title - enhanced */}
      <h3 className="text-2xl md:text-3xl font-gothic uppercase mb-4 relative inline-block">
        <span
          className="relative z-10 px-4 py-2 inline-block transform -skew-x-6"
          style={{
            background: `linear-gradient(135deg, ${step.gradientFrom}, ${step.gradientTo})`,
            color: "#000"
          }}
        >
          {step.title}
        </span>
        {/* Shadow layer */}
        <span
          className="absolute inset-0 bg-black transform translate-x-1 translate-y-1 -skew-x-6"
        />
      </h3>

      {/* Description - enhanced */}
      <p className="font-mono text-sm md:text-base leading-relaxed text-gray-700 relative z-10 pl-2 border-l-2 border-black/20">
        {step.description}
      </p>

      {/* Bottom gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
           }} />
    </div>
  );
}

export function WhatToExpect() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title animation with 3D effect
    gsap.from(".expect-title", {
      y: 120,
      opacity: 0,
      rotationX: 30,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Title words stagger
    gsap.from(".expect-title-word", {
      y: 60,
      opacity: 0,
      rotationZ: (i) => (i % 2 === 0 ? -3 : 3),
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".expect-subtitle", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Multiple lines animation
    gsap.from(".expect-line", {
      scaleX: 0,
      transformOrigin: "left center",
      stagger: 0.1,
      duration: 1,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    // Cards staggered entrance with dramatic effect
    gsap.from(".step-card", {
      y: 150,
      opacity: 0,
      scale: 0.7,
      rotation: (i) => (i % 2 === 0 ? -15 : 15),
      stagger: 0.25,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: ".steps-grid",
        start: "top 88%",
        toggleActions: "play none none reverse"
      }
    });

    // Arrows with bounce
    gsap.from(".step-arrow", {
      opacity: 0,
      scale: 0,
      rotation: -180,
      stagger: 0.3,
      duration: 0.8,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: ".steps-grid",
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Arrow pulse animation
    gsap.to(".step-arrow-inner", {
      x: 5,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Grid background parallax
    gsap.to(".expect-grid-bg", {
      backgroundPosition: "0 150px",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    // Floating decorations
    gsap.to(".expect-float", {
      y: -20,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-36 md:py-48 px-4 border-y-8 border-white bg-[#0a0a0a] relative overflow-hidden">

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#dbf226]/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#ff00c3]/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#04d9ff]/3 blur-[180px]" />
      </div>

      {/* Grid Background - enhanced */}
      <div
        className="expect-grid-bg absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Diagonal lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-[0.05]">
        <div className="absolute top-0 left-[10%] w-[1px] h-full bg-white transform -rotate-12" />
        <div className="absolute top-0 left-[30%] w-[1px] h-full bg-white transform rotate-12" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-white transform -rotate-12" />
      </div>

      {/* Decorative corner elements - enhanced */}
      <div className="absolute top-0 left-0">
        <div className="w-32 h-32 border-r-8 border-b-8 border-[#dbf226]" />
        <div className="absolute top-4 left-4 w-16 h-16 border-r-4 border-b-4 border-[#dbf226]/50" />
      </div>
      <div className="absolute bottom-0 right-0">
        <div className="w-32 h-32 border-l-8 border-t-8 border-[#ff00c3]" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-l-4 border-t-4 border-[#ff00c3]/50" />
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 border-l-4 border-b-4 border-[#04d9ff]/30" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-r-4 border-t-4 border-[#04d9ff]/30" />

      {/* Floating decorative elements */}
      <div className="expect-float absolute top-20 right-[10%] w-4 h-4 bg-[#dbf226] transform rotate-45" />
      <div className="expect-float absolute top-40 left-[5%] w-6 h-6 border-2 border-[#ff00c3] rounded-full" />
      <div className="expect-float absolute bottom-32 right-[15%] w-3 h-3 bg-[#04d9ff]" />
      <div className="expect-float absolute bottom-48 left-[12%] w-5 h-5 border-2 border-[#dbf226] transform rotate-45" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={titleRef} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 md:mb-32 pb-8 relative">
          <div className="relative">
            {/* Badge above title */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#ff5e00] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">The Process</span>
            </div>

            <h2 className="expect-title text-5xl md:text-7xl lg:text-9xl font-syne font-black uppercase leading-[0.85] text-white" style={{ perspective: "1000px" }}>
              <span className="expect-title-word inline-block">What</span>
              <br/>
              <span className="expect-title-word inline-block relative">
                <span className="text-[#dbf226]">Happens</span>
                {/* Decorative underline */}
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#dbf226]/20 transform -rotate-1" />
              </span>
            </h2>

            {/* Decorative star */}
            <svg className="absolute -top-4 -right-8 w-10 h-10 text-[#ff5e00] animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 17,14 19,22 12,18 5,22 7,14 2,9 9,9" />
            </svg>
          </div>

          <div className="expect-subtitle max-w-sm mt-8 md:mt-0 text-right">
            <p className="text-lg md:text-2xl font-mono text-white/60 leading-relaxed">
              Three simple steps to
              <br/>
              <span className="text-[#dbf226]">a real conversation.</span>
            </p>
            <p className="mt-4 text-sm font-mono">
              <span className="text-[#ff00c3] font-bold">24/7.</span>
              <span className="text-white/30"> Always someone there.</span>
            </p>
          </div>

          {/* Multiple decorative lines */}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="expect-line w-full h-1 bg-white" />
            <div className="expect-line w-3/4 h-[2px] bg-[#dbf226]/50 mt-2" />
            <div className="expect-line w-1/2 h-[1px] bg-[#ff00c3]/30 mt-1" />
          </div>
        </div>

        <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative" style={{ perspective: "1000px" }}>

          {/* Arrows for Desktop - Enhanced */}
          <div className="step-arrow hidden md:flex absolute top-1/2 left-[32%] -translate-y-1/2 z-20 items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff5e00] blur-lg opacity-50 rounded-full" />
              <div className="step-arrow-inner bg-gradient-to-r from-[#ff5e00] to-[#ff9500] p-3 rounded-full border-4 border-black relative">
                <ArrowRight className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
          <div className="step-arrow hidden md:flex absolute top-1/2 right-[32%] -translate-y-1/2 z-20 items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff5e00] blur-lg opacity-50 rounded-full" />
              <div className="step-arrow-inner bg-gradient-to-r from-[#ff5e00] to-[#ff9500] p-3 rounded-full border-4 border-black relative">
                <ArrowRight className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>

          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>

        {/* Bottom disclaimer - enhanced */}
        <div className="mt-20 text-center relative">
          <div className="inline-block relative">
            <p className="font-scribble text-white/30 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              <span className="text-[#dbf226]">*</span> Side effects may include: unexpected laughter, new perspectives,
              and the urge to call back.
              <span className="text-[#ff00c3]">*</span>
            </p>
            {/* Decorative underline */}
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
