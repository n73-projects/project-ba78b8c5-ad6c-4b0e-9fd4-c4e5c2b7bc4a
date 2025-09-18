import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Text3D, 
  Center, 
  Float, 
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';
import toast from "react-hot-toast";
import { Button } from "./components/ui/button";

// Interactive 3D Sphere component
function InteractiveSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(hovered ? 1.2 : clicked ? 0.8 : 1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Sphere
        ref={meshRef}
        position={position}
        args={[1, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => {
          setClicked(!clicked);
          toast.success(`Sphere ${clicked ? 'deactivated' : 'activated'}!`);
        }}
      >
        <MeshDistortMaterial
          color={clicked ? '#ff6b6b' : hovered ? '#4ecdc4' : '#45b7d1'}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

// Animated rotating box
function RotatingBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
      <Box
        ref={meshRef}
        position={position}
        args={[1.5, 1.5, 1.5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => toast.success('Cube clicked!')}
      >
        <meshStandardMaterial
          color={hovered ? '#ff9f43' : '#00d2d3'}
          metalness={0.5}
          roughness={0.1}
        />
      </Box>
    </Float>
  );
}

// Animated Torus
function AnimatedTorus({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [spinning, setSpinning] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += spinning ? 0.05 : 0.01;
      meshRef.current.rotation.z += spinning ? 0.03 : 0.005;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.8} floatIntensity={0.4}>
      <Torus
        ref={meshRef}
        position={position}
        args={[1, 0.4, 16, 100]}
        onPointerDown={() => {
          setSpinning(!spinning);
          toast.success(`Torus ${spinning ? 'slowed down' : 'spinning fast'}!`);
        }}
      >
        <meshStandardMaterial
          color={spinning ? '#a55eea' : '#26de81'}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>
    </Float>
  );
}

// Scene component containing all 3D elements
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ecdc4" />
      
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* 3D Text */}
      <Center position={[0, 3, 0]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          3D Interactive
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.1} />
        </Text3D>
      </Center>

      <Center position={[0, 1.5, 0]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.6}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Website
          <meshStandardMaterial color="#4ecdc4" metalness={0.5} roughness={0.1} />
        </Text3D>
      </Center>
      
      {/* Interactive 3D objects */}
      <InteractiveSphere position={[-3, 0, 0]} />
      <RotatingBox position={[3, 0, 0]} />
      <AnimatedTorus position={[0, -2, 0]} />
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

function App() {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">
            🌟 3D Interactive Website
          </h1>
          <p className="text-gray-300 text-sm max-w-xs">
            Click and drag to rotate • Scroll to zoom • Click objects to interact
          </p>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to 3D Space!</h2>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>🖱️ <strong>Mouse/Touch:</strong> Rotate the scene</li>
              <li>🎯 <strong>Click objects:</strong> Interact with 3D elements</li>
              <li>🔍 <strong>Scroll:</strong> Zoom in and out</li>
              <li>✨ <strong>Hover:</strong> Objects respond to your cursor</li>
            </ul>
            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Start Exploring!
            </Button>
          </div>
        </div>
      )}

      {/* Bottom right controls */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        <Button
          onClick={() => setShowInstructions(true)}
          variant="secondary"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-white/10"
        >
          Help
        </Button>
        <Button
          onClick={() => toast.success("🚀 Welcome to the 3D universe!")}
          variant="secondary"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-white/10"
        >
          Toast
        </Button>
      </div>
    </div>
  );
}

export default App;
