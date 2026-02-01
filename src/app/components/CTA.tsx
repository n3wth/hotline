import { useRef, useState } from "react";
import { Phone, ArrowRight, Zap, Sparkles, Star, Heart, AlertTriangle, TrendingUp, Users, Globe, Mic } from "lucide-react";
import { Button, Badge, NoiseOverlay, useReducedMotion } from "@n3wth/ui";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGame } from "../hooks/useGameState";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const phoneNumber = "+1 (415) 360-0751";
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { addChaos, gameState } = useGame();
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // Background text parallax
    gsap.to(bgTextRef.current, {
      y: -150,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      }
    });

    // Card entrance with dramatic 3D flip
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });

    cardTl
      .from(cardRef.current, {
        y: 200,
        rotationX: -30,
        rotationY: 15,
        scale: 0.7,
        opacity: 0,
        duration: 1.4,
        ease: "back.out(1.2)",
      })
      .from(".cta-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.6");

    // Pulsing ambient glow
    gsap.to(glowRef.current, {
      scale: 1.1,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Floating particles
    gsap.utils.toArray<HTMLElement>(".cta-particle").forEach((particle, i) => {
      gsap.to(particle, {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });

  }, { scope: sectionRef });

  // 3D card tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardInnerRef.current || prefersReducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardInnerRef.current, {
      rotationY: x * 12,
      rotationX: -y * 12,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardInnerRef.current || prefersReducedMotion) return;
    gsap.to(cardInnerRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    setIsHovering(false);
  };

  const handleCallClick = () => {
    addChaos(25);

    // Dramatic button click effect
    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        window.location.href = `tel:${phoneNumber}`;
      }
    });
  };

  const getChaosMessage = () => {
    if (gameState.chaosMeter < 20) return "They're waiting...";
    if (gameState.chaosMeter < 40) return "Getting interesting...";
    if (gameState.chaosMeter < 60) return "Sally noticed you.";
    if (gameState.chaosMeter < 80) return "The group chat is typing...";
    return "They have opinions.";
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-48 px-4 overflow-hidden bg-black text-white"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(255, 0, 195, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(4, 217, 255, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(219, 242, 38, 0.2) 0%, transparent 60%),
              linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%)
            `
          }}
        />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(219, 242, 38, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(219, 242, 38, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Diagonal stripes overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 20px
            )`
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[Sparkles, Star, Zap, Heart, AlertTriangle].map((Icon, i) => (
          <div
            key={i}
            className="cta-particle absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              color: ['#ff00c3', '#04d9ff', '#dbf226', '#ff5e00', '#7c3aed'][i],
              opacity: 0.3,
            }}
          >
            <Icon className="w-8 h-8" />
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Giant Background Text */}
        <h2
          ref={bgTextRef}
          className="font-syne font-black text-[18vw] md:text-[14vw] leading-[0.75] uppercase text-center mix-blend-overlay opacity-20 select-none pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          style={{
            WebkitTextStroke: '2px rgba(255,255,255,0.1)',
          }}
        >
          <span className="block">Don't</span>
          <span className="block text-transparent" style={{ WebkitTextStroke: '3px rgba(219, 242, 38, 0.3)' }}>
            Hesitate
          </span>
        </h2>

        <div className="relative flex flex-col items-center justify-center min-h-[600px]">
          {/* Ambient glow behind card */}
          <div
            ref={glowRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-[600px] h-[400px] rounded-[50%] blur-[100px]"
              style={{
                background: `radial-gradient(circle, rgba(255, 0, 195, 0.5) 0%, rgba(4, 217, 255, 0.3) 50%, transparent 70%)`
              }}
            />
          </div>

          {/* Main CTA Card */}
          <div
            ref={cardRef}
            className="relative"
            style={{ perspective: '1200px' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={cardInnerRef}
              className="relative bg-white text-black p-10 md:p-14 max-w-2xl w-full"
              style={{
                transformStyle: 'preserve-3d',
                border: '6px solid #dbf226',
                boxShadow: isHovering
                  ? '30px 30px 0px #ff00c3, -8px -8px 60px rgba(4, 217, 255, 0.4), 8px 8px 60px rgba(255, 0, 195, 0.4)'
                  : '20px 20px 0px #ff00c3, -5px -5px 40px rgba(4, 217, 255, 0.2)',
                transform: 'rotate(1deg)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Corner decorations */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#ff00c3] transform rotate-45" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#04d9ff] transform rotate-45" />
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#dbf226] transform rotate-12" />
              <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-[#ff5e00] transform -rotate-12" />

              {/* Tape decorations */}
              <div className="absolute -top-4 left-1/4 w-20 h-6 tape rotate-[-8deg] opacity-80" />
              <div className="absolute -bottom-4 right-1/4 w-16 h-5 tape rotate-[5deg] opacity-80" />

              <div className="cta-content relative z-10">
                {/* Status badge */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge
                    variant="outline"
                    className="px-4 py-2 border-2 border-[#ff5e00] bg-[#ff5e00]/10"
                  >
                    <Zap className="w-4 h-4 text-[#ff5e00] mr-2" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#ff5e00] font-bold">
                      {getChaosMessage()}
                    </span>
                  </Badge>
                </div>

                {/* Main headline */}
                <h3 className="font-gothic text-5xl md:text-7xl uppercase mb-6 leading-[0.9] text-center">
                  Ready to{" "}
                  <span
                    className="relative inline-block"
                    style={{
                      background: 'linear-gradient(135deg, #ff00c3, #ff5e00)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Call
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#ff00c3] to-[#ff5e00]" />
                  </span>
                  ?
                </h3>

                {/* Subtext */}
                <p className="font-mono text-base md:text-lg mb-10 text-center leading-relaxed">
                  <span className="block text-gray-600">
                    The group chat is live. Four voices, zero filter.
                  </span>
                  <span className="block text-gray-600 mt-1">
                    <span className="text-[#ff5e00] font-bold">They've been waiting for you.</span>
                  </span>
                </p>

                {/* CTA Button */}
                <Button
                  className="w-full bg-black text-white hover:bg-[#dbf226] hover:text-black font-syne font-bold text-xl md:text-2xl py-7 uppercase tracking-[0.15em] border-4 border-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                  onClick={handleCallClick}
                >
                  {/* Button shine effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />

                  <div className="flex items-center justify-center gap-4 relative z-10">
                    <Phone className="w-7 h-7 animate-[wiggle_0.4s_ease-in-out_infinite]" />
                    <span>Call The Hotline</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-300" />
                  </div>
                </Button>

                {/* Phone number display */}
                <div className="mt-6 text-center">
                  <a
                    href={`tel:${phoneNumber}`}
                    className="font-mono text-2xl md:text-3xl font-bold tracking-wider text-black hover:text-[#ff00c3] transition-colors"
                  >
                    {phoneNumber}
                  </a>
                </div>

                {/* Disclaimer */}
                <p className="mt-4 font-mono text-[10px] text-gray-400 uppercase tracking-wide text-center">
                  *Standard carrier rates apply. Side effects may include new perspectives.
                </p>
              </div>

              {/* Holographic sheen */}
              <div className="absolute inset-0 holo-foil opacity-[0.07] pointer-events-none" />

              {/* Noise overlay */}
              <NoiseOverlay opacity={0.02} className="pointer-events-none rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StartupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // Stagger in the stats
    gsap.from(".stat-card", {
      y: 80,
      opacity: 0,
      rotationX: -15,
      stagger: 0.15,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // Animate the mission text
    gsap.from(".mission-text", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".mission-text",
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });

    // Business model cards
    gsap.from(".biz-card", {
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: ".biz-grid",
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

  }, { scope: sectionRef });

  const stats = [
    { value: "1B+", label: "Adults report loneliness", icon: Users, color: "#ff00c3" },
    { value: "4", label: "Distinct AI personalities", icon: Mic, color: "#04d9ff" },
    { value: "24/7", label: "Always available", icon: Globe, color: "#dbf226" },
    { value: "∞", label: "Conversations possible", icon: TrendingUp, color: "#ff5e00" },
  ];

  const businessModel = [
    { title: "Consumer", desc: "Premium personas & extended conversations" },
    { title: "Enterprise", desc: "White-label AI companions for brands" },
    { title: "Platform", desc: "Creator tools for custom personalities" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-4 bg-[#0a0a0a] text-white overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 30% 0%, rgba(4, 217, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 100%, rgba(255, 0, 195, 0.15) 0%, transparent 50%)
          `
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="px-4 py-2 border-2 border-[#04d9ff]/50 bg-[#04d9ff]/10 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-[#04d9ff] mr-2" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#04d9ff]">
              For Investors & Partners
            </span>
          </Badge>

          <h2 className="font-gothic text-4xl md:text-6xl uppercase mb-6 leading-[0.9]">
            The Future of{" "}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #04d9ff, #ff00c3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI Companionship
            </span>
          </h2>
        </div>

        {/* Mission statement */}
        <div className="mission-text max-w-3xl mx-auto text-center mb-20">
          <p className="font-mono text-lg md:text-xl text-white/70 leading-relaxed mb-6">
            Over <span className="text-[#ff00c3] font-bold">1 billion adults</span> worldwide report feeling lonely.
            We're building the first AI companions you can actually <span className="text-[#dbf226] font-bold">call</span>—real
            conversations with distinct personalities, available 24/7, no app required.
          </p>
          <p className="font-mono text-base text-white/50">
            Powered by ElevenLabs Conversational AI. Built for the loneliness epidemic.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card relative p-6 bg-black/50 border-2 border-white/10 hover:border-current transition-colors duration-300 group"
              style={{ '--hover-color': stat.color } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <stat.icon
                className="w-6 h-6 mb-4 transition-colors duration-300"
                style={{ color: stat.color }}
              />
              <div
                className="font-gothic text-3xl md:text-4xl mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-xs text-white/50 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Business model */}
        <div className="biz-grid grid md:grid-cols-3 gap-6 mb-16">
          {businessModel.map((item, i) => (
            <div
              key={i}
              className="biz-card p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#dbf226]/50 transition-all duration-300"
            >
              <h3 className="font-syne font-bold text-xl mb-3 text-white">
                {item.title}
              </h3>
              <p className="font-mono text-sm text-white/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tech stack callout */}
        <div className="text-center">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">
            Built With
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a
              href="https://elevenlabs.io/conversational-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-white/50 hover:text-[#04d9ff] transition-colors flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              ElevenLabs Conversational AI
            </a>
            <span className="text-white/20">|</span>
            <span className="font-mono text-sm text-white/50 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Multi-Persona Architecture
            </span>
            <span className="text-white/20">|</span>
            <span className="font-mono text-sm text-white/50 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone-First Experience
            </span>
          </div>
        </div>
      </div>

      {/* Noise texture */}
      <NoiseOverlay opacity={0.015} className="pointer-events-none" />
    </section>
  );
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const endTextRef = useRef<HTMLDivElement>(null);
  const { gameState } = useGame();
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // Stagger animate footer elements with 3D effect
    gsap.from(".footer-item", {
      y: 50,
      rotationX: -20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
      }
    });

    // END text dramatic entrance
    gsap.from(endTextRef.current, {
      scale: 0.3,
      rotation: -10,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    // Floating END text
    gsap.to(endTextRef.current, {
      y: -15,
      rotation: 3,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: footerRef });

  const socialLinks = [
    { name: "Twitter", color: "#04d9ff", href: "#" },
    { name: "Instagram", color: "#ff00c3", href: "#" },
    { name: "TikTok", color: "#dbf226", href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative py-20 bg-[#050505] text-white overflow-hidden"
    >
      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff00c3] via-[#dbf226] to-[#04d9ff]" />

      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 0% 100%, rgba(255, 0, 195, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(4, 217, 255, 0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {/* Brand section */}
          <div className="footer-item max-w-sm">
            <h4 className="font-syne font-black text-3xl uppercase mb-3 relative inline-block">
              They Won't Shut Up
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#dbf226] to-transparent" />
            </h4>
            <p className="font-mono text-xs text-white/50 leading-relaxed">
              AI companionship reimagined. Real conversations. Real personality. Real connection.
            </p>
          </div>

          {/* Social links */}
          <div className="footer-item flex gap-4">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="group relative px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 border-white/20 hover:border-current transition-all duration-300"
                style={{
                  '--hover-color': link.color,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = link.color;
                  e.currentTarget.style.boxShadow = `4px 4px 0px ${link.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <span className="relative z-10">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Credits section */}
          <div className="footer-item text-right">
            <p className="font-mono text-xs text-white/40 mb-1">
              Built with{" "}
              <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[#04d9ff] transition-colors">
                ElevenLabs
              </a>
            </p>
            <p className="font-mono text-xs text-white/40">
              Created by{" "}
              <a href="https://newth.ai" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[#dbf226] transition-colors">
                Newth.ai
              </a>
            </p>

            {/* Secrets display */}
            {gameState.secretsFound.length > 0 && (
              <div className="mt-3 flex items-center justify-end gap-1">
                <span className="font-mono text-[10px] text-white/30">SECRETS:</span>
                {gameState.secretsFound.map((_, i) => (
                  <span
                    key={i}
                    className="text-[#dbf226] text-sm animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    &#9733;
                  </span>
                ))}
                <span className="font-mono text-[10px] text-white/30">/ 5</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-wider">
          <span>© 2026 They Won't Shut Up. All rights reserved.</span>
          <span>Visit #{gameState.visitCount} | Chaos Level: {gameState.chaosMeter}%</span>
        </div>
      </div>

      {/* Decorative tapes */}
      <div className="absolute top-4 left-8 w-24 h-6 tape rotate-[-8deg] opacity-50" />
      <div className="absolute top-4 right-12 w-20 h-5 tape rotate-[12deg] opacity-50" />

      {/* Giant END text */}
      <div
        ref={endTextRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 pointer-events-none select-none"
      >
        <span
          className="font-gothic text-[20vw] md:text-[15vw] uppercase"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.05)',
          }}
        >
          END?
        </span>
      </div>

      {/* Easter egg hint for high chaos */}
      {gameState.chaosMeter > 50 && (
        <div className="absolute bottom-4 right-6 font-mono text-[9px] text-white/15 hover:text-[#dbf226] transition-colors cursor-default">
          ↑↑↓↓←→←→BA
        </div>
      )}

      {/* Noise texture */}
      <NoiseOverlay opacity={0.015} className="pointer-events-none" />
    </footer>
  );
}
