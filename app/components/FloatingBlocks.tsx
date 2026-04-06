"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useRef, useMemo } from "react";

type ModuleDef = {
  position: [number, number, number];
  color: string;
  emissive: string;
  type: "camera" | "mic" | "board" | "vibe" | "led" | "heart" | "thermo" | "eye";
  scale: number;
  floatSpeed: number;
  floatIntensity: number;
  rotationSpeed: number;
};

const modules: ModuleDef[] = [
  { position: [-4.5, 2.5, -2], color: "#a78bfa", emissive: "#7c3aed", type: "camera", scale: 0.45, floatSpeed: 1.2, floatIntensity: 1, rotationSpeed: 0.3 },
  { position: [4.2, 2, -1], color: "#06b6d4", emissive: "#0891b2", type: "mic", scale: 0.4, floatSpeed: 1.5, floatIntensity: 0.8, rotationSpeed: 0.4 },
  { position: [-3, -1.5, -3], color: "#f472b6", emissive: "#db2777", type: "board", scale: 0.5, floatSpeed: 0.8, floatIntensity: 1.2, rotationSpeed: 0.2 },
  { position: [3.5, -1.8, -2], color: "#34d399", emissive: "#059669", type: "vibe", scale: 0.35, floatSpeed: 2, floatIntensity: 0.6, rotationSpeed: 0.5 },
  { position: [0, 3, -4], color: "#fbbf24", emissive: "#d97706", type: "led", scale: 0.4, floatSpeed: 1, floatIntensity: 1.5, rotationSpeed: 0.35 },
  { position: [-5, 0, -3], color: "#f87171", emissive: "#dc2626", type: "heart", scale: 0.38, floatSpeed: 1.3, floatIntensity: 0.9, rotationSpeed: 0.25 },
  { position: [5, 0.5, -2], color: "#60a5fa", emissive: "#2563eb", type: "thermo", scale: 0.35, floatSpeed: 1.1, floatIntensity: 1.1, rotationSpeed: 0.3 },
  { position: [-1.5, -2.5, -2], color: "#c084fc", emissive: "#9333ea", type: "eye", scale: 0.42, floatSpeed: 0.9, floatIntensity: 1.3, rotationSpeed: 0.2 },
];

function ModuleShape({ def }: { def: ModuleDef }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * def.rotationSpeed;
      ref.current.rotation.x += delta * def.rotationSpeed * 0.3;
    }
  });

  const mat = (
    <meshStandardMaterial
      color={def.color}
      emissive={def.emissive}
      emissiveIntensity={0.4}
      metalness={0.7}
      roughness={0.25}
      transparent
      opacity={0.85}
    />
  );

  return (
    <Float speed={def.floatSpeed} floatIntensity={def.floatIntensity} rotationIntensity={0.3}>
      <group ref={ref} position={def.position} scale={def.scale}>
        {def.type === "camera" && <CameraModule mat={mat} />}
        {def.type === "mic" && <MicModule mat={mat} />}
        {def.type === "board" && <BoardModule mat={mat} />}
        {def.type === "vibe" && <VibeModule mat={mat} />}
        {def.type === "led" && <LedModule mat={mat} />}
        {def.type === "heart" && <HeartModule mat={mat} />}
        {def.type === "thermo" && <ThermoModule mat={mat} />}
        {def.type === "eye" && <EyeModule mat={mat} />}
      </group>
    </Float>
  );
}

// Camera: box body + cylinder lens
function CameraModule({ mat }: { mat: React.ReactNode }) {
  return (
    <group>
      <mesh>{mat}<boxGeometry args={[1.4, 1, 0.8]} /></mesh>
      <mesh position={[0, 0, 0.55]}>{mat}<cylinderGeometry args={[0.3, 0.35, 0.4, 16]} /><meshStandardMaterial color="#1e1e2e" metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[0, 0, 0.75]}>{mat}<ringGeometry args={[0.15, 0.28, 16]} /><meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.8} /></mesh>
    </group>
  );
}

