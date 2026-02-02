"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface PoolTable3DProps {
  size: string;
  material: string;
  woodType?: string;
  marbleType?: string;
  clothColor: string;
  legStyle: string;
}

const woodColors: { [key: string]: string } = {
  oak: "#daa520",
  walnut: "#5d4037",
  mahogany: "#833d3d",
  cherry: "#a0522d",
};

const marbleColors: { [key: string]: string } = {
  carrara: "#f8f9fa",
  calacatta: "#ffffff",
  nero: "#2d3748",
  emperador: "#8b7355",
};

const clothColors: { [key: string]: string } = {
  green: "#0a5f38",
  blue: "#1e40af",
  red: "#991b1b",
  black: "#1f2937",
  burgundy: "#7c2d12",
  camel: "#c19a6b",
};

function PoolTableMesh({
  size,
  material,
  woodType = "oak",
  marbleType = "carrara",
  clothColor,
  legStyle,
}: PoolTable3DProps) {
  // Table dimensions based on size
  const dimensions = {
    "7ft": { width: 7, length: 3.5, height: 0.8 },
    "8ft": { width: 8, length: 4, height: 0.8 },
    "9ft": { width: 9, length: 4.5, height: 0.8 },
  };

  const { width, length, height } = dimensions[size as keyof typeof dimensions];
  
  const frameColor = material === "wood" 
    ? woodColors[woodType] 
    : marbleColors[marbleType];

  return (
    <group>
      {/* Table Frame/Rails */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, 0.3, length]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Playing Surface (Cloth) */}
      <mesh position={[0, height / 2 - 0.15, 0]} receiveShadow>
        <boxGeometry args={[width - 0.6, 0.05, length - 0.6]} />
        <meshStandardMaterial color={clothColors[clothColor]} roughness={0.9} />
      </mesh>

      {/* Table Bed (under cloth) */}
      <mesh position={[0, height / 2 - 0.3, 0]}>
        <boxGeometry args={[width - 0.5, 0.2, length - 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Pockets (6 pockets) */}
      {[
        // Corner pockets
        [-(width - 0.8) / 2, height / 2, -(length - 0.8) / 2],
        [(width - 0.8) / 2, height / 2, -(length - 0.8) / 2],
        [-(width - 0.8) / 2, height / 2, (length - 0.8) / 2],
        [(width - 0.8) / 2, height / 2, (length - 0.8) / 2],
        // Middle pockets
        [0, height / 2, -(length - 0.8) / 2],
        [0, height / 2, (length - 0.8) / 2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}

      {/* Table Legs */}
      {legStyle === "classic" && (
        <>
          {[
            [-(width - 1) / 2, 0, -(length - 1) / 2],
            [(width - 1) / 2, 0, -(length - 1) / 2],
            [-(width - 1) / 2, 0, (length - 1) / 2],
            [(width - 1) / 2, 0, (length - 1) / 2],
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <cylinderGeometry args={[0.15, 0.2, height, 16]} />
              <meshStandardMaterial color={frameColor} roughness={0.3} />
            </mesh>
          ))}
        </>
      )}

      {legStyle === "modern" && (
        <>
          {[
            [-(width - 1) / 2, 0, -(length - 1) / 2],
            [(width - 1) / 2, 0, -(length - 1) / 2],
            [-(width - 1) / 2, 0, (length - 1) / 2],
            [(width - 1) / 2, 0, (length - 1) / 2],
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <boxGeometry args={[0.2, height, 0.2]} />
              <meshStandardMaterial color={frameColor} roughness={0.2} metalness={0.4} />
            </mesh>
          ))}
        </>
      )}

      {legStyle === "ornate" && (
        <>
          {[
            [-(width - 1) / 2, 0, -(length - 1) / 2],
            [(width - 1) / 2, 0, -(length - 1) / 2],
            [-(width - 1) / 2, 0, (length - 1) / 2],
            [(width - 1) / 2, 0, (length - 1) / 2],
          ].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.15, height * 0.3, 8]} />
                <meshStandardMaterial color={frameColor} roughness={0.3} />
              </mesh>
              <mesh position={[0, height * 0.3, 0]}>
                <cylinderGeometry args={[0.15, 0.15, height * 0.4, 8]} />
                <meshStandardMaterial color={frameColor} roughness={0.3} />
              </mesh>
              <mesh position={[0, height * 0.7, 0]}>
                <cylinderGeometry args={[0.2, 0.15, height * 0.3, 8]} />
                <meshStandardMaterial color={frameColor} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* Rails/Cushions */}
      <mesh position={[0, height / 2 + 0.1, (length - 0.4) / 2]}>
        <boxGeometry args={[width - 0.8, 0.2, 0.2]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
      <mesh position={[0, height / 2 + 0.1, -(length - 0.4) / 2]}>
        <boxGeometry args={[width - 0.8, 0.2, 0.2]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
      <mesh position={[(width - 0.4) / 2, height / 2 + 0.1, 0]}>
        <boxGeometry args={[0.2, 0.2, length - 0.8]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
      <mesh position={[-(width - 0.4) / 2, height / 2 + 0.1, 0]}>
        <boxGeometry args={[0.2, 0.2, length - 0.8]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>

      {/* Sample Pool Balls */}
      {material === "wood" && (
        <>
          <mesh position={[0, height / 2 + 0.1, 0]} castShadow>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} />
          </mesh>
          <mesh position={[-0.3, height / 2 + 0.1, 0.2]} castShadow>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="#ff0000" roughness={0.1} metalness={0.2} />
          </mesh>
          <mesh position={[0.3, height / 2 + 0.1, -0.2]} castShadow>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="#0000ff" roughness={0.1} metalness={0.2} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function PoolTable3D(props: PoolTable3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={50} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -5]} intensity={0.5} />
        <pointLight position={[0, 15, 0]} intensity={0.3} />
        
        {/* Pool Table */}
        <PoolTableMesh {...props} />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#8b7355" roughness={0.8} />
        </mesh>
      </Canvas>
    </div>
  );
}
