import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, RoundedBox, ContactShadows, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

function Bottle({ fragrance, finish = 'smoke', cap = 'gold', engraving = '', interactive = false }) {
  const group = useRef();
  const color = fragrance?.liquid || '#775139';
  const finishColor = finish === 'rose' ? '#9c5366' : finish === 'crystal' ? '#d6d4ca' : finish === 'amber' ? '#a86c32' : '#37312f';
  const capColor = cap === 'silver' ? '#aeb3b2' : cap === 'black' ? '#242321' : '#b9a17b';
  useFrame((state, delta) => {
    if (!group.current) return;
    if (!interactive) {
      group.current.rotation.y += delta * 0.12;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.045;
    }
  });
  return (
    <group ref={group} rotation={[0,-0.25,0]} scale={1.04}>
      <RoundedBox args={[2.05,2.75,0.95]} radius={0.2} smoothness={5} position={[0,-0.32,0]}>
        <meshPhysicalMaterial color={finishColor} roughness={0.13} metalness={0.03} transmission={finish === 'crystal' ? 0.93 : 0.7} thickness={1.45} ior={1.48} transparent opacity={0.94} clearcoat={1} clearcoatRoughness={0.08} />
      </RoundedBox>
      <RoundedBox args={[1.84,2.44,0.76]} radius={0.15} smoothness={4} position={[0,-0.37,0]}>
        <meshPhysicalMaterial color={color} roughness={0.17} metalness={0.12} transmission={0.26} thickness={0.6} transparent opacity={0.78} />
      </RoundedBox>
      <mesh position={[0,1.105,0]}>
        <cylinderGeometry args={[0.34,0.34,0.35,48]} />
        <meshPhysicalMaterial color="#a99a84" metalness={0.94} roughness={0.2} />
      </mesh>
      <mesh position={[0,1.43,0]}>
        <cylinderGeometry args={[0.55,0.52,0.60,64,1]} />
        <meshPhysicalMaterial color={capColor} metalness={0.9} roughness={0.19} clearcoat={1} />
      </mesh>
      <mesh position={[0,1.73,0]} rotation={[Math.PI/2,0,0]}>
        <circleGeometry args={[0.54,64]} />
        <meshStandardMaterial color={capColor} metalness={0.86} roughness={0.26} />
      </mesh>
      <mesh position={[0,-0.27,0.492]}>
        <planeGeometry args={[1.58,1.54]} />
        <meshStandardMaterial color="#d9cbb6" roughness={0.92} metalness={0} />
      </mesh>
      <Text position={[0,0.20,0.505]} fontSize={0.112} letterSpacing={0.15} color="#35291e" anchorX="center" anchorY="middle">ESSENCE</Text>
      <mesh position={[0,-0.02,0.506]}>
        <planeGeometry args={[0.38,0.006]} />
        <meshBasicMaterial color="#917c64" />
      </mesh>
      <Text position={[0,-0.31,0.507]} fontSize={0.205} maxWidth={1.45} color="#443327" anchorX="center" anchorY="middle">{(engraving || fragrance?.name || 'NOCTURNE').toUpperCase()}</Text>
      <Text position={[0,-0.68,0.508]} fontSize={0.082} letterSpacing={0.14} color="#776554" anchorX="center" anchorY="middle">EAU DE PARFUM</Text>
      <Text position={[0,-0.83,0.508]} fontSize={0.065} letterSpacing={0.07} color="#887663" anchorX="center" anchorY="middle">PARIS · 100 ML</Text>
      <mesh position={[-0.94,-0.3,0.49]} scale={[0.018,2.4,0.018]}>
        <sphereGeometry args={[1,8,16]}/>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.23}/>
      </mesh>
    </group>
  );
}

export default function BottleStage({ fragrance, finish, cap, engraving, interactive = false, className = '' }) {
  return <div className={'bottle-stage ' + className} role="img" aria-label={'Interactive 3D bottle for ' + (fragrance?.name || 'ESSENCE')}>
    <Canvas dpr={[1,1.7]} camera={{ position:[0,0.2,6.8], fov:33 }} gl={{ alpha:true, antialias:true, powerPreference:'high-performance' }} shadows={false}>
      <ambientLight intensity={1.2}/>
      <directionalLight position={[4,6,6]} intensity={3.4} color="#ffe5c1"/>
      <directionalLight position={[-5,2,-4]} intensity={3} color="#c1b3a8"/>
      <spotLight position={[-3,6,3]} angle={0.42} intensity={4} color="#d2a575" />
      <Suspense fallback={null}>
        <Float speed={interactive ? 0 : 1} floatIntensity={interactive ? 0 : 0.15} rotationIntensity={0}>
          <Bottle fragrance={fragrance} finish={finish} cap={cap} engraving={engraving} interactive={interactive}/>
        </Float>
        <Environment preset="studio" environmentIntensity={0.5}/>
        <ContactShadows position={[0,-2.35,0]} opacity={0.38} scale={5.5} blur={2.6} far={3} color="#060504"/>
      </Suspense>
      {interactive && <OrbitControls enablePan={false} minDistance={5} maxDistance={9} minPolarAngle={0.55} maxPolarAngle={2.2} enableDamping dampingFactor={0.075} />}
    </Canvas>
    {interactive && <div className="stage-hint">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div>}
  </div>;
}
