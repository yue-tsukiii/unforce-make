"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { Suspense, useRef, useMemo } from "react";

function StlModel() {
  const geometry = useLoader(STLLoader, "/logo.stl");
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Gradient metallic shader
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#c084fc") }, // purple
        uColor2: { value: new THREE.Color("#f472b6") }, // pink
        uColor3: { value: new THREE.Color("#22d3ee") }, // cyan
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        void main() {
          // Gradient based on position + time
          float t = sin(vPosition.y * 0.02 + uTime * 0.5) * 0.5 + 0.5;
          float t2 = sin(vPosition.x * 0.015 + uTime * 0.3) * 0.5 + 0.5;
          vec3 baseColor = mix(mix(uColor1, uColor2, t), uColor3, t2 * 0.5);

          // Metallic lighting
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.0);

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);

          // Fresnel for edge glow
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);

          vec3 color = baseColor * (0.3 + diff * 0.5) + vec3(1.0) * spec * 0.6 + uColor1 * fresnel * 0.4;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
    material.uniforms.uTime.value += delta;
  });

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry} material={material} scale={0.022} />
    </Center>
  );
}

export function Logo3D() {
  return (
    <div className="h-48 w-48 md:h-56 md:w-56">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <StlModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