// Microphone: cylinder body + sphere top
function MicModule({ mat }: { mat: React.ReactNode }) {
  return (
    <group>
      <mesh>{mat}<cylinderGeometry args={[0.25, 0.3, 1.2, 16]} /></mesh>
      <mesh position={[0, 0.75, 0]}>{mat}<sphereGeometry args={[0.35, 16, 16]} /></mesh>
      <mesh position={[0, -0.7, 0]}>{mat}<cylinderGeometry args={[0.4, 0.4, 0.15, 16]} /></mesh>
    </group>
  );
}

// Circuit board: flat box with small components on top
function BoardModule({ mat }: { mat: React.ReactNode }) {
  return (
    <group>
      <mesh>{mat}<boxGeometry args={[2, 0.1, 1.4]} /></mesh>
      {/* Chip */}
      <mesh position={[0.3, 0.15, 0]}><boxGeometry args={[0.5, 0.15, 0.5]} /><meshStandardMaterial color="#1e1e2e" metalness={0.8} roughness={0.2} /></mesh>
      {/* Capacitors */}
      <mesh position={[-0.5, 0.12, 0.3]}><cylinderGeometry args={[0.08, 0.08, 0.2, 8]} /><meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[-0.5, 0.12, -0.3]}><cylinderGeometry args={[0.08, 0.08, 0.2, 8]} /><meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} /></mesh>
      {/* LED indicator */}
      <mesh position={[0.7, 0.1, -0.4]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} /></mesh>
      {/* Traces */}
      <mesh position={[0, 0.06, 0]}><boxGeometry args={[1.8, 0.01, 0.02]} /><meshStandardMaterial color="#d4a44a" metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[0, 0.06, 0.5]}><boxGeometry args={[1.4, 0.01, 0.02]} /><meshStandardMaterial color="#d4a44a" metalness={0.9} roughness={0.1} /></mesh>
    </group>
  );
}

// Vibration motor: cylinder with offset weight
function VibeModule({ mat }: { mat: React.ReactNode }) {
  const weightRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (weightRef.current) {
      weightRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 12) * 0.15;
    }
  });
  return (
    <group>
      <mesh>{mat}<cylinderGeometry args={[0.4, 0.4, 1, 16]} /></mesh>
      <mesh ref={weightRef} position={[0, 0.55, 0]}><torusGeometry args={[0.3, 0.1, 8, 16, Math.PI]} />{mat}</mesh>
      <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.15, 0.15, 0.2, 8]} /><meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} /></mesh>
    </group>
  );
}

// LED strip: elongated box with glowing dots
function LedModule({ mat }: { mat: React.ReactNode }) {
  const colors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7"];
  return (
    <group>
      <mesh>{mat}<boxGeometry args={[2.5, 0.2, 0.4]} /></mesh>
      {colors.map((c, i) => (
        <mesh key={i} position={[-1 + i * 0.5, 0.15, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  );
}

// Heart rate sensor: rounded box with green LED ring
function HeartModule({ mat }: { mat: React.ReactNode }) {
  return (
    <group>
      <mesh>{mat}<boxGeometry args={[1.2, 0.3, 1.2]} /></mesh>
      {/* Rounded top */}
      <mesh position={[0, 0.2, 0]}>{mat}<sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      {/* Green sensor LED */}
      <mesh position={[0, -0.18, 0]}>
        <ringGeometry args={[0.15, 0.25, 16]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#1e1e2e" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Thermometer: capsule shape
function ThermoModule({ mat }: { mat: React.ReactNode }) {
  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <mesh>{mat}<capsuleGeometry args={[0.2, 1, 8, 16]} /></mesh>
      <mesh position={[0, -0.55, 0.01]}>{mat}<sphereGeometry args={[0.3, 16, 16]} /></mesh>
      {/* Mercury line */}
      <mesh position={[0, 0.1, 0.22]}>
        <boxGeometry args={[0.06, 0.6, 0.01]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

// Eye / vision: sphere with iris
function EyeModule({ mat }: { mat: React.ReactNode }) {
  return (
    <group>
      <mesh><sphereGeometry args={[0.6, 24, 24]} /><meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.55]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.6]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#a78bfa" />
      <directionalLight position={[-5, 3, 3]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, -3, 4]} intensity={0.6} color="#f472b6" />
      {modules.map((m, i) => (
        <ModuleShape key={i} def={m} />
      ))}
    </>
  );
}

export function FloatingBlocks() {
  return (
    <div className="pointer-events-none absolute inset-0 h-[900px] overflow-hidden" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
