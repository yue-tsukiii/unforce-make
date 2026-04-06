"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useGLTF, Center } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

function StlModel() {
  const geometry = useLoader(STLLoader, "/logo.stl");
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry} scale={0.012}>
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c3aed"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </Center>
  );
}

export function Logo3D() {
  return (
    <div className="h-32 w-32">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#a78bfa" />
        <directionalLight position={[-3, -2, 4]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[0, 3, 3]} intensity={0.8} color="#f472b6" />
        <Suspense fallback={null}>
          <StlModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
