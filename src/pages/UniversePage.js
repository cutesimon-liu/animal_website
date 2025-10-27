import React, { useRef, Suspense, useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { solarSystemData } from '../data/planets';
import universeKnowledge from '../data/universeKnowledge';
import constellationKnowledge from '../data/constellationKnowledge';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import SolarSystemMenu from '../components/SolarSystemMenu';
import ConstellationMenu from '../components/ConstellationMenu';
import ConstellationCanvas from '../components/ConstellationCanvas';

// Texture URLs
const textureUrls = {
  sun: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/sunmap.jpg',
  mercury: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/mercurymap.jpg',
  venus: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/venusmap.jpg',
  earth: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg',
  earthClouds: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthcloudmaptrans.jpg',
  moon: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/moonmap1k.jpg',
  mars: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/marsmap1k.jpg',
  jupiter: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/jupitermap.jpg',
  saturn: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnmap.jpg',
  saturnRing: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnringpattern.gif',
  uranus: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusmap.jpg',
  neptune: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/neptunemap.jpg',
  meteor: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/sunmap.jpg', // Placeholder
};

const planetColors = {
    pluto: '#A9A9A9',
}

const moonColors = {
    io: 'yellow',
    europa: '#A67B5B',
    ganymede: '#8B4513',
    callisto: '#5C3317',
    titan: 'orange',
    enceladus: 'white',
    moon: 'gray',
}

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

// Generic Planet Component
function Planet({ planetData, semiMajor, semiMinor, speed, textureUrl, color, isPaused, speedMultiplier }) {
  const meshRef = useRef();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const animationTimeRef = useRef(0);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

  useFrame((state, delta) => {
    if (isPaused) return;
    if (!isHovered) {
        animationTimeRef.current += delta * speedMultiplier;
    }
    meshRef.current.position.x = semiMajor * Math.cos(animationTimeRef.current * speed);
    meshRef.current.position.z = semiMinor * Math.sin(animationTimeRef.current * speed);
    meshRef.current.rotation.y += 0.005 * speedMultiplier;
  });

  return (
    <group>
      <Orbit semiMajor={semiMajor} semiMinor={semiMinor} />
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); navigate(`/planet/${planetData.id}`); }}
        onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
        castShadow
      >
        <sphereGeometry args={[planetData.size, 32, 32]} />
        <meshStandardMaterial map={textureUrl ? texture : null} color={color} emissiveIntensity={isHovered ? 0.5 : 0} emissive="white" />
        {isHovered && <Html><div className="planet-label">{planetData.name}</div></Html>}
      </mesh>
    </group>
  );
}

