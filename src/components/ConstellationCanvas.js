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
function SceneContent({ targetIndex, setDisplayIndex, setIsPaused, numConstellations }) {
  const groupRef = useRef();
  const isPausedRef = useRef(true);
  const pauseTimer = useRef(0);
  const cooldownTimer = useRef(0);
  const isCoolingDown = useRef(false);
  const PAUSE_DURATION = 3;
  const COOLDOWN_DURATION = 2; // 2 seconds to move away from the front

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (numConstellations <= 1) {
      // --- LOGIC FOR SINGLE CONSTELLATION ---
      if (isCoolingDown.current) {
        // In cooldown, just rotate and count down
        groupRef.current.rotation.y += delta * 0.2;
        cooldownTimer.current += delta;
        if (cooldownTimer.current >= COOLDOWN_DURATION) {
          isCoolingDown.current = false;
          cooldownTimer.current = 0;
        }
        return; // Skip the rest of the logic
      }

      if (!isPausedRef.current) {
        groupRef.current.rotation.y += delta * 0.2;
      }

      const rotationY = groupRef.current.rotation.y % (2 * Math.PI);
      const targetFront = -Math.PI / 2;
      let diff = Math.abs(rotationY - targetFront);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;

      if (diff < 0.05 && !isPausedRef.current) {
        isPausedRef.current = true;
        setIsPaused(true);
        setDisplayIndex(0);
        pauseTimer.current = 0;
      }

      if (isPausedRef.current) {
        pauseTimer.current += delta;
        if (pauseTimer.current >= PAUSE_DURATION) {
          isPausedRef.current = false;
          setIsPaused(false);
          isCoolingDown.current = true; // Start cooldown
        }
      }

    } else {
      // --- LOGIC FOR MULTIPLE CONSTELLATIONS (using robust LERP) ---
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

      if (hasArrived) {
        groupRef.current.rotation.y = targetRotation; // Snap to final position
        if (!isPausedRef.current) {
          isPausedRef.current = true;
          setIsPaused(true);
          setDisplayIndex(targetIndex);
          pauseTimer.current = 0;
        }
      }

      if (isPausedRef.current) {
        pauseTimer.current += delta;
        if (pauseTimer.current >= PAUSE_DURATION) {
          setIsPaused(false);
          isPausedRef.current = false;
        }
      }
    }
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
  const [isPaused, setIsPaused] = useState(true);

  // This effect now correctly handles the state transitions
  useEffect(() => {
    // When the scene logic unpauses (signaling the end of a pause), 
    // we immediately set the next target index. The useFrame loop will handle the rotation.
    if (!isPaused) {
      setTargetIndex(prevIndex => (prevIndex + 1) % constellationData.length);
    }
  }, [isPaused]);

  const currentConstellation = constellationData[displayIndex];

  return (
    <div style={{ height: '60vh', width: '100vw', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '85%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        textAlign: 'center',
        transition: 'opacity 0.5s ease-in-out',
        opacity: isPaused ? 1 : 0,
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
            setIsPaused={setIsPaused}
            numConstellations={constellationData.length}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}