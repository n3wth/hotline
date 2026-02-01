import { Hero } from "./components/Hero";
import { CharacterCards } from "./components/CharacterCards";
import { WhatToExpect } from "./components/WhatToExpect";
import { ConversationDemo } from "./components/ConversationDemo";
import { CTA, StartupSection, Footer } from "./components/CTA";
import { FloatingStickers } from "./components/FloatingStickers";
import { EasterEggs } from "./components/EasterEggs";
import { StickyPhoneBar } from "./components/StickyPhoneBar";
import { useGameState, GameProvider } from "./hooks/useGameState";

function AppContent() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      {/* Global Effects Layer */}
      <div className="vhs-tracking" />
      <div className="scanlines" />
      <div className="noise-overlay" />

      {/* Sticky Phone Bar - Always Visible */}
      <StickyPhoneBar />

      {/* Game UI Elements */}
      <FloatingStickers />
      <EasterEggs />

      <Hero />
      <CharacterCards />
      <WhatToExpect />
      <ConversationDemo />
      <CTA />
      <StartupSection />
      <Footer />
    </main>
  );
}

function App() {
  const gameState = useGameState();

  return (
    <GameProvider value={gameState}>
      <AppContent />
    </GameProvider>
  );
}

export default App;
