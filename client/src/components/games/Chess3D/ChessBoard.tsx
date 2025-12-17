import React from 'react';
import { Text, Box } from '@react-three/drei';

interface ChessBoardProps {
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  possibleMoves: string[];
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function ChessBoard({ onSquareClick, selectedSquare, possibleMoves }: ChessBoardProps) {
  const squares = [];
  const boardSize = 8;
  const squareSize = 1;
  const offset = 3.5; // (8-1)/2

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isBlack = (r + c) % 2 === 1;
      const file = FILES[c];
      const rank = RANKS[r];
      const squareName = `${file}${rank}`;
      
      const isSelected = selectedSquare === squareName;
      const isPossibleMove = possibleMoves.includes(squareName);

      // r=0 -> Rank 1 (Back/Bottom) ? No. 
      // Usually in array: 0 is 'a1' or 'a8'.
      // If we want white at bottom (Rank 1 closest to camera):
      // Camera is usually at +Z.
      // Z increases towards camera.
      // So Rank 1 should be at +Z. Rank 8 at -Z.
      // Let's map r=0 to Rank 1.
      
      const x = c - offset;
      const z = -(r - offset); // r=0 -> z=3.5 (Front), r=7 -> z=-3.5 (Back)
      // Wait, standard loop r=0 usually means Rank 1 in my logic?
      // Let's check RANKS array. RANKS[0] is '1'.
      // So r=0 is Rank 1.
      // Position Z:
      // If r=0 (Rank 1), we want it closest to camera (+Z).
      // So z should be positive.
      // Let's use z = (3.5 - r) ? 
      // r=0 -> 3.5. r=7 -> -3.5. Correct.
      
      // Fix Z logic:
      // r=0 (Rank 1) -> z = 3.5
      // r=7 (Rank 8) -> z = -3.5
      // Correct formula: (3.5 - r)
      
      const posX = c - offset;
      const posZ = 3.5 - r;

      const color = isBlack ? '#769656' : '#eeeed2'; // Classic Green/Beige or Wood colors?
      // User asked for "classic coordinate letters... alternating light/dark".
      // Let's use a nice wood/dark theme or standard tournament green/white.
      // "Wood or black edge".
      // Let's use standard tournament colors: #769656 (Green) and #eeeed2 (Cream) are very standard.
      // Or Wood: Dark #b58863, Light #f0d9b5.
      // Let's go with Wood as requested "Realistic/Classic".
      const woodDark = '#b58863';
      const woodLight = '#f0d9b5';
      
      squares.push(
        <group key={squareName} position={[posX, 0, posZ]}>
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            onClick={(e) => { e.stopPropagation(); onSquareClick(squareName); }}
            receiveShadow
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial 
              color={isBlack ? woodDark : woodLight} 
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          
          {/* Highlight for Move */}
          {isPossibleMove && (
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
               {/* Classic: Just a small dot or subtle marker */}
               {/* If piece on it? Ring. If empty? Dot. */}
               {/* Simplified: Circle for now */}
               <circleGeometry args={[0.15, 32]} />
               <meshBasicMaterial color="rgba(0, 0, 0, 0.2)" transparent />
            </mesh>
          )}

          {/* Selected Square Highlight */}
          {isSelected && (
             <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
               <planeGeometry args={[1, 1]} />
               <meshBasicMaterial color="#bbcb2b" transparent opacity={0.5} />
             </mesh>
          )}
        </group>
      );
    }
  }

  // Border / Frame
  const frameThickness = 0.5;
  const boardWidth = 8;
  const totalWidth = boardWidth + frameThickness * 2;
  
  return (
    <group>
       {/* Main Board Squares */}
       <group>{squares}</group>
       
       {/* Wooden Frame */}
       <mesh position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[totalWidth, 0.5, totalWidth]} />
          <meshStandardMaterial color="#5c4033" roughness={0.8} />
       </mesh>

       {/* Coordinates */}
       {FILES.map((f, i) => (
         <Text 
            key={`file-${f}`} 
            position={[i - 3.5, 0.01, 4.2]} 
            rotation={[-Math.PI/2, 0, 0]} 
            fontSize={0.25} 
            color="#f0d9b5"
         >
           {f}
         </Text>
       ))}
       {RANKS.map((r, i) => (
         <Text 
            key={`rank-${r}`} 
            position={[-4.2, 0.01, 3.5 - i]} 
            rotation={[-Math.PI/2, 0, 0]} 
            fontSize={0.25} 
            color="#f0d9b5"
         >
           {r}
         </Text>
       ))}
    </group>
  );
}
