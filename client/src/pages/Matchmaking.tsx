import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { useLocation } from "wouter";
import { Loader2, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Matchmaking() {
  const { state, dispatch } = useGame();
  const [, setLocation] = useLocation();
  const [statusText, setStatusText] = useState("Searching for opponent...");

  useEffect(() => {
    if (!state.currentMatch) {
      setLocation('/lobby');
      return;
    }

    const timer1 = setTimeout(() => setStatusText("Matching skill level..."), 1500);
    const timer2 = setTimeout(() => setStatusText("Verifying funds..."), 3000);
    
    const timer3 = setTimeout(() => {
      dispatch({ type: 'FOUND_OPPONENT', payload: { opponent: '0x83B...29C1' } });
      setLocation(`/play/${state.selectedGame?.toLowerCase()}`);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [state.currentMatch, dispatch, setLocation, state.selectedGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="relative bg-card border border-primary/50 rounded-full p-8 shadow-[0_0_30px_rgba(57,255,20,0.3)]">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
      </div>

      <motion.div
        key={statusText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-display font-bold uppercase tracking-wider">{statusText}</h2>
        <p className="text-muted-foreground font-mono text-sm">
          {state.selectedGame} • {state.stakeAmount} {state.selectedAsset}
        </p>
      </motion.div>

      <div className="flex gap-8 items-center opacity-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-mono">You</span>
        </div>
        <span className="font-display text-xl text-muted-foreground">VS</span>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/10">
            <span className="text-xs">?</span>
          </div>
          <span className="text-xs font-mono">Opponent</span>
        </div>
      </div>
    </div>
  );
}
