import { useGame } from "@/context/GameContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Result() {
  const { state, dispatch } = useGame();
  const [, setLocation] = useLocation();

  const result = state.currentMatch?.result;
  const isWin = result === 'win';
  const payout = state.currentMatch?.payout || 0;

  useEffect(() => {
    if (!state.currentMatch?.result) {
      setLocation('/');
    }
  }, [state.currentMatch, setLocation]);

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_MATCH' });
    setLocation('/lobby');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        {isWin ? (
          <div className="relative">
             <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
             <Trophy className="h-24 w-24 text-primary drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]" />
          </div>
        ) : (
          <XCircle className="h-24 w-24 text-destructive opacity-80" />
        )}
        
        <h1 className={`text-5xl font-display font-bold uppercase tracking-tighter ${isWin ? 'text-primary text-glow' : 'text-muted-foreground'}`}>
          {isWin ? 'Victory' : 'Defeat'}
        </h1>
      </motion.div>

      <Card className="w-full bg-card/50 border-white/10 p-6 space-y-4 backdrop-blur-sm">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Payout</p>
          <p className={`text-3xl font-mono font-bold ${isWin ? 'text-white' : 'text-muted-foreground'}`}>
            {payout.toFixed(4)} {state.selectedAsset}
          </p>
        </div>
        
        {isWin && (
          <div className="pt-4 border-t border-white/10 text-xs text-muted-foreground flex justify-between">
            <span>Fee (3%) deducted</span>
            <span>{state.currentMatch?.fee?.toFixed(4)} {state.selectedAsset}</span>
          </div>
        )}
      </Card>

      <div className="w-full space-y-4">
        <Button 
          onClick={handlePlayAgain}
          className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90"
        >
          Play Again
        </Button>
        
        <Link href="/">
          <Button variant="ghost" className="w-full text-muted-foreground hover:text-white">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
