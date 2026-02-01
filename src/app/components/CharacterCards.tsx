import { useRef, useState } from "react";
import { Move, Sparkles, Flame, Crown, Heart } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useGame } from "../hooks/useGameState";
import { characterFaces } from "./CharacterFaces";

gsap.registerPlugin(ScrollTrigger, Draggable);

const characters = [
  {
    name: "Jolene",
    role: "The Anchor",
    tagline: "Bless your heart",
    color: "#ff5e00",
    gradientFrom: "#ff5e00",
    gradientTo: "#ff9500",
    tapeColor: "rgba(255, 200, 0, 0.85)",
    rotation: -4,
    icon: Crown,
  },
  {
    name: "Sally",
    role: "Chaos Agent",
    tagline: "Sleep is optional",
    color: "#ff00c3",
    gradientFrom: "#ff00c3",
    gradientTo: "#ff66d9",
    tapeColor: "rgba(255, 0, 195, 0.6)",
    rotation: 3,
    icon: Flame,
  },
  {
    name: "Viv",
    role: "The Villain",
    tagline: "I'm just being honest",
    color: "#7c3aed",
    gradientFrom: "#7c3aed",
    gradientTo: "#a855f7",
    tapeColor: "rgba(124, 58, 237, 0.6)",
    rotation: -3,
    icon: Sparkles,
  },
  {
    name: "Edward",
    role: "Sweetheart",
    tagline: "Love is... confusing",
    color: "#04d9ff",
    gradientFrom: "#04d9ff",
    gradientTo: "#06b6d4",
    tapeColor: "rgba(4, 217, 255, 0.6)",
    rotation: 4,
    icon: Heart,
  },
];

