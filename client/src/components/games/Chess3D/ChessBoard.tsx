import React from 'react';
import { Text } from '@react-three/drei';

interface ChessBoardProps {
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  possibleMoves: string[];
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function ChessBoard({ onSquareClick, selectedSquare, possibleMoves }: ChessBoardProps) {
  const squares = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isBlack = (r + c) % 2 === 1;
      const file = FILES[c];
      const rank = RANKS[r];
      const squareName = `${file}${rank}`;
      
      const isSelected = selectedSquare === squareName;
      const isPossibleMove = possibleMoves.includes(squareName);

      // Position: centered at 0,0. Each square is 1 unit.
      // x: c - 3.5
      // z: -(r - 3.5)  (Chess ranks go 1-8 up, 3D Z usually goes down/forward)
      // Let's align Rank 1 to positive Z or negative Z?
      // Typically White is at Rank 1. Let's place Rank 1 at Z = 3.5 (closest to camera if camera is at +Z)
      // So Rank 0 (in loop) -> '1' -> z = 3.5
      // Rank 7 -> '8' -> z = -3.5
      
      const x = c - 3.5;
      const z = -(r - 3.5); 

      squares.push(
        <group key={squareName} position={[x, 0, z]}>
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            onClick={(e) => { e.stopPropagation(); onSquareClick(squareName); }}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial 
              color={
                isSelected ? '#ffff00' : 
                isPossibleMove ? (isBlack ? '#1a4d1a' : '#2e8b2e') : // Highlight possible moves green
                (isBlack ? '#111111' : '#222222')
              } 
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
          
          {/* Rank/File Labels on edges */}
          {r === 0 && (
             <Text position={[0, 0.01, 0.6]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
               {file}
             </Text>
          )}
          {c === 0 && (
             <Text position={[-0.6, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
               {rank}
             </Text>
          )}

          {/* Move Indicator Dot */}
          {isPossibleMove && (
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI/2, 0, 0]}>
               <circleGeometry args={[0.2, 32]} />
               <meshBasicMaterial color="rgba(0, 255, 0, 0.5)" transparent opacity={0.5} />
            </mesh>
          )}
        </group>
      );
    }
  }

  return <group>{squares}</group>;
}
