import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export function ChessGame({ onFinish }: { onFinish: (result: 'win' | 'loss' | 'draw') => void }) {
  const { t } = useLanguage();
  const [game, setGame] = useState(new Chess());

  // Check game over conditions
  useEffect(() => {
    if (game.isGameOver()) {
      setTimeout(() => {
        if (game.isCheckmate()) {
          // If it's checkmate, the player whose turn it is lost.
          // Since this is a local view, if it's White's turn and they are mated, Black wins.
          // We'll just trigger 'win' for the mover for now as a prototype.
          onFinish(game.turn() === 'b' ? 'win' : 'loss'); 
        } else {
          onFinish('draw');
        }
      }, 500);
    }
  }, [game, onFinish]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      });
      
      if (move === null) return false;
      
      setGame(new Chess(gameCopy.fen()));
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-in fade-in zoom-in-95 duration-500">
      <Card className="p-4 bg-black/40 border-primary/20 shadow-[0_0_30px_rgba(0,255,0,0.1)] backdrop-blur-sm rounded-xl">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={350}
          customDarkSquareStyle={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
          customLightSquareStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
          }}
        />
      </Card>
      
      <div className="text-center space-y-2 mt-6">
        <div className="text-xl font-display font-bold uppercase tracking-widest text-white h-8">
          {game.isCheck() ? (
             <span className="text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">{t('CHECK!', 'CHECK!')}</span>
          ) : (
             <span className={game.turn() === 'w' ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-white/50"}>
               {game.turn() === 'w' ? t("White's Turn", "White's Turn") : t("Black's Turn", "Black's Turn")}
             </span>
          )}
        </div>
      </div>
    </div>
  );
}