// Earth Component with Clouds and Moon
function Moon({ moonData, planetRef, orbitRadius, speed, isPaused, speedMultiplier, onHover }) {
    const moonRef = useRef();
    const navigate = useNavigate();
    const [isMoonHovered, setIsMoonHovered] = useState(false);
    const animationTimeRef = useRef(0);

    useFrame((state, delta) => {
        if (isPaused) return;
        if (!isMoonHovered) {
            animationTimeRef.current += delta * speedMultiplier;
            if (moonRef.current) {
                moonRef.current.rotation.y += 0.005 * speedMultiplier;
            }
        }
        if (planetRef.current) {
            const moonAngle = animationTimeRef.current * speed;
            moonRef.current.position.x = planetRef.current.position.x + orbitRadius * Math.cos(moonAngle);
            moonRef.current.position.z = planetRef.current.position.z + orbitRadius * Math.sin(moonAngle);
        }
    });

    return (
        <mesh
            ref={moonRef}
            onPointerOver={(e) => { e.stopPropagation(); setIsMoonHovered(true); onHover(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setIsMoonHovered(false); onHover(false); }}
            onClick={(e) => { e.stopPropagation(); navigate(`/planet/${moonData.id}`); }}
        >
            <sphereGeometry args={[moonData.size, 32, 32]} />
            <meshStandardMaterial color={moonColors[moonData.id]} emissiveIntensity={isMoonHovered ? 0.2 : 0} emissive="white" />
            {isMoonHovered && <Html><div className="planet-label">{moonData.name}</div></Html>}
        </mesh>
    );
}

function PlanetWithMoons({ planetData, semiMajor, semiMinor, speed, moons, isPaused, speedMultiplier }) {
    const planetRef = useRef();
    const navigate = useNavigate();
    const [isPlanetHovered, setIsPlanetHovered] = useState(false);
    const [isMoonHovered, setIsMoonHovered] = useState(false);
    const animationTimeRef = useRef(0);
    const planetTexture = useTexture(textureUrls[planetData.id]);

    useFrame((state, delta) => {
        if (isPaused) return;
        if (!isPlanetHovered && !isMoonHovered) {
            animationTimeRef.current += delta * speedMultiplier;
        }
        const planetAngle = animationTimeRef.current * speed;
        planetRef.current.position.x = semiMajor * Math.cos(planetAngle);
        planetRef.current.position.z = semiMinor * Math.sin(planetAngle);
        planetRef.current.rotation.y += 0.005 * speedMultiplier;
    });

    return (
        <group>
            <Orbit semiMajor={semiMajor} semiMinor={semiMinor} />
            <group
                onPointerOver={(e) => { e.stopPropagation(); setIsPlanetHovered(true); }}
                onPointerOut={(e) => { e.stopPropagation(); setIsPlanetHovered(false); }}
                onClick={(e) => { e.stopPropagation(); navigate(`/planet/${planetData.id}`); }}
            >
                <mesh ref={planetRef} castShadow>
                    <sphereGeometry args={[planetData.size, 32, 32]} />
                    <meshStandardMaterial map={planetTexture} emissiveIntensity={isPlanetHovered ? 0.5 : 0} emissive="white" />
                </mesh>
                {isPlanetHovered && <Html position={planetRef.current?.position}><div className="planet-label">{planetData.name}</div></Html>}
            </group>
            {moons.map((moon, index) => (
                <Moon
                    key={moon.id}
                    moonData={moon}
                    planetRef={planetRef}
                    orbitRadius={planetData.size + 2 + index * 2}
                    speed={1 / (index + 1)}
                    isPaused={isPaused}
                    speedMultiplier={speedMultiplier}
                    onHover={setIsMoonHovered}
                />
            ))}
        </group>
    );
}

// Saturn Component with Rings
function Saturn({ planetData, semiMajor, semiMinor, speed, isPaused, speedMultiplier }) {
    const groupRef = useRef();
    const ringRef = useRef();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const animationTimeRef = useRef(0);
    const [planetTexture, ringTexture] = useTexture([textureUrls.saturn, textureUrls.saturnRing]);

    useFrame((state, delta) => {
        if (isPaused) return;
        if (!isHovered) {
            animationTimeRef.current += delta * speedMultiplier;
        }
        const angle = animationTimeRef.current * speed;
        groupRef.current.position.x = semiMajor * Math.cos(angle);
        groupRef.current.position.z = semiMinor * Math.sin(angle);
        groupRef.current.rotation.y += 0.005 * speedMultiplier;
    });

    return (
        <group>
            <Orbit semiMajor={semiMajor} semiMinor={semiMinor} />
            <group
                ref={groupRef}
                onClick={(e) => { e.stopPropagation(); navigate(`/planet/${planetData.id}`); }}
                onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
                onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
            >
                <mesh castShadow>
                    <sphereGeometry args={[planetData.size, 32, 32]} />
                    <meshStandardMaterial map={planetTexture} emissiveIntensity={isHovered ? 0.5 : 0} emissive="white" />
                </mesh>
                <mesh ref={ringRef} rotation-x={Math.PI / 2} castShadow>
                    <ringGeometry args={[planetData.size * 1.2, planetData.size * 2.2, 64]} />
                    <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent opacity={0.8} />
                </mesh>
                {isHovered && <Html><div className="planet-label">{planetData.name}</div></Html>}
            </group>
        </group>
    );
}

// Asteroid Belt Component
function AsteroidBelt({ isPaused, speedMultiplier }) {
    const meshRef = useRef();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [hoverPos, setHoverPos] = useState(null);
    const count = 1000;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const asteroidBeltData = solarSystemData.planets.find(p => p.id === 'asteroid-belt');

    const particles = useMemo(() => {
        const temp = [];
        const minRadius = 18;
        const maxRadius = 21;
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 2 * Math.PI;
            const r = THREE.MathUtils.lerp(minRadius, maxRadius, Math.random());
            const x = r * Math.cos(t);
            const z = r * Math.sin(t);
            const y = (Math.random() - 0.5) * 0.5;
            const speed = 0.05 + Math.random() * 0.1;
            temp.push({ t, r, x, z, y, speed });
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        if (isPaused || isHovered) return;
        particles.forEach((particle, i) => {
            particle.t += particle.speed * delta * speedMultiplier;
            const x = particle.r * Math.cos(particle.t);
            const z = particle.r * Math.sin(particle.t);
            dummy.position.set(x, particle.y, z);
            dummy.rotation.set(Math.random(), Math.random(), Math.random());
            const scale = Math.random() * 0.03 + 0.02;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#555555" roughness={0.8} />
            </instancedMesh>
            <mesh
                rotation-x={Math.PI / 2}
                onClick={(e) => { e.stopPropagation(); navigate('/planet/asteroid-belt'); }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setIsHovered(true);
                    setHoverPos(e.point);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setIsHovered(false);
                    setHoverPos(null);
                }}
            >
                <torusGeometry args={[19.5, 1.5, 16, 64]} />
                <meshBasicMaterial transparent opacity={0} />
                {isHovered && hoverPos &&
                    <Html position={hoverPos}>
                        <div className="planet-label">
                            {asteroidBeltData.name}
                        </div>
                    </Html>
                }
            </mesh>
        </group>
    );
}

// Sun Component
function Sun() {
    const [isHovered, setIsSunHovered] = useState(false);
    const sunTexture = useTexture(textureUrls.sun);
    const sunData = solarSystemData.planets.find(p => p.id === 'sun');

    return (
        <mesh
            onClick={() => window.location.href = `/planet/sun`}
            onPointerOver={(e) => { e.stopPropagation(); setIsSunHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setIsSunHovered(false); }}
        >
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial
                emissiveMap={sunTexture}
                emissive={0xFFB800}
                emissiveIntensity={isHovered ? 2.2 : 1.8}
            />
            {isHovered && <Html><div className="planet-label">{sunData.name}</div></Html>}
        </mesh>
    );
}

// Meteor Component
function Meteor({ isPaused, speedMultiplier }) {
    const meteorRef = useRef();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const meteorData = solarSystemData.planets.find(p => p.id === 'meteor');

    const starShape = useMemo(() => {
        const shape = new THREE.Shape();
        const outerRadius = 3;
        const innerRadius = 1.4;
        const points = 5;
        shape.moveTo(0, outerRadius);
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (points * 2)) * Math.PI * 2;
            shape.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
        }
        shape.closePath();
        return shape;
    }, []);

    // Set initial position to top-left
    const initialPos = useMemo(() => new THREE.Vector3(-50, 30, 0), []);

    // Set velocity to move from top-left to bottom-right
    const velocity = useMemo(() => new THREE.Vector3(1, -0.5, 0).normalize().multiplyScalar(0.2), []);

    const currentPosition = useRef(initialPos.clone());

    useFrame((state, delta) => {
        if (isPaused) return;
        if (meteorRef.current && !isHovered) {
            // Move the meteor
            currentPosition.current.add(velocity.clone().multiplyScalar(delta * 60 * speedMultiplier));

            // Reset meteor when it goes off-screen
            if (currentPosition.current.x > 80 || currentPosition.current.y < -40) {
                currentPosition.current.copy(initialPos);
            }
            meteorRef.current.position.copy(currentPosition.current);
            meteorRef.current.rotation.z = Math.atan2(velocity.y, velocity.x) - Math.PI / 2;
        }
    });

    return (
        <group 
            ref={meteorRef}
            onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
            onClick={(e) => { e.stopPropagation(); navigate('/planet/meteor'); }}
        >
            {/* Head */}
            <mesh>
                <shapeGeometry args={[starShape]} />
                <meshBasicMaterial color="white" />
            </mesh>
            {/* Tail */}
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} position={[0, -i * 2, 0]}>
                    <coneGeometry args={[1.6 * (1 - i / 10), 2, 16]} />
                    <meshBasicMaterial
                        color="white"
                        transparent
                        opacity={0.5 * (1 - i / 10)}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
            {isHovered && <Html><div className="planet-label">{meteorData.name}</div></Html>}
        </group>
    );
}


