import { useState, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const pieceImages: Record<string, string> = {
  wK: "/chess-pieces/wK.svg",
  wQ: "/chess-pieces/wQ.svg",
  wR: "/chess-pieces/wR.svg",
  wB: "/chess-pieces/wB.svg",
  wN: "/chess-pieces/wN.svg",
  wP: "/chess-pieces/wP.svg",
  bK: "/chess-pieces/bK.svg",
  bQ: "/chess-pieces/bQ.svg",
  bR: "/chess-pieces/bR.svg",
  bB: "/chess-pieces/bB.svg",
  bN: "/chess-pieces/bN.svg",
  bP: "/chess-pieces/bP.svg",
};

export function ChessGame({ onFinish }: { onFinish: (result: 'win' | 'loss' | 'draw') => void }) {
  const { t } = useLanguage();
  const [game, setGame] = useState(new Chess());

  const customPieces = useMemo(() => {
    const pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
    const pieceComponents: Record<string, ({ squareWidth }: { squareWidth: number }) => any> = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <img
          src={pieceImages[piece]}
          alt={piece}
          style={{
            width: squareWidth,
            height: squareWidth,
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 1px 4px #2224)",
          }}
          draggable={false}
        />
      );
    });
    return pieceComponents;
  }, []);

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
          customPieces={customPieces as any}
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
