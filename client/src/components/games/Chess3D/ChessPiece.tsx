import React from 'react';
import { Text, Float } from '@react-three/drei';

// Mapping chess piece types to unicode symbols
const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟',
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
  P: '♙',
  R: '♖',
  N: '♘',
  B: '♗',
  Q: '♕',
  K: '♔'
};

interface ChessPieceProps {
  type: string;
  color: 'w' | 'b';
  position: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
}

export function ChessPiece({ type, color, position, onClick, isSelected }: ChessPieceProps) {
  const symbol = PIECE_SYMBOLS[color === 'w' ? type.toUpperCase() : type.toLowerCase()] || '?';
  
  const pieceColor = color === 'w' ? '#00ffcc' : '#ff00ff'; 
  const emissiveColor = color === 'w' ? '#004433' : '#440044';

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[0, 0.1]}>
        {/* Use Text instead of Text3D to avoid font file requirements */}
        <Text
          fontSize={0.8}
          color={isSelected ? '#ffffff' : pieceColor}
          anchorX="center"
          anchorY="middle"
          position={[0, 0.4, 0]}
          outlineWidth={0.05}
          outlineColor={emissiveColor}
        >
          {symbol}
        </Text>
        
        {/* Simple base for the piece */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 32]} />
          <meshStandardMaterial 
            color={pieceColor} 
            emissive={emissiveColor}
            emissiveIntensity={0.5}
            roughness={0.2} 
            metalness={0.8} 
          />
        </mesh>
      </Float>
      
      {/* Selection Highlight Ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="white" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
