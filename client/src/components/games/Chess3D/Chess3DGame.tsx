import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Stars, Environment, ContactShadows } from '@react-three/drei';
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
          promotion: 'q', // Always promote to queen for simplicity in this prototype
        });

        if (move) {
          setGame(gameCopy);
          setSelectedSquare(null);
          
          // Check game over
          if (gameCopy.isGameOver()) {
            if (gameCopy.isCheckmate()) {
               onFinish?.(gameCopy.turn() === 'w' ? 'loss' : 'win'); // If white turn, black won
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
      // Select piece if it belongs to current turn
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      } else {
        setSelectedSquare(null);
      }
    }
  };

  // Convert board state to 3D pieces
  const pieces = useMemo(() => {
    const p: React.ReactNode[] = [];
    const board = game.board();
    
    board.forEach((row, r) => {
      row.forEach((piece, c) => {
        if (piece) {
          // Convert rank/file to x,z
          // r=0 -> rank 8 (z=-3.5)
          // r=7 -> rank 1 (z=3.5)
          // c=0 -> file a (x=-3.5)
          const x = c - 3.5;
          const z = (r - 3.5); 
          
          p.push(
            <ChessPiece 
              key={`${r}-${c}-${piece.type}-${piece.color}`}
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
    <div className="w-full h-full relative bg-black">
       <Suspense fallback={
         <div className="absolute inset-0 flex items-center justify-center text-primary z-50">
           <div className="flex flex-col items-center gap-2">
             <Loader2 className="h-8 w-8 animate-spin" />
             <span className="text-xs uppercase tracking-widest font-mono">Loading 3D Chess...</span>
           </div>
         </div>
       }>
         <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 10, 5], fov: 45 }}>
           <fog attach="fog" args={['#000000', 5, 30]} />
           <Environment preset="city" />
           <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
           
           <group position={[0, -0.5, 0]}>
             <ChessBoard 
               onSquareClick={handleSquareClick}
               selectedSquare={selectedSquare}
               possibleMoves={possibleMoves}
             />
             {pieces}
             
             {/* Board Base */}
             <mesh position={[0, -0.25, 0]} receiveShadow>
               <boxGeometry args={[9, 0.5, 9]} />
               <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
             </mesh>
           </group>

           <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={20} blur={2} far={4} />
           
           <OrbitControls 
             minPolarAngle={Math.PI / 6} 
             maxPolarAngle={Math.PI / 2.5}
             enablePan={false}
           />
         </Canvas>
       </Suspense>
    </div>
  );
}