function CharacterCard({ char, index }: { char: typeof characters[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragBounds = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [wasDragged, setWasDragged] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { getCharacterDialogue, addChaos, trackCardDrag, gameState } = useGame();
  const IconComponent = char.icon;

  useGSAP(() => {
    if (!cardRef.current) return;

    // Animated glow pulse
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Make card draggable with GSAP
    Draggable.create(cardRef.current, {
      type: "x,y",
      bounds: dragBounds.current,
      inertia: true,
      edgeResistance: 0.8,
      onDragStart: function() {
        gsap.to(this.target, {
          scale: 1.12,
          rotation: 0,
          zIndex: 100,
          boxShadow: `0 30px 60px ${char.color}40, 0 0 100px ${char.color}30`,
          duration: 0.4,
          ease: "power3.out"
        });
        // Inner card tilt effect
        if (innerRef.current) {
          gsap.to(innerRef.current, {
            rotationX: 5,
            rotationY: 5,
            duration: 0.3
          });
        }
      },
      onDragEnd: function() {
        gsap.to(this.target, {
          scale: 1,
          rotation: char.rotation,
          zIndex: 1,
          boxShadow: `8px 8px 0px ${char.color}, 16px 16px 40px rgba(0,0,0,0.4)`,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)"
        });
        if (innerRef.current) {
          gsap.to(innerRef.current, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
          });
        }
        // Track dragging for easter egg
        if (!wasDragged) {
          setWasDragged(true);
          addChaos(5);
          trackCardDrag(char.name);
        }
      }
    });

    // Enhanced hover effect with 3D tilt
    const card = cardRef.current;
    const inner = innerRef.current;

    const onEnter = () => {
      setIsHovered(true);
      if (!Draggable.get(card)?.isDragging) {
        gsap.to(card, {
          scale: 1.06,
          y: -10,
          boxShadow: `12px 12px 0px ${char.color}, 24px 24px 60px rgba(0,0,0,0.5)`,
          duration: 0.4,
          ease: "power3.out"
        });
        addChaos(1);
      }
    };

    const onLeave = () => {
      setIsHovered(false);
      if (!Draggable.get(card)?.isDragging) {
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: `8px 8px 0px ${char.color}, 16px 16px 40px rgba(0,0,0,0.4)`,
          duration: 0.4,
          ease: "power2.out"
        });
        if (inner) {
          gsap.to(inner, { rotationX: 0, rotationY: 0, duration: 0.4 });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!inner || Draggable.get(card)?.isDragging) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(inner, {
        rotationY: x * 15,
        rotationX: -y * 15,
        duration: 0.3,
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

  // Get dynamic dialogue based on current mood
  const dialogue = getCharacterDialogue(char.name);

  return (
    <div ref={dragBounds} className="relative w-full max-w-[320px] h-[500px] mx-auto" style={{ perspective: "1000px" }}>
      {/* Animated background glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-sm blur-3xl opacity-30 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle at center, ${char.color} 0%, transparent 70%)`,
          transform: "scale(1.2)"
        }}
      />

      <div
        ref={cardRef}
        className="character-card absolute inset-0 will-change-transform cursor-grab active:cursor-grabbing"
        style={{
          transform: `rotate(${char.rotation}deg)`,
          boxShadow: `8px 8px 0px ${char.color}, 16px 16px 40px rgba(0,0,0,0.4)`
        }}
        data-index={index}
      >
        {/* Tape Holding the Card - Enhanced */}
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-8 z-20 transform -rotate-2"
          style={{
            backgroundColor: char.tapeColor,
            boxShadow: "2px 2px 8px rgba(0,0,0,0.3)"
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)`
          }} />
        </div>

        <div
          ref={innerRef}
          className="bg-white h-full w-full p-3 pb-6 relative overflow-hidden group border-4 border-black"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Holographic Foil Layer - Enhanced */}
          <div className="absolute inset-0 holo-foil opacity-30 pointer-events-none z-10" />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 pointer-events-none" style={{ borderColor: char.color }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 pointer-events-none" style={{ borderColor: char.color }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 pointer-events-none" style={{ borderColor: char.color }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 pointer-events-none" style={{ borderColor: char.color }} />

          {/* Card Content - Polaroid Style with Vector Face */}
          <div
            className="h-[55%] w-full relative overflow-hidden mb-4 border-4 border-black"
            style={{
              background: `linear-gradient(135deg, ${char.gradientFrom}20 0%, ${char.gradientTo}10 100%), linear-gradient(to bottom, #1a1a1a, #0a0a0a)`
            }}
          >
            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background: `linear-gradient(45deg, ${char.gradientFrom}00 0%, ${char.gradientTo}40 50%, ${char.gradientFrom}00 100%)`,
                animation: isHovered ? "gradient-shift 2s ease infinite" : "none"
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              {/* Background name watermark - enhanced */}
              <span
                className="font-gothic text-6xl opacity-[0.08] uppercase absolute transform -rotate-45 select-none tracking-widest"
                style={{ color: char.color }}
              >
                {char.name}
              </span>

              {/* Decorative rings behind face */}
              <div
                className="absolute w-40 h-40 rounded-full border-2 opacity-20 animate-pulse"
                style={{ borderColor: char.color }}
              />
              <div
                className="absolute w-32 h-32 rounded-full border opacity-30"
                style={{ borderColor: char.color }}
              />

              {/* Vector Face */}
              {(() => {
                const FaceComponent = characterFaces[char.name];
                return FaceComponent ? (
                  <FaceComponent
                    className="w-36 h-36 z-10 drop-shadow-2xl transition-transform duration-300"
                    style={{
                      filter: `drop-shadow(0 0 20px ${char.color}60)`,
                      transform: isHovered ? "scale(1.1)" : "scale(1)"
                    }}
                  />
                ) : null;
              })()}
            </div>

            {/* Noise overlay inside the 'photo' */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                 style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                 }} />

            {/* Colored border glow - enhanced */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 50px ${char.color}50, inset 0 0 100px ${char.color}20`,
              }}
            />

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                 style={{
                   backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)"
                 }} />

            {/* Icon badge */}
            <div
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-20"
              style={{
                background: `linear-gradient(135deg, ${char.gradientFrom}, ${char.gradientTo})`,
                boxShadow: `0 2px 10px ${char.color}80`
              }}
            >
              <IconComponent className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="px-1 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-gothic text-3xl uppercase text-black leading-none transform -rotate-1 tracking-tight">
                  {char.name}
                </h3>
                <p className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1">
                  {char.tagline}
                </p>
              </div>
              <span
                className="font-mono text-[9px] font-black px-2 py-1 border-2 border-black transform rotate-3 uppercase tracking-wider shadow-[2px_2px_0px_black]"
                style={{
                  background: `linear-gradient(135deg, ${char.gradientFrom}, ${char.gradientTo})`,
                  color: 'white'
                }}
              >
                {char.role}
              </span>
            </div>

            <div className="relative mt-4">
              {/* Quote marks */}
              <span className="absolute -left-1 -top-2 text-3xl opacity-20 font-serif" style={{ color: char.color }}>"</span>
              <p className="font-scribble text-sm leading-relaxed text-gray-700 pl-3 pr-2 italic">
                {dialogue}
              </p>
              <span className="absolute -right-1 bottom-0 text-3xl opacity-20 font-serif" style={{ color: char.color }}>"</span>
            </div>
          </div>

          {/* Drag Hint - Enhanced */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-80 transition-all duration-300 flex items-center gap-1">
            <span className="text-[8px] font-mono uppercase tracking-wider text-gray-400">drag me</span>
            <Move className="w-4 h-4 text-gray-400 animate-bounce" />
          </div>

          {/* Bottom gradient line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${char.gradientFrom}, ${char.gradientTo})` }}
          />
        </div>
      </div>
    </div>
  );
}

export function CharacterCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    // Title entrance with split effect
    gsap.from(titleRef.current, {
      y: 150,
      opacity: 0,
      scale: 0.8,
      rotationX: 30,
      duration: 1.4,
      ease: "power4.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Title words stagger
    gsap.from(".char-title-word", {
      y: 80,
      opacity: 0,
      rotationZ: (i) => (i % 2 === 0 ? -5 : 5),
      stagger: 0.1,
      duration: 1,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Multiple underlines animation
    gsap.from(".char-underline", {
      scaleX: 0,
      transformOrigin: "left center",
      stagger: 0.15,
      duration: 0.8,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // Subtitle with glitch effect
    gsap.from(".char-subtitle", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    // Batch animate cards on scroll with dramatic entrance
    ScrollTrigger.batch(".character-card", {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 200,
          opacity: 0,
          scale: 0.6,
          rotation: (i) => (i % 2 === 0 ? -25 : 25),
          stagger: 0.2,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)"
        });
      },
      start: "top 92%",
      once: true
    });

    // Background text parallax - enhanced
    gsap.to(".char-bg-text-1", {
      x: -200,
      rotation: 15,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    gsap.to(".char-bg-text-2", {
      x: 200,
      rotation: -8,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    gsap.to(".char-bg-text-3", {
      x: -150,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 2
      }
    });

    // Floating orbs animation
    gsap.to(".char-orb", {
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
    <section ref={sectionRef} className="py-40 md:py-56 px-4 bg-[#0d0d0d] relative overflow-hidden">

      {/* Gradient background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#ff5e00]/5 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#ff00c3]/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#7c3aed]/3 blur-[200px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
             backgroundSize: "60px 60px"
           }} />

      {/* Background Graffiti - Enhanced */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="char-bg-text-1 absolute top-16 -left-32 font-gothic text-[20vw] text-white/[0.04] rotate-12 whitespace-nowrap tracking-tighter">
          FRIENDS?
        </span>
        <span className="char-bg-text-2 absolute bottom-24 -right-32 font-gothic text-[16vw] text-white/[0.04] -rotate-6 whitespace-nowrap tracking-tight">
          ABSOLUTELY NOT.
        </span>
        <span className="char-bg-text-3 absolute top-1/2 -left-20 font-syne font-black text-[12vw] text-[#ff00c3]/[0.03] rotate-90 whitespace-nowrap">
          CHAOS
        </span>
      </div>

      {/* Floating decorative orbs */}
      <div className="char-orb absolute top-32 left-[10%] w-4 h-4 rounded-full bg-[#ff5e00]/30 blur-sm" />
      <div className="char-orb absolute top-48 right-[15%] w-6 h-6 rounded-full bg-[#ff00c3]/20 blur-sm" />
      <div className="char-orb absolute bottom-40 left-[20%] w-3 h-3 rounded-full bg-[#dbf226]/30 blur-sm" />
      <div className="char-orb absolute bottom-60 right-[25%] w-5 h-5 rounded-full bg-[#04d9ff]/20 blur-sm" />
      <div className="char-orb absolute top-1/3 left-[5%] w-2 h-2 rounded-full bg-[#7c3aed]/40 blur-sm" />

      {/* Diagonal accent lines */}
      <div className="absolute top-0 right-0 w-[2px] h-[400px] bg-gradient-to-b from-[#ff5e00]/30 to-transparent transform rotate-[30deg] origin-top-right" />
      <div className="absolute bottom-0 left-0 w-[2px] h-[300px] bg-gradient-to-t from-[#ff00c3]/30 to-transparent transform -rotate-[30deg] origin-bottom-left" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 md:mb-36 relative" style={{ perspective: "1000px" }}>
          {/* Decorative badge above title */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#dbf226] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Meet the cast</span>
            <span className="w-2 h-2 rounded-full bg-[#ff00c3] animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          <h2 ref={titleRef} className="font-syne font-black text-5xl md:text-7xl lg:text-9xl text-white uppercase relative z-10 leading-[0.9]">
            <span className="char-title-word inline-block">The</span>{" "}
            <span className="char-title-word inline-block relative">
              <span className="text-[#dbf226]">Nightmare</span>
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-[#dbf226]/20 transform -rotate-1" />
            </span>
            <br/>
            <span className="char-title-word inline-block relative">
              <span className="text-[#ff00c3]">Rotation</span>
              {/* Decorative star */}
              <svg className="absolute -top-4 -right-8 w-8 h-8 text-[#ff5e00] animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15,9 22,9 17,14 19,22 12,18 5,22 7,14 2,9 9,9" />
              </svg>
            </span>
          </h2>

          {/* Multiple Decorative Underlines */}
          <div className="flex justify-center gap-3 mt-8">
            <div className="char-underline w-32 md:w-48 h-2 md:h-3 bg-[#ff5e00] transform -rotate-2" />
            <div className="char-underline w-16 md:w-24 h-2 md:h-3 bg-[#ff00c3] transform rotate-1" />
            <div className="char-underline w-8 md:w-12 h-2 md:h-3 bg-[#dbf226] transform -rotate-3" />
          </div>

          <p className="char-subtitle mt-10 font-mono text-white/40 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            <span className="text-[#dbf226]">(</span>
            Drag them around. They're surprisingly tolerant.
            <span className="text-[#ff00c3]">)</span>
          </p>

          {/* Decorative brackets */}
          <div className="absolute top-1/2 -left-4 md:left-8 -translate-y-1/2 text-8xl md:text-[12rem] font-gothic text-white/[0.03] select-none">[</div>
          <div className="absolute top-1/2 -right-4 md:right-8 -translate-y-1/2 text-8xl md:text-[12rem] font-gothic text-white/[0.03] select-none">]</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 md:gap-12 lg:gap-8">
          {characters.map((char, i) => (
            <CharacterCard key={char.name} char={char} index={i} />
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="flex justify-center items-center gap-4 mt-24">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-white/20 text-2xl">&#10038;</span>
          <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </section>
  );
}
