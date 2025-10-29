import React, { useMemo, Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { constellationData } from '../data/constellationData';

// Star Component
function Star({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={'white'} emissive="white" emissiveIntensity={0.5} />
    </mesh>
  );
}

// Constellation Component
function Constellation({ data }) {
  const lineSegments = useMemo(() => {
    const points = [];
    const starPositions = data.stars.reduce((acc, star) => {
      acc[star.id] = new THREE.Vector3(...star.position);
      return acc;
    }, {});

    data.lines.forEach(([startId, endId]) => {
      if (starPositions[startId] && starPositions[endId]) {
        points.push(starPositions[startId]);
        points.push(starPositions[endId]);
      }
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return (
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="white" transparent opacity={0.5} />
      </lineSegments>
    );
  }, [data]);

  return (
    <group>
      {data.stars.map(star => (
        <Star key={star.id} position={star.position} />
      ))}
      {lineSegments}
    </group>
  );
}

// A group that always faces the camera
function CameraFacingGroup({ children, ...props }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.lookAt(state.camera.position);
    }
  });
  return <group ref={groupRef} {...props}>{children}</group>;
}

// This new component contains all the R3F logic and is rendered inside the Canvas
function SceneContent({ targetIndex, setDisplayIndex, numConstellations }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const anglePerConstellation = (2 * Math.PI) / numConstellations;
    const initialAngleForTarget = targetIndex * anglePerConstellation;
    const targetRotation = (-Math.PI / 2) + initialAngleForTarget;

    // Use LERP for smooth and reliable rotation
    let currentRotation = groupRef.current.rotation.y;
    
    // Handle the circular wrap-around for lerp
    if (Math.abs(currentRotation - targetRotation) > Math.PI) {
      if (currentRotation > targetRotation) {
        currentRotation -= 2 * Math.PI;
      } else {
        currentRotation += 2 * Math.PI;
      }
    }
    
    const newRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, 0.05);
    groupRef.current.rotation.y = newRotation;

    const hasArrived = Math.abs(newRotation - targetRotation) < 0.005;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight color="white" position={[0, 0, 0]} intensity={0.5} />
      <Stars radius={200} depth={50} count={5000} factor={10} saturation={0} fade speed={1} />
      <group ref={groupRef} position={[0, 10, 0]}>
        {constellationData.map((constellation, index) => {
          const angle = (index / constellationData.length) * 2 * Math.PI;
          const radius = 60;
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
          return (
            <CameraFacingGroup key={constellation.id} position={[x, 0, z]} scale={0.65}>
              <Constellation data={constellation} />
            </CameraFacingGroup>
          );
        })}
      </group>
    </>
  );
}

// Main Component now only manages state and renders the HTML label + Canvas
export default function ConstellationCanvas() {
  const [targetIndex, setTargetIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isInteracting) {
      const interval = setInterval(() => {
        setTargetIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % constellationData.length;
          setDisplayIndex(nextIndex);
          return nextIndex;
        });
      }, 3000); // Change constellation every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isInteracting]);

  const handleInteraction = () => {
    setIsInteracting(true);
    clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 5000); // 5 seconds of inactivity
  };

  const handleNext = () => {
    handleInteraction();
    setTargetIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % constellationData.length;
      setDisplayIndex(nextIndex);
      return nextIndex;
    });
  };

  const handlePrev = () => {
    handleInteraction();
    setTargetIndex(prevIndex => {
      const prevIndexValue = (prevIndex - 1 + constellationData.length) % constellationData.length;
      setDisplayIndex(prevIndexValue);
      return prevIndexValue;
    });
  };

  const currentConstellation = constellationData[displayIndex];

  return (
    <div style={{ height: '60vh', width: '100vw', position: 'relative' }}>
      <button onClick={handlePrev} style={{ position: 'absolute', left: '100px', top: '50%', zIndex: 2, background: 'none', border: 'none', color: 'white', fontSize: '3em' }}>&lt;</button>
      <button onClick={handleNext} style={{ position: 'absolute', right: '100px', top: '50%', zIndex: 2, background: 'none', border: 'none', color: 'white', fontSize: '3em' }}>&gt;</button>
      <div style={{
        position: 'absolute',
        top: '85%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        textAlign: 'center',
        transition: 'opacity 0.5s ease-in-out',
        opacity: 1,
      }}>
        <Link to={`/constellation/${currentConstellation?.id}`} style={{ textDecoration: 'none' }}>
          <div style={{
            color: 'white',
            fontSize: '1.8em',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '10px 20px',
            borderRadius: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {currentConstellation?.name}
          </div>
        </Link>
      </div>

      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center' }}>載入中...</div>}>
        <Canvas camera={{ position: [0, 15, 80], fov: 50, near: 0.01, far: 1000 }} style={{ background: 'transparent', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <SceneContent 
            targetIndex={targetIndex}
            setDisplayIndex={setDisplayIndex}
            numConstellations={constellationData.length}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}