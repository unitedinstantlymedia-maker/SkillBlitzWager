import React, { useMemo, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere, Box, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface ChessPieceProps {
  type: string;
  color: 'w' | 'b';
  position: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
}

// Materials
const WHITE_MATERIAL = new THREE.MeshStandardMaterial({ color: '#f0d9b5', roughness: 0.3, metalness: 0.1 }); // Cream
const BLACK_MATERIAL = new THREE.MeshStandardMaterial({ color: '#2c2c2c', roughness: 0.3, metalness: 0.2 }); // Charcoal

export function ChessPiece({ type, color, position, onClick, isSelected }: ChessPieceProps) {
  const material = color === 'w' ? WHITE_MATERIAL : BLACK_MATERIAL;
  
  // Smooth position animation
  const { pos } = useSpring({
    pos: position,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  // Smooth selection lift
  const { lift } = useSpring({
    lift: isSelected ? 0.5 : 0,
    config: { tension: 200, friction: 20 }
  });

  const renderGeometry = () => {
    const t = color === 'w' ? type.toUpperCase() : type.toLowerCase(); // Normalized type check if needed, but 'type' is usually passed correctly
    const pieceType = type.toLowerCase();

    switch (pieceType) {
      case 'p': // Pawn
        return (
          <group scale={0.7}>
            <Cylinder args={[0.3, 0.4, 0.2, 32]} position={[0, 0.1, 0]} material={material} /> {/* Base */}
            <Cone args={[0.25, 0.8, 32]} position={[0, 0.6, 0]} material={material} /> {/* Body */}
            <Sphere args={[0.25, 32, 32]} position={[0, 0.9, 0]} material={material} /> {/* Head */}
          </group>
        );
      case 'r': // Rook
        return (
          <group scale={0.8}>
            <Cylinder args={[0.35, 0.45, 0.2, 32]} position={[0, 0.1, 0]} material={material} /> {/* Base */}
            <Cylinder args={[0.3, 0.3, 0.8, 32]} position={[0, 0.6, 0]} material={material} /> {/* Body */}
            <Cylinder args={[0.35, 0.35, 0.3, 32]} position={[0, 1.15, 0]} material={material} /> {/* Top */}
            {/* Crenellations could be texture or cuts, simplified here */}
          </group>
        );
      case 'n': // Knight
        return (
          <group scale={0.8}>
            <Cylinder args={[0.35, 0.45, 0.2, 32]} position={[0, 0.1, 0]} material={material} /> {/* Base */}
            <Cylinder args={[0.3, 0.35, 0.6, 32]} position={[0, 0.5, 0]} material={material} /> {/* Body */}
            {/* Horse Head approximation */}
            <Box args={[0.3, 0.5, 0.6]} position={[0, 1.0, 0.1]} material={material} rotation={[0.2, 0, 0]} /> 
            <Box args={[0.28, 0.2, 0.4]} position={[0, 1.25, 0.3]} material={material} rotation={[0.5, 0, 0]} /> {/* Snout */}
          </group>
        );
      case 'b': // Bishop
        return (
          <group scale={0.85}>
            <Cylinder args={[0.35, 0.45, 0.2, 32]} position={[0, 0.1, 0]} material={material} /> {/* Base */}
            <Cylinder args={[0.25, 0.35, 0.9, 32]} position={[0, 0.65, 0]} material={material} /> {/* Body */}
            <Sphere args={[0.25, 32, 32]} position={[0, 1.15, 0]} scale={[1, 1.4, 1]} material={material} /> {/* Mitre */}
            <Sphere args={[0.08, 16, 16]} position={[0, 1.55, 0]} material={material} /> {/* Top Knob */}
          </group>
        );
      case 'q': // Queen
        return (
          <group scale={0.9}>
            <Cylinder args={[0.4, 0.5, 0.2, 32]} position={[0, 0.1, 0]} material={material} /> {/* Base */}
            <Cylinder args={[0.3, 0.4, 1.1, 32]} position={[0, 0.75, 0]} material={material} /> {/* Body */}
            <Cylinder args={[0.4, 0.1, 0.2, 32]} position={[0, 1.4, 0]} material={material} /> {/* Collar */}
            <Sphere args={[0.3, 32, 32]} position={[0, 1.6, 0]} material={material} /> {/* Crown Base */}
            <Sphere args={[0.1, 16, 16]} position={[0, 1.95, 0]} material={material} /> {/* Top */}
          </group>
        );
      case 'k': // King
        return (
          <group scale={0.95}>
             <Cylinder args={[0.4, 0.5, 0.2, 32]} position={[0, 0.1, 0]} material={material} /> {/* Base */}
             <Cylinder args={[0.3, 0.4, 1.2, 32]} position={[0, 0.8, 0]} material={material} /> {/* Body */}
             <Cylinder args={[0.4, 0.2, 0.2, 32]} position={[0, 1.5, 0]} material={material} /> {/* Collar */}
             <Box args={[0.15, 0.4, 0.15]} position={[0, 1.8, 0]} material={material} /> {/* Cross V */}
             <Box args={[0.35, 0.15, 0.15]} position={[0, 1.85, 0]} material={material} /> {/* Cross H */}
          </group>
        );
      default:
        return <Sphere args={[0.3]} material={material} />;
    }
  };

  return (
    <animated.group 
      position={pos.to((x, y, z) => [x, y, z])} // Base position from logic
      // Add lift based on selection
      // We can modify the Y in the 'pos' interpolation or add a separate group.
      // Let's use separate group for lift to avoid conflict
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <animated.group position-y={lift}>
         {renderGeometry()}
         
         {/* Subtle Selection Highlight (Base Ring) */}
         {isSelected && (
           <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <ringGeometry args={[0.45, 0.5, 32]} />
             <meshBasicMaterial color="#4ade80" opacity={0.6} transparent toneMapped={false} />
           </mesh>
         )}
      </animated.group>
    </animated.group>
  );
}
