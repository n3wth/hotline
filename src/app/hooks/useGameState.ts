import { useState, useEffect, useCallback, createContext, useContext } from "react";

// Random character moods affect their descriptions and colors
export type CharacterMood = "chaotic" | "sassy" | "unhinged" | "sweet" | "judgy";

export interface GameState {
  chaosMeter: number; // 0-100
  visitCount: number;
  secretsFound: string[];
  currentMoods: Record<string, CharacterMood>;
  randomSeed: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  glitchIntensity: number; // 0-1
  draggedCards: Set<string>; // Track which cards have been dragged
}

// Random dialogue variants for each character
export const characterDialogues: Record<string, Record<CharacterMood, string>> = {
  Jolene: {
    chaotic: "Bless your mess. I mean heart. I mean—honey, what happened?",
    sassy: "Southern charm with a side of 'girl, please.'",
    unhinged: "I've seen things. Kitchen things. Relationship things. THINGS.",
    sweet: "Come here, baby. Let me fix your life while judging your outfit.",
    judgy: "That's... a choice. A bold choice. A wrong choice.",
  },
  Sally: {
    chaotic: "Send it. What's the worst that could happen? Don't answer that.",
    sassy: "I've made worse decisions before breakfast. You'll be fine.",
    unhinged: "Sleep is a social construct. So is overthinking.",
    sweet: "You know what? Do it. I believe in you.",
    judgy: "Even I think that's bold. And I've done some things.",
  },
  Viv: {
    chaotic: "The wine is vintage. Your problems are predictable.",
    sassy: "I'm judging you in three languages right now.",
    unhinged: "I have opinions. Strong ones. About everything. Especially you.",
    sweet: "Darling, you're a disaster... but you're MY disaster.",
    judgy: "*sips aggressively* Continue. I'm taking notes for later.",
  },
  Edward: {
    chaotic: "I do not understand but I am here? For you? Maybe?",
    sassy: "In France we have a word for this... actually, no we don't.",
    unhinged: "Perhaps the chaos is the friends we made along the way?",
    sweet: "You are doing... something? I believe in you anyway!",
    judgy: "This seems... not correct? But what do I know, I'm French.",
  },
};

// Random stickers that can appear
export const randomStickers = [
  { text: "OH NO", color: "#ff00c3" },
  { text: "NOTED", color: "#dbf226" },
  { text: "INTERESTING", color: "#04d9ff" },
  { text: "LATE NIGHT", color: "#ff5e00" },
  { text: "VALID", color: "#7c3aed" },
  { text: "RELATABLE", color: "#ff00c3" },
  { text: "HONESTY", color: "#dbf226" },
  { text: "NO FILTER", color: "#ff5e00" },
  { text: "REAL TALK", color: "#7c3aed" },
  { text: "THOUGHTS", color: "#04d9ff" },
];

// Easter egg secrets
export const secrets = [
  { id: "triple-tap", name: "Triple Tap Chaos", description: "Tapped the phone 3x" },
  { id: "drag-all", name: "Card Collector", description: "Dragged all character cards" },
  { id: "scroll-speed", name: "Speed Runner", description: "Scrolled really fast" },
  { id: "konami", name: "Old School", description: "Entered the Konami code" },
  { id: "night-owl", name: "Night Owl", description: "Visited between 2-5 AM" },
];

// Seeded random for consistent randomness per session
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomMood(seed: number): CharacterMood {
  const moods: CharacterMood[] = ["chaotic", "sassy", "unhinged", "sweet", "judgy"];
  return moods[Math.floor(seededRandom(seed) * moods.length)];
}

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage or create new
    const saved = typeof window !== "undefined" ? localStorage.getItem("hotline-game-state") : null;
    const visitCount = saved ? JSON.parse(saved).visitCount + 1 : 1;
    const seed = Date.now();

    return {
      chaosMeter: 0,
      visitCount,
      secretsFound: saved ? JSON.parse(saved).secretsFound : [],
      currentMoods: {
        Jolene: getRandomMood(seed),
        Sally: getRandomMood(seed + 1),
        Viv: getRandomMood(seed + 2),
        Edward: getRandomMood(seed + 3),
      },
      randomSeed: seed,
      timeOfDay: getTimeOfDay(),
      glitchIntensity: seededRandom(seed) * 0.3 + 0.1, // 0.1 to 0.4
      draggedCards: new Set<string>(),
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("hotline-game-state", JSON.stringify({
      visitCount: gameState.visitCount,
      secretsFound: gameState.secretsFound,
    }));
  }, [gameState.visitCount, gameState.secretsFound]);

  const addChaos = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      chaosMeter: Math.min(100, Math.max(0, prev.chaosMeter + amount)),
      glitchIntensity: Math.min(1, prev.glitchIntensity + amount * 0.005),
    }));
  }, []);

  const discoverSecret = useCallback((secretId: string) => {
    setGameState(prev => {
      if (prev.secretsFound.includes(secretId)) return prev;
      return {
        ...prev,
        secretsFound: [...prev.secretsFound, secretId],
        chaosMeter: Math.min(100, prev.chaosMeter + 15),
      };
    });
  }, []);

  const getRandomSticker = useCallback(() => {
    const index = Math.floor(seededRandom(gameState.randomSeed + gameState.chaosMeter) * randomStickers.length);
    return randomStickers[index];
  }, [gameState.randomSeed, gameState.chaosMeter]);

  const getCharacterDialogue = useCallback((name: string) => {
    const mood = gameState.currentMoods[name];
    return characterDialogues[name]?.[mood] || characterDialogues[name]?.chaotic;
  }, [gameState.currentMoods]);

  const trackCardDrag = useCallback((cardName: string) => {
    setGameState(prev => {
      const newDraggedCards = new Set(prev.draggedCards);
      newDraggedCards.add(cardName);

      // Check if all 4 cards have been dragged
      const allCharacters = ["Jolene", "Sally", "Viv", "Edward"];
      const allDragged = allCharacters.every(name => newDraggedCards.has(name));

      if (allDragged && !prev.secretsFound.includes("drag-all")) {
        return {
          ...prev,
          draggedCards: newDraggedCards,
          secretsFound: [...prev.secretsFound, "drag-all"],
          chaosMeter: Math.min(100, prev.chaosMeter + 20),
        };
      }

      return {
        ...prev,
        draggedCards: newDraggedCards,
      };
    });
  }, []);

  return {
    gameState,
    addChaos,
    discoverSecret,
    getRandomSticker,
    getCharacterDialogue,
    trackCardDrag,
  };
}

// Context for sharing game state
const GameContext = createContext<ReturnType<typeof useGameState> | null>(null);

export const GameProvider = GameContext.Provider;

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
