import { useRef, useEffect, useState } from "react";
import { Battery, Signal, Wifi, ChevronLeft, MoreVertical, Send, Phone, Video, Mic, MicOff, Volume2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGame } from "../hooks/useGameState";
import { Badge, NoiseOverlay, useReducedMotion } from "@n3wth/ui";

gsap.registerPlugin(ScrollTrigger);

const messages = [
  { id: 1, sender: "Jolene", text: "Honey, did you really wear that to the interview?", align: "left", color: "#ff5e00", avatar: "J" },
  { id: 2, sender: "You", text: "It's fashion??", align: "right", color: "#04d9ff", avatar: "U" },
  { id: 3, sender: "Viv", text: "It's a cry for help, darling.", align: "left", color: "#7c3aed", avatar: "V" },
  { id: 4, sender: "Sally", text: "LMAOOOO drag them viv I'm deceased 💀", align: "left", color: "#ff00c3", avatar: "S" },
  { id: 5, sender: "Edward", text: "I think it looks... brave? Very brave.", align: "left", color: "#04d9ff", avatar: "E" },
  { id: 6, sender: "Jolene", text: "Bless his heart, he tried.", align: "left", color: "#ff5e00", avatar: "J" },
];

function MessageBubble({ msg, isVisible }: { msg: typeof messages[0]; isVisible: boolean }) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated && bubbleRef.current) {
      gsap.fromTo(bubbleRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
          rotationX: 20
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.5,
          ease: "back.out(1.5)"
        }
      );
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  if (!isVisible) return null;

  return (
    <div
      ref={bubbleRef}
      className={`flex flex-col ${msg.align === "right" ? "items-end" : "items-start"}`}
      style={{ opacity: 0 }}
    >
      {/* Sender label with avatar */}
      <div className={`flex items-center gap-1.5 mb-1 px-2 ${msg.align === "right" ? "flex-row-reverse" : ""}`}>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-black"
          style={{ backgroundColor: msg.color }}
        >
          {msg.avatar}
        </div>
        <span className="text-[9px] text-white/40 font-mono">{msg.sender}</span>
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[85%] px-4 py-2.5 text-xs font-medium relative overflow-hidden ${
          msg.align === "right"
            ? "rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#04d9ff] to-[#06b6d4] text-black"
            : "rounded-2xl rounded-tl-sm bg-[#1a1a1a] text-white border border-white/10"
        }`}
      >
        {/* Inner glow */}
        {msg.align === "left" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(circle at 0% 50%, ${msg.color}40 0%, transparent 50%)`
            }}
          />
        )}

        {msg.align === "left" && (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full mr-2 -mt-0.5 shadow-lg"
            style={{
              backgroundColor: msg.color,
              boxShadow: `0 0 10px ${msg.color}80`
            }}
          />
        )}
        {msg.text}
      </div>
    </div>
  );
}

