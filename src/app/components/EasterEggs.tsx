import { useEffect, useRef, useState } from "react";
import { useGame, secrets } from "../hooks/useGameState";
import gsap from "gsap";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA"
];

export function EasterEggs() {
  const { discoverSecret, gameState, addChaos } = useGame();
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [showSecretUnlock, setShowSecretUnlock] = useState<string | null>(null);
  const unlockRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(Date.now());
  const scrollCount = useRef(0);
  const prevSecretsLength = useRef(gameState.secretsFound.length);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === KONAMI_CODE[konamiProgress]) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);

        if (newProgress === KONAMI_CODE.length) {
          if (!gameState.secretsFound.includes("konami")) {
            discoverSecret("konami");
            setShowSecretUnlock("Old School");
            triggerKonamiEffect();
          }
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiProgress, discoverSecret, gameState.secretsFound]);

  // Speed scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 100) {
        scrollCount.current++;
        if (scrollCount.current > 20 && !gameState.secretsFound.includes("scroll-speed")) {
          discoverSecret("scroll-speed");
          setShowSecretUnlock("Speed Runner");
          addChaos(10);
        }
      } else {
        scrollCount.current = 0;
      }
      lastScrollTime.current = now;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [discoverSecret, gameState.secretsFound, addChaos]);

  // Night owl detection
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 2 && hour < 5 && !gameState.secretsFound.includes("night-owl")) {
      discoverSecret("night-owl");
      setShowSecretUnlock("Night Owl");
    }
  }, [discoverSecret, gameState.secretsFound]);

  // Watch for secrets triggered from other components
  useEffect(() => {
    if (gameState.secretsFound.length > prevSecretsLength.current) {
      const newSecret = gameState.secretsFound[gameState.secretsFound.length - 1];
      const secretNames: Record<string, string> = {
        "drag-all": "Card Collector",
        "triple-tap": "Triple Tap Chaos",
        "scroll-speed": "Speed Runner",
        "konami": "Old School",
        "night-owl": "Night Owl",
      };
      if (secretNames[newSecret]) {
        setShowSecretUnlock(secretNames[newSecret]);
      }
      prevSecretsLength.current = gameState.secretsFound.length;
    }
  }, [gameState.secretsFound]);

  // Animate secret unlock popup
  useEffect(() => {
    if (showSecretUnlock && unlockRef.current) {
      gsap.fromTo(unlockRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }
      );

      const timer = setTimeout(() => {
        gsap.to(unlockRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setShowSecretUnlock(null),
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSecretUnlock]);

  // Konami code effect - screen goes wild
  const triggerKonamiEffect = () => {
    const body = document.body;

    gsap.to(body, {
      filter: "hue-rotate(180deg)",
      duration: 0.1,
    });

    gsap.to(body, {
      filter: "hue-rotate(360deg)",
      duration: 0.5,
      delay: 0.1,
    });

    gsap.to(body, {
      filter: "none",
      duration: 0.3,
      delay: 0.6,
    });

    // Spawn chaos stickers
    addChaos(30);
  };

  return (
    <>
      {/* Secret Unlock Popup */}
      {showSecretUnlock && (
        <div
          ref={unlockRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-black border-4 border-[#dbf226] p-4 shadow-[8px_8px_0px_#ff00c3]"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">&#9733;</span>
            <div>
              <p className="font-gothic text-xs text-[#dbf226] uppercase">Secret Unlocked!</p>
              <p className="font-syne font-bold text-lg text-white">{showSecretUnlock}</p>
            </div>
          </div>
        </div>
      )}

      {/* Konami progress indicator (subtle) */}
      {konamiProgress > 0 && (
        <div className="fixed top-1/2 left-4 -translate-y-1/2 z-[100]">
          <div className="flex flex-col gap-1">
            {KONAMI_CODE.slice(0, konamiProgress).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#dbf226] rounded-full"
                style={{
                  opacity: 0.3 + (i / KONAMI_CODE.length) * 0.7,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
