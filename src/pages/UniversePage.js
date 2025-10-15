import React, { useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { solarSystemData } from '../data/planets';

// A component for the elliptical orbit path
function Orbit({ semiMajor, semiMinor }) {
  const points = new THREE.EllipseCurve(0, 0, semiMajor, semiMinor, 0, 2 * Math.PI, false, 0).getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geometry} rotation-x={Math.PI / 2}>
      <lineBasicMaterial attach="material" color="#87CEEB" transparent opacity={0.35} />
    </line>
  );
}

// A component for a single planet
function Planet({ planetData, semiMajor, semiMinor, speed }) {
  const meshRef = useRef();
  const navigate = useNavigate();

  // Animation logic to make the planet orbit elliptically
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    meshRef.current.position.x = semiMajor * Math.cos(elapsedTime * speed);
    meshRef.current.position.z = semiMinor * Math.sin(elapsedTime * speed);
    meshRef.current.rotation.y += 0.005; // Add self-rotation
  });

  const handlePlanetClick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to OrbitControls
    navigate(`/planet/${planetData.id}`);
  };

  // Simple color mapping for planets
  const colorMap = {
      mercury: '#adb5bd',
      venus: '#e67e22',
      earth: '#2980b9',
      mars: '#c0392b',
      jupiter: '#f39c12',
      saturn: '#f1c40f',
      uranus: '#1abc9c',
      neptune: '#3498db'
  };

  return (
    <group>
      <Orbit semiMajor={semiMajor} semiMinor={semiMinor} />
      <mesh ref={meshRef} onClick={handlePlanetClick} castShadow>
        <sphereGeometry args={[planetData.size, 32, 32]} />
        <meshStandardMaterial 
            color={colorMap[planetData.id] || '#ffffff'} 
            emissive={colorMap[planetData.id]}
            emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function UniversePage() {
  // Define 3D properties for each celestial body
  const planetsWith3DData = solarSystemData.planets.map(p => {
      const eccentricity = 0.98; // Make orbits slightly elliptical
      const sizeFactor = 1.25; // Increase planet sizes by 25%
      switch(p.id) {
          case 'sun': return {...p, size: 3, position: [0,0,0] };
          case 'mercury': return {...p, size: 0.2 * sizeFactor, semiMajor: 6, semiMinor: 6 * eccentricity, speed: 0.8 };
          case 'venus': return {...p, size: 0.4 * sizeFactor, semiMajor: 9, semiMinor: 9 * eccentricity, speed: 0.6 };
          case 'earth': return {...p, size: 0.45 * sizeFactor, semiMajor: 12.5, semiMinor: 12.5 * eccentricity, speed: 0.4 };
          case 'mars': return {...p, size: 0.3 * sizeFactor, semiMajor: 16, semiMinor: 16 * eccentricity, speed: 0.3 };
          case 'jupiter': return {...p, size: 1.2 * sizeFactor, semiMajor: 23, semiMinor: 23 * eccentricity, speed: 0.15 };
          case 'saturn': return {...p, size: 1 * sizeFactor, semiMajor: 30, semiMinor: 30 * eccentricity, speed: 0.1 };
          case 'uranus': return {...p, size: 0.8 * sizeFactor, semiMajor: 37, semiMinor: 37 * eccentricity, speed: 0.05 };
          case 'neptune': return {...p, size: 0.75 * sizeFactor, semiMajor: 43, semiMinor: 43 * eccentricity, speed: 0.03 };
          default: return {...p, size: 1, position: [0,0,0] };
      }
  });

  const sun = planetsWith3DData.find(p => p.id === 'sun');
  const orbitingPlanets = planetsWith3DData.filter(p => p.id !== 'sun');

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <Suspense fallback={<div style={{color: 'white', textAlign: 'center'}}>載入中...</div>}>
            <Canvas camera={{ position: [0, 45, 70], fov: 45 }}>
                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight color="#ffffff" position={[0, 0, 0]} intensity={3.0} castShadow />

                {/* Background */}
                <Stars radius={300} depth={60} count={5000} factor={10} saturation={0} fade speed={1} />

                <group rotation-x={-Math.PI / 8}> 
                    {/* Sun */}
                    <mesh position={sun.position} onClick={() => window.location.href = `/planet/sun`}>
                        <sphereGeometry args={[sun.size, 64, 64]} />
                        <meshBasicMaterial color="#ffc107" />
                    </mesh>

                    {/* Planets */}
                    {orbitingPlanets.map(planet => (
                        <Planet 
                            key={planet.id} 
                            planetData={planet} 
                            semiMajor={planet.semiMajor} 
                            semiMinor={planet.semiMinor} 
                            speed={planet.speed} 
                        />
                    ))}
                </group>

                {/* Controls */}
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true} 
                  minDistance={20} 
                  maxDistance={150}
                  maxPolarAngle={Math.PI / 2.1} // Prevent looking from below
                />
            </Canvas>
        </Suspense>
    </div>
  );
}

export default UniversePage;