export function ConversationDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneInnerRef = useRef<HTMLDivElement>(null);
  const [glitch, setGlitch] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const { addChaos, discoverSecret, gameState } = useGame();
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Random glitch effect - intensity based on chaos level
  useEffect(() => {
    if (prefersReducedMotion) return;
    const baseInterval = Math.max(2000, 4000 - gameState.chaosMeter * 20);
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150 + gameState.chaosMeter);
    }, baseInterval);
    return () => clearInterval(interval);
  }, [gameState.chaosMeter, prefersReducedMotion]);

  // Handle phone tap for triple-tap easter egg
  const handlePhoneTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      tapCountRef.current++;
      if (tapCountRef.current >= 3 && !gameState.secretsFound.includes("triple-tap")) {
        discoverSecret("triple-tap");
        addChaos(15);
        // Visual feedback
        gsap.to(phoneRef.current, {
          scale: 1.05,
          duration: 0.15,
          yoyo: true,
          repeat: 3,
        });
      }
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;
    addChaos(1);
  };

  useGSAP(() => {
    // Title entrance with split effect
    gsap.from(".demo-title-word", {
      y: 100,
      opacity: 0,
      rotationZ: (i) => (i % 2 === 0 ? -5 : 5),
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    gsap.from(".demo-warning", {
      scale: 0,
      rotation: -15,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Phone entrance with 3D effect
    gsap.from(phoneRef.current, {
      y: 150,
      opacity: 0,
      rotationY: 20,
      rotationX: 10,
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: phoneRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          // Start message reveal sequence
          let count = 0;
          const msgInterval = setInterval(() => {
            count++;
            setVisibleMessages(count);
            if (count >= messages.length) {
              clearInterval(msgInterval);
            }
          }, 700);
        }
      }
    });

    // Phone hover 3D tilt effect
    if (phoneRef.current && phoneInnerRef.current) {
      const phone = phoneRef.current;
      const inner = phoneInnerRef.current;

      const onMove = (e: MouseEvent) => {
        const rect = phone.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(inner, {
          rotationY: x * 15,
          rotationX: -y * 10,
          duration: 0.4,
          ease: "power2.out"
        });
      };

      const onLeave = () => {
        gsap.to(inner, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        });
      };

      phone.addEventListener("mousemove", onMove);
      phone.addEventListener("mouseleave", onLeave);

      return () => {
        phone.removeEventListener("mousemove", onMove);
        phone.removeEventListener("mouseleave", onLeave);
      };
    }

    // Sticker pop in with bounce
    gsap.from(".phone-sticker", {
      scale: 0,
      rotation: (i) => (i % 2 === 0 ? -45 : 45),
      stagger: 0.15,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
      scrollTrigger: {
        trigger: phoneRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Background shapes parallax
    gsap.to(".demo-bg-shape-1", {
      x: 80,
      rotation: 8,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    gsap.to(".demo-bg-shape-2", {
      x: -80,
      rotation: -8,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    // Floating orbs
    gsap.to(".demo-orb", {
      y: -30,
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
    <section ref={sectionRef} className="py-36 md:py-48 px-4 bg-[#fafafa] relative flex justify-center items-center overflow-hidden min-h-screen">

      {/* Enhanced noise overlay using @n3wth/ui */}
      <NoiseOverlay opacity={0.03} className="pointer-events-none" />

      {/* Paper texture gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white via-[#f5f5f5] to-[#ebebeb]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Background Elements - Enhanced */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="demo-bg-shape-1 absolute top-0 right-0 w-[70%] h-[90%] opacity-[0.06] transform skew-x-12"
             style={{ background: "linear-gradient(135deg, #ff5e00, #ff9500)" }} />
        <div className="demo-bg-shape-2 absolute bottom-0 left-0 w-[70%] h-[90%] opacity-[0.06] transform -skew-x-12"
             style={{ background: "linear-gradient(135deg, #04d9ff, #06b6d4)" }} />

        {/* Diagonal accent lines */}
        <div className="absolute top-0 left-[20%] w-[2px] h-full bg-[#ff00c3]/10 transform -rotate-12" />
        <div className="absolute top-0 right-[30%] w-[1px] h-full bg-[#dbf226]/10 transform rotate-12" />
      </div>

      {/* Floating orbs */}
      <div className="demo-orb absolute top-32 left-[10%] w-6 h-6 rounded-full bg-[#ff5e00]/20 blur-sm" />
      <div className="demo-orb absolute top-48 right-[15%] w-8 h-8 rounded-full bg-[#ff00c3]/15 blur-sm" />
      <div className="demo-orb absolute bottom-40 left-[20%] w-4 h-4 rounded-full bg-[#dbf226]/25 blur-sm" />
      <div className="demo-orb absolute bottom-60 right-[25%] w-5 h-5 rounded-full bg-[#04d9ff]/20 blur-sm" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

        {/* Text Side - Enhanced */}
        <div className="text-left space-y-10 order-2 lg:order-1">
          {/* Badge using @n3wth/ui */}
          <Badge variant="outline" className="inline-flex items-center gap-2 mb-4 border-black/20 bg-white/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">Live Preview</span>
          </Badge>

          <h2 className="demo-title font-syne font-black text-5xl md:text-6xl lg:text-8xl text-black uppercase leading-[0.85]">
            <span className="demo-title-word inline-block">It</span>{" "}
            <span className="demo-title-word inline-block">Sounds</span>
            <br/>
            <span className="demo-title-word inline-block relative">
              <span className="text-transparent" style={{ WebkitTextStroke: "3px black" }}>Like</span>
            </span>{" "}
            <span className="demo-title-word inline-block relative">
              <span className="text-[#ff00c3]">Chaos</span>
              {/* Decorative underline */}
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#ff00c3]/20 transform rotate-1" />
            </span>
          </h2>

          <div className="demo-warning relative p-6 md:p-8 border-4 border-black bg-white shadow-[12px_12px_0px_#000] rotate-1 max-w-lg">
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#ff5e00]" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#ff5e00]" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ff5e00] rounded-full flex items-center justify-center">
                <span className="text-xl">&#9888;</span>
              </div>
              <p className="font-gothic text-xl uppercase tracking-wide text-[#ff5e00]">
                Warning
              </p>
            </div>

            <p className="font-scribble text-xl md:text-2xl text-[#ff00c3] leading-relaxed">
              Contains strong opinions, honest feedback, and occasional reality checks.
            </p>

            <div className="mt-6 pt-4 border-t-2 border-dashed border-black/20">
              <p className="font-mono text-xs text-gray-500">
                <span className="text-[#ff5e00]">*</span> May cause: unexpected laughter, new perspectives, and genuine conversation. <span className="text-[#ff00c3]">*</span>
              </p>
            </div>

            {/* Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 tape transform rotate-2" style={{ backgroundColor: "rgba(219, 242, 38, 0.8)" }} />
          </div>

          {/* Decorative elements */}
          <div className="flex items-center gap-4">
            <div className="tape w-24 h-5 -rotate-6" />
            <div className="w-4 h-4 bg-[#ff00c3] rotate-45" />
            <div className="w-3 h-3 border-2 border-[#04d9ff]" />
          </div>
        </div>

        {/* Phone Mockup - Enhanced */}
        <div className="relative mx-auto lg:mx-0 order-1 lg:order-2" style={{ perspective: "1200px" }}>
          <div
            ref={phoneRef}
            onClick={handlePhoneTap}
            className="relative w-[320px] md:w-[360px] cursor-pointer"
          >
            {/* Ambient glow behind phone */}
            <div className="absolute inset-0 blur-3xl opacity-30 pointer-events-none -z-10"
                 style={{
                   background: `radial-gradient(circle at center, #ff00c3 0%, #04d9ff 50%, transparent 70%)`,
                   transform: "scale(1.3)"
                 }} />

            <div
              ref={phoneInnerRef}
              className={`transition-transform duration-75 ${glitch ? 'translate-x-[3px] skew-x-2' : ''}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Phone Body */}
              <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-[3rem] p-3 border-[8px] border-[#3a3a3a] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden">

                {/* Side buttons */}
                <div className="absolute -left-[10px] top-32 w-[4px] h-8 bg-[#3a3a3a] rounded-l-full" />
                <div className="absolute -left-[10px] top-44 w-[4px] h-12 bg-[#3a3a3a] rounded-l-full" />
                <div className="absolute -left-[10px] top-60 w-[4px] h-12 bg-[#3a3a3a] rounded-l-full" />
                <div className="absolute -right-[10px] top-40 w-[4px] h-16 bg-[#3a3a3a] rounded-r-full" />

                {/* Screen Content */}
                <div className="bg-[#0a0a0a] w-full rounded-[2.25rem] overflow-hidden flex flex-col relative" style={{ height: '640px' }}>

                  {/* Dynamic Island - Enhanced */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
                    <div className="w-28 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-2">
                      <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="h-14 px-8 flex justify-between items-center text-white text-xs font-mono z-20 pt-4">
                    <span className="font-bold text-sm">9:41</span>
                    <div className="flex gap-2 items-center">
                      <Signal className="w-4 h-4" />
                      <Wifi className="w-4 h-4" />
                      <div className="flex items-center gap-1">
                        <Battery className="w-6 h-6" />
                        <span className="text-[9px] text-white/50">89%</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Header - Enhanced */}
                  <div className="h-16 border-b border-white/10 flex items-center px-4 justify-between bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] z-20">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <ChevronLeft className="w-6 h-6 text-[#04d9ff]" />
                      </div>
                      <div className="relative">
                        {/* Group avatar stack */}
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-[#ff5e00] border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-black">J</div>
                          <div className="w-8 h-8 rounded-full bg-[#ff00c3] border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-white">S</div>
                          <div className="w-8 h-8 rounded-full bg-[#7c3aed] border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-white">V</div>
                          <div className="w-8 h-8 rounded-full bg-[#04d9ff] border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-black">E</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">The Nightmare Rotation</div>
                        <div className="text-[9px] text-white/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          4 online
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Phone className="w-4 h-4 text-[#04d9ff]" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Video className="w-4 h-4 text-[#04d9ff]" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area - Enhanced */}
                  <div className="flex-1 p-4 space-y-5 overflow-y-auto relative">

                    {/* Cracked Screen Overlay - Enhanced */}
                    <svg className="absolute top-20 right-8 w-24 h-24 opacity-[0.1] pointer-events-none z-50" viewBox="0 0 100 100">
                      <path d="M50 50 L85 10 M50 50 L98 50 M50 50 L70 90 M50 50 L15 75 M50 50 L30 20" stroke="white" strokeWidth="0.5" fill="none" />
                    </svg>

                    {/* Date separator */}
                    <div className="flex items-center justify-center gap-3 my-4">
                      <div className="flex-1 h-[1px] bg-white/10" />
                      <span className="text-[9px] text-white/30 font-mono uppercase">Today</span>
                      <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    {messages.map((msg, idx) => (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        isVisible={idx < visibleMessages}
                      />
                    ))}

                    {/* Typing Bubble - Enhanced */}
                    {visibleMessages >= messages.length && (
                      <div className="flex items-center gap-3 animate-slide-up">
                        <div className="w-6 h-6 rounded-full bg-[#ff00c3] flex items-center justify-center text-[8px] font-bold text-white">S</div>
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                          <span className="w-2 h-2 bg-[#ff00c3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-[#ff00c3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-[#ff00c3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[9px] text-white/30 font-mono">typing...</span>
                      </div>
                    )}
                  </div>

                  {/* Input Area - Enhanced */}
                  <div className="p-4 bg-gradient-to-t from-[#0a0a0a] to-transparent border-t border-white/5 z-20">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); addChaos(2); }}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        {isMuted ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5 text-[#04d9ff]" />}
                      </button>
                      <div className="flex-1 bg-[#1a1a1a] rounded-full h-10 flex items-center px-4 justify-between border border-white/10">
                        <span className="text-white/30 text-xs">Type a message...</span>
                      </div>
                      <button className="p-2.5 rounded-full bg-gradient-to-r from-[#04d9ff] to-[#06b6d4] hover:opacity-90 transition-opacity">
                        <Send className="w-5 h-5 text-black" />
                      </button>
                    </div>

                    {/* Quick reactions */}
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <span className="text-lg cursor-pointer hover:scale-125 transition-transform">😭</span>
                      <span className="text-lg cursor-pointer hover:scale-125 transition-transform">💀</span>
                      <span className="text-lg cursor-pointer hover:scale-125 transition-transform">🙄</span>
                      <span className="text-lg cursor-pointer hover:scale-125 transition-transform">😤</span>
                    </div>
                  </div>

                  {/* Screen Glitch Overlay - Enhanced */}
                  {glitch && (
                    <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-[#ff00c3]/10 mix-blend-screen" />
                      <div className="w-full h-[3px] bg-white/40 absolute top-[25%]" />
                      <div className="w-full h-[2px] bg-[#04d9ff]/60 absolute top-[65%]" />
                      <div className="w-full h-[1px] bg-[#dbf226]/40 absolute top-[80%]" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
                    </div>
                  )}

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* Phone shadow - Enhanced */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-black/30 blur-2xl rounded-full" />
          </div>

          {/* Decorative Stickers - Enhanced */}
          <div className="phone-sticker absolute top-[15%] -right-12 z-30 transform rotate-12">
            <div className="relative">
              <div className="absolute inset-0 bg-[#dbf226] blur-lg opacity-50" />
              <div className="relative bg-[#dbf226] text-black font-gothic text-sm px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000]">
                DON'T TEXT
              </div>
            </div>
          </div>

          <div className="phone-sticker absolute bottom-[20%] -left-10 z-30 transform -rotate-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff00c3] blur-lg opacity-50" />
              <div className="relative bg-[#ff00c3] text-white font-gothic text-sm px-4 py-2 border-4 border-white shadow-[4px_4px_0px_#000]">
                CALL ONLY
              </div>
            </div>
          </div>

          <div className="phone-sticker absolute top-[60%] -right-8 z-30 transform rotate-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#04d9ff] blur-lg opacity-50" />
              <div className="relative bg-[#04d9ff] text-black font-gothic text-[10px] px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000]">
                REAL TALK
              </div>
            </div>
          </div>

          {/* Floating icons around phone */}
          <div className="absolute -top-4 left-0 animate-bounce" style={{ animationDelay: "0.3s" }}>
            <Volume2 className="w-6 h-6 text-[#ff5e00]/40" />
          </div>
          <div className="absolute bottom-20 -right-4 animate-bounce" style={{ animationDelay: "0.6s" }}>
            <Phone className="w-5 h-5 text-[#ff00c3]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
