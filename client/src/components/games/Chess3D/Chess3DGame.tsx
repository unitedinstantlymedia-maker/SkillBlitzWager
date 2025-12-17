import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, ContactShadows, SoftShadows, BakeShadows } from '@react-three/drei';
import { Chess, Move } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { ChessPiece } from './ChessPiece';
import { Loader2 } from 'lucide-react';

interface Chess3DGameProps {
  onFinish?: (result: 'win' | 'loss' | 'draw') => void;
}

export function Chess3DGame({ onFinish }: Chess3DGameProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Update possible moves when selection changes
  useEffect(() => {
    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare as any, verbose: true }) as Move[];
      setPossibleMoves(moves.map(m => m.to));
    } else {
      setPossibleMoves([]);
    }
  }, [selectedSquare, game]);

  const handleSquareClick = (square: string) => {
    // If a square is selected and the clicked square is a valid move
    if (selectedSquare && possibleMoves.includes(square)) {
      try {
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', 
        });

        if (move) {
          setGame(gameCopy);
          setSelectedSquare(null);
          
          if (gameCopy.isGameOver()) {
            if (gameCopy.isCheckmate()) {
               onFinish?.(gameCopy.turn() === 'w' ? 'loss' : 'win');
            } else {
               onFinish?.('draw');
            }
          }
        }
      } catch (e) {
        console.error("Invalid move", e);
        setSelectedSquare(null);
      }
    } else {
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      } else {
        setSelectedSquare(null);
      }
    }
  };

  const pieces = useMemo(() => {
    const p: React.ReactNode[] = [];
    const board = game.board();
    
    // Board logic recap:
    // r=0 in chess.js board() is Rank 8.
    // r=7 is Rank 1.
    // In ChessBoard.tsx, I mapped Rank 1 to z=3.5.
    // So Rank 8 (r=0) should be z = -3.5.
    // Rank 1 (r=7) should be z = 3.5.
    // Formula for z: (r - 3.5)
    // Wait.
    // r=0 -> 0-3.5 = -3.5 (Rank 8, Back). Correct.
    // r=7 -> 7-3.5 = 3.5 (Rank 1, Front). Correct.
    
    board.forEach((row, r) => {
      row.forEach((piece, c) => {
        if (piece) {
          const x = c - 3.5;
          const z = (r - 3.5); 
          
          p.push(
            <ChessPiece 
              key={`${piece.type}-${piece.color}-${r}-${c}`} // Unique key but stable enough? Better to rely on square name if possible, but position changes.
              // Use square name as key to force re-mount on move? No, we want animation.
              // If we use ID tracking (chess.js doesn't give IDs), we rely on props update.
              // Actually, react-spring needs stable keys for the SAME piece moving.
              // But we are regenerating the list.
              // Simple approach: Key by square? No, then it won't animate FROM old square.
              // We need a stable ID for each piece.
              // For now, let's just render at new positions. Animation might jump if keys change.
              // To fix animation: we'd need to track piece IDs.
              // Since this is a prototype, simple position interpolation (if keys match) works.
              // But keys derived from position (r,c) will change on move.
              // So 'p' at 'a2' moving to 'a4' -> new component at 'a4'.
              // react-spring won't animate A to B if they are different components.
              // It will just unmount A and mount B.
              // To truly animate, we need a permanent list of pieces with coords.
              // I will leave "move animation" as "appearing at new spot" with smooth entry (spring on mount) for now, 
              // as full ID tracking requires complex state sync with chess.js history.
              // Wait! I can use `piece.type + piece.color + index`? No, multiple pawns.
              // Let's just stick to static placement with smooth entry for now (the pop-in effect).
              type={piece.type}
              color={piece.color}
              position={[x, 0, z]}
              isSelected={selectedSquare === `${String.fromCharCode(97+c)}${8-r}`}
              onClick={() => handleSquareClick(`${String.fromCharCode(97+c)}${8-r}`)}
            />
          );
        }
      });
    });
    return p;
  }, [game, selectedSquare]);

  return (
    <div className="w-full h-full relative bg-zinc-900">
       <Suspense fallback={
         <div className="absolute inset-0 flex items-center justify-center text-primary z-50">
           <div className="flex flex-col items-center gap-2">
             <Loader2 className="h-8 w-8 animate-spin text-white" />
             <span className="text-xs uppercase tracking-widest font-mono text-white/50">Loading Classic Chess...</span>
           </div>
         </div>
       }>
         <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 8, 6], fov: 45 }}>
           {/* Soft realistic lighting */}
           <ambientLight intensity={0.5} />
           <spotLight 
             position={[5, 10, 5]} 
             angle={0.5} 
             penumbra={1} 
             intensity={1} 
             castShadow 
             shadow-bias={-0.0001}
           />
           <Environment preset="studio" />
           
           <group position={[0, -0.5, 0]}>
             <ChessBoard 
               onSquareClick={handleSquareClick}
               selectedSquare={selectedSquare}
               possibleMoves={possibleMoves}
             />
             {pieces}
           </group>

           <ContactShadows resolution={1024} scale={20} blur={1} opacity={0.5} far={1} color="#000000" />
           <OrbitControls 
             minPolarAngle={0} 
             maxPolarAngle={Math.PI / 2.2}
             enablePan={false}
             maxDistance={15}
             minDistance={5}
           />
         </Canvas>
       </Suspense>
       
       {/* Instruction Overlay */}
       <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <p className="text-[10px] text-white/20 font-sans uppercase tracking-[0.2em]">Classic 3D View</p>
       </div>
    </div>
  );
}
