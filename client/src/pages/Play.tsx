import { useGame } from "@/context/GameContext";
import { useLocation } from "wouter";
import { ChessGame } from "@/components/games/ChessGame";
import { TetrisGame } from "@/components/games/TetrisGame";
import { CheckersGame } from "@/components/games/CheckersGame";
import { useEffect } from "react";

export default function Play() {
  const { state, dispatch } = useGame();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!state.currentMatch) {
      setLocation('/');
    }
  }, [state.currentMatch, setLocation]);

  const handleFinish = (result: 'win' | 'loss') => {
    dispatch({ type: 'FINISH_GAME', payload: { result } });
    setLocation('/result');
  };

  if (!state.selectedGame) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs uppercase text-muted-foreground">Live Match</span>
        </div>
        <div className="font-mono font-bold text-primary">
          Pot: {state.stakeAmount * 2} {state.selectedAsset}
        </div>
      </div>

      <div className="flex-1">
        {state.selectedGame === 'Chess' && <ChessGame onFinish={handleFinish} />}
        {state.selectedGame === 'Tetris' && <TetrisGame onFinish={handleFinish} />}
        {state.selectedGame === 'Checkers' && <CheckersGame onFinish={handleFinish} />}
      </div>
    </div>
  );
}