// Main Universe Page Component
function UniversePage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialActiveCanvas = queryParams.get('view') === 'constellations' ? 'constellations' : 'solarSystem';

  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCanvas, setActiveCanvas] = useState(initialActiveCanvas);
  const [knowledgeData, setKnowledgeData] = useState(universeKnowledge);

  useEffect(() => {
    if (activeCanvas === 'solarSystem') {
      setKnowledgeData(universeKnowledge);
    } else if (activeCanvas === 'constellations') {
      setKnowledgeData(constellationKnowledge);
    }
  }, [activeCanvas]);

  const planetsWith3DData = solarSystemData.planets.map(p => {
      const eccentricity = 0.98;
      const sizeFactor = 2.5;
      switch(p.id) {
          case 'sun': return {...p, size: 3 };
          case 'mercury': return {...p, size: 0.2 * sizeFactor, semiMajor: 6, semiMinor: 6 * eccentricity, speed: 0.8 };
          case 'venus': return {...p, size: 0.4 * sizeFactor, semiMajor: 9, semiMinor: 9 * eccentricity, speed: 0.6 };
          case 'earth': return {...p, size: 0.45 * sizeFactor, semiMajor: 12.5, semiMinor: 12.5 * eccentricity, speed: 0.4 };
          case 'mars': return {...p, size: 0.3 * sizeFactor, semiMajor: 16, semiMinor: 16 * eccentricity, speed: 0.3 };
          case 'jupiter': return {...p, size: 1.2 * sizeFactor, semiMajor: 23, semiMinor: 23 * eccentricity, speed: 0.15 };
          case 'saturn': return {...p, size: 1 * sizeFactor, semiMajor: 30, semiMinor: 30 * eccentricity, speed: 0.1 };
          case 'uranus': return {...p, size: 0.8 * sizeFactor, semiMajor: 37, semiMinor: 37 * eccentricity, speed: 0.05 };
          case 'neptune': return {...p, size: 0.75 * sizeFactor, semiMajor: 43, semiMinor: 43 * eccentricity, speed: 0.03 };
          case 'pluto': return {...p, size: 0.1 * sizeFactor, semiMajor: 48, semiMinor: 48 * eccentricity, speed: 0.02 };
          case 'moon': return {...p, size: p.size * sizeFactor };
          case 'io': return {...p, size: 0.15 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Moon
          case 'europa': return {...p, size: 0.13 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Moon
          case 'ganymede': return {...p, size: 0.2 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Moon
          case 'callisto': return {...p, size: 0.18 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Moon
          case 'titan': return {...p, size: 0.2 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Moon
          case 'enceladus': return {...p, size: 0.05 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Moon
          case 'meteor': return {...p, size: 0.1 * sizeFactor, semiMajor: 0, semiMinor: 0, speed: 0 }; // Not orbiting
          default: return p;
      }
  });

  const orbitingPlanets = planetsWith3DData.filter(p => p.semiMajor > 0);
  const moons = {
      earth: planetsWith3DData.filter(p => p.id === 'moon'),
  }

  const menuIconStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    padding: '10px',
    zIndex: 10,
    cursor: 'pointer',
    color: 'white',
    fontSize: '24px'
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'auto' }}>
        <div style={menuIconStyle} onClick={() => setIsMenuOpen(true)}>
            ☰
        </div>
        {activeCanvas === 'constellations' ? (
            <ConstellationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        ) : (
            <SolarSystemMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        )}

        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px', color: 'white', width: '200px' }}>
                <h5 style={{textAlign: 'center'}}>場景切換</h5>
                <Button variant={activeCanvas === 'solarSystem' ? 'light' : 'outline-light'} size="sm" onClick={() => setActiveCanvas('solarSystem')} className="mb-2 w-100">
                    太陽系
                </Button>
                <Button variant={activeCanvas === 'constellations' ? 'light' : 'outline-light'} size="sm" onClick={() => setActiveCanvas('constellations')} className="w-100">
                    星座
                </Button>
            </div>
            {activeCanvas === 'solarSystem' && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px', color: 'white', width: '200px' }}>
                    <h5 style={{textAlign: 'center'}}>動畫控制</h5>
                    <Button variant="outline-light" size="sm" onClick={() => setIsPaused(!isPaused)} className="mb-2 w-100">
                        {isPaused ? '繼續動畫' : '暫停動畫'}
                    </Button>
                    <Form.Label>旋轉速度</Form.Label>
                    <Form.Range
                        min="0"
                        max="5"
                        step="0.1"
                        value={speedMultiplier}
                        onChange={e => setSpeedMultiplier(parseFloat(e.target.value))}
                    />
                </div>
            )}
        </div>

        {activeCanvas === 'solarSystem' ? (
            <div style={{ height: '60vh', width: '100vw', position: 'relative', zIndex: 0 }}>
                <Suspense fallback={<div style={{color: 'white', textAlign: 'center'}}>載入中...</div>}>
                    <Canvas camera={{ position: [0, 45, 70], fov: 45 }} shadows>
                        <ambientLight intensity={0.2} />
                        <pointLight color="#ffffff" position={[0, 0, 0]} intensity={2.5} castShadow />
                        <Stars radius={300} depth={60} count={5000} factor={10} saturation={0} fade speed={1} />

                        <group rotation-x={-Math.PI / 8} position={[-20, 0, 0]} scale={1.8}>
                            <Sun />
                            <AsteroidBelt isPaused={isPaused} speedMultiplier={speedMultiplier} />
                            {orbitingPlanets.map(planet => {
                                if (planet.id === 'saturn') {
                                    return <Saturn
                                        key={planet.id}
                                        planetData={planet}
                                        semiMajor={planet.semiMajor}
                                        semiMinor={planet.semiMinor}
                                        speed={planet.speed}
                                        isPaused={isPaused}
                                        speedMultiplier={speedMultiplier}
                                    />;
                                }
                                if (moons[planet.id]) {
                                    return <PlanetWithMoons
                                        key={planet.id}
                                        planetData={planet}
                                        semiMajor={planet.semiMajor}
                                        semiMinor={planet.semiMinor}
                                        speed={planet.speed}
                                        moons={moons[planet.id]}
                                        moonsAreAnimated={planet.id !== 'jupiter'}
                                        isPaused={isPaused}
                                        speedMultiplier={speedMultiplier}
                                    />;
                                }
                                if (planet.id === 'pluto') {
                                    return <Planet
                                        key={planet.id}
                                        planetData={planet}
                                        semiMajor={planet.semiMajor}
                                        semiMinor={planet.semiMinor}
                                        speed={planet.speed}
                                        color={planetColors[planet.id]}
                                        isPaused={isPaused}
                                        speedMultiplier={speedMultiplier}
                                    />;
                                }
                                
                                return <Planet
                                    key={planet.id}
                                    planetData={planet}
                                    semiMajor={planet.semiMajor}
                                    semiMinor={planet.semiMinor}
                                    speed={planet.speed}
                                    textureUrl={textureUrls[planet.id]}
                                    isPaused={isPaused}
                                    speedMultiplier={speedMultiplier}
                                />;
                            })}
                        </group>
                        <Meteor isPaused={isPaused} speedMultiplier={speedMultiplier} />
                        <OrbitControls enablePan={true} enableZoom={false} enableRotate={false} minDistance={20} maxDistance={150} maxPolarAngle={Math.PI / 2.1} />
                    </Canvas>
                </Suspense>
            </div>
        ) : (
            <ConstellationCanvas />
        )}

        <div style={{ position: 'relative', zIndex: 1, minHeight: '50vh', padding: '20px 0' }}>
            <Container className="py-5">
                <Row className="g-4 justify-content-center">
                    {knowledgeData.map((item) => (
                        <Col md={6} lg={4} key={item.id}>
                            <Card className="h-100 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }}>
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.shortDescription}</Card.Text>
                                    <button onClick={() => {
                                        const path = activeCanvas === 'solarSystem' ? `/universe-knowledge/${item.id}` : `/constellation-knowledge/${item.id}`;
                                        window.location.href = path;
                                    }} className="btn btn-outline-light">了解更多</button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    </div>
  );
}

export default UniversePage;