 import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Turbine({ windSpeed }: { windSpeed: number }) {
  const bladesRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z -= windSpeed * 0.02;
    }
  });

  return (
    <group>
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <group ref={bladesRef} position={[0, 0.5, 0]}>
        {[0, 120, 240].map((angle, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (angle * Math.PI) / 180]}
            position={[0, 0.6, 0]}
          >
            <boxGeometry args={[0.1, 1.2, 0.05]} />
            <meshStandardMaterial color="#00ffcc" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Turbine3D({ windSpeed }: { windSpeed: number }) {
  return (
    <div className="absolute bottom-0 right-0 w-96 h-96 opacity-60">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Turbine windSpeed={windSpeed} />
      </Canvas>
    </div>
  );
}