import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function Model(props: any) {
  const { scene } = useGLTF('/chess3d/chess-polycam-glb/source/Polycam auto shoot .glb');
  return <primitive object={scene} {...props} />;
}

export function Chess3DBoard() {
  return (
    <div className="w-full h-full relative bg-gradient-to-b from-black/80 to-black/40">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs uppercase tracking-widest font-mono">Loading 3D Board...</span>
          </div>
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 8, 8], fov: 45 }}>
          <fog attach="fog" args={['#000000', 10, 50]} />
          
          <Stage environment="city" intensity={0.5} shadows="contact" adjustCamera={1.2}>
            <Model scale={1} />
          </Stage>
          
          <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={40} blur={2} far={4.5} />
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 2.5}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
      
      {/* Overlay info */}
      <div className="absolute bottom-24 left-0 right-0 text-center pointer-events-none z-10">
        <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Interactive 3D Preview • Drag to Rotate</p>
      </div>
    </div>
  );
}

// Preload the model for smoother initial render
useGLTF.preload('/chess3d/chess-polycam-glb/source/Polycam auto shoot .glb');
