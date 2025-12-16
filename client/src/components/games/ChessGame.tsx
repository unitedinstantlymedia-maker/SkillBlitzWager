import { useState, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useGame } from "@/context/GameContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/card";

export function ChessGame({ onFinish }: { onFinish: (result: 'win' | 'loss' | 'draw') => void }) {
  const { t } = useLanguage();
  const { state } = useGame();
  
  // Initialize chess instance
  const [game, setGame] = useState(new Chess());
  
  // Channel for P2P sync (simulating sockets)
  // Use a unique channel per match if possible, but global is fine for prototype
  const channel = useMemo(() => new BroadcastChannel('chess_sync_channel'), []);

  // Listen for moves from other tabs
  useEffect(() => {
    channel.onmessage = (event) => {
      const { type, fen } = event.data;
      if (type === 'move') {
        const newGame = new Chess(fen);
        setGame(newGame);
        checkGameOver(newGame, false); // Check game over but don't broadcast result again if handled
      } else if (type === 'reset') {
        setGame(new Chess());
      }
    };

    return () => {
      channel.close();
    };
  }, [channel]);

  // Check game over conditions
  const checkGameOver = (currentGame: Chess, isMyMove: boolean) => {
    if (currentGame.isGameOver()) {
      // Small delay to let the move animation finish
      setTimeout(() => {
        if (currentGame.isCheckmate()) {
          // Determine winner based on who just moved
          // If I just moved (isMyMove = true), and it's checkmate, I won.
          // If I received the move (isMyMove = false), and it's checkmate, I lost.
          if (isMyMove) {
             onFinish('win');
          } else {
             onFinish('loss');
          }
        } else if (currentGame.isDraw() || currentGame.isStalemate() || currentGame.isThreefoldRepetition() || currentGame.isInsufficientMaterial()) {
          onFinish('draw');
        } else {
          onFinish('draw');
        }
      }, 500);
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const gameCopy = new Chess(game.fen());
      
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (move === null) return false; // Illegal move

      setGame(gameCopy);
      
      // Broadcast move
      channel.postMessage({
        type: 'move',
        fen: gameCopy.fen(),
        move: move
      });

      checkGameOver(gameCopy, true);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <Card className="p-1 bg-black/40 border-primary/20 shadow-[0_0_30px_rgba(0,255,0,0.1)] backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="w-full aspect-square">
          {/* @ts-ignore - position prop exists in react-chessboard but types might be mismatching */}
          <Chessboard 
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation="white"
            customDarkSquareStyle={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
            customLightSquareStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)', // Neon green glow
            }}
          />
        </div>
      </Card>
      
      <div className="text-center space-y-2">
        <div className="text-xl font-display font-bold uppercase tracking-widest text-white h-8">
          {game.isCheck() ? (
             <span className="text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">{t('CHECK!', 'CHECK!')}</span>
          ) : (
             <span className={game.turn() === 'w' ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-white/50"}>
               {game.turn() === 'w' ? t("White's Turn", "White's Turn") : t("Black's Turn", "Black's Turn")}
             </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {t('Live 1v1 Match', 'Live 1v1 Match')}
        </div>
      </div>
    </div>
  );
}
