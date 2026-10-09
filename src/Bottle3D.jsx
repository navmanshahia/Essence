import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

class WebGLBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="webgl-fallback"><div className="fallback-bottle"><span>ESSENCE</span><strong>{this.props.name}</strong><small>EAU DE PARFUM</small></div><p>3D preview unavailable on this device.</p></div>;
    return this.props.children;
  }
}

function useLabelTexture(name, engraving) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e7d9c5'; ctx.fillRect(0,0,1024,1024);
    ctx.strokeStyle = '#c2ae98'; ctx.lineWidth = 3; ctx.strokeRect(20,20,984,984);
    ctx.fillStyle = '#332a25'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '600 76px Georgia, serif'; ctx.fillText('E S S E N C E',512,245,920);
    ctx.fillStyle = '#97816d'; ctx.fillRect(380,330,264,3);
    ctx.fillStyle = '#3a2b23'; ctx.font = '400 115px Georgia, serif'; ctx.fillText(name.toUpperCase(),512,514,850);
    if (engraving) {
      ctx.fillStyle = '#846b55'; ctx.font = 'italic 47px Georgia, serif'; ctx.fillText(engraving.toUpperCase(),512,635,880);
    }
    ctx.fillStyle = '#675345'; ctx.font = '500 39px Georgia, serif'; ctx.fillText('EAU DE PARFUM',512,778,850);
    ctx.font = '30px Georgia, serif'; ctx.fillText('PARIS  ·  100 ML',512,844,850);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [name, engraving]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Bottle({ fragrance, finish = 'smoke', cap = 'gold', engraving = '', interactive = false }) {
  const group = useRef();
  const color = fragrance?.liquid || '#775139';
  const finishColor = finish === 'rose' ? '#9c5366' : finish === 'crystal' ? '#d6d4ca' : finish === 'amber' ? '#a86c32' : '#37312f';
  const capColor = cap === 'silver' ? '#aeb3b2' : cap === 'black' ? '#242321' : '#b9a17b';
  const labelMap = useLabelTexture(fragrance?.name || 'NOCTURNE', engraving);
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
        <meshBasicMaterial map={labelMap} toneMapped={false} />
      </mesh>
      <mesh position={[-0.94,-0.3,0.49]} scale={[0.018,2.4,0.018]}>
        <sphereGeometry args={[1,8,16]}/>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.23}/>
      </mesh>
    </group>
  );
}

export default function BottleStage({ fragrance, finish, cap, engraving, interactive = false, className = '' }) {
  return <div className={'bottle-stage ' + className} role="img" aria-label={'3D bottle for ' + (fragrance?.name || 'ESSENCE')}>
    <WebGLBoundary name={fragrance?.name || 'Nocturne'}>
      <Canvas dpr={[1,1.7]} camera={{ position:[0,0.2,6.8], fov:33 }} gl={{ alpha:true, antialias:true, powerPreference:'high-performance' }}>
        <ambientLight intensity={1.8}/>
        <directionalLight position={[4,6,6]} intensity={4.2} color="#ffe5c1"/>
        <directionalLight position={[-5,2,-4]} intensity={3} color="#c1b3a8"/>
        <spotLight position={[-3,6,3]} angle={0.42} intensity={5} color="#d2a575"/>
        <Suspense fallback={null}>
          <Bottle fragrance={fragrance} finish={finish} cap={cap} engraving={engraving} interactive={interactive}/>
          <ContactShadows position={[0,-2.35,0]} opacity={0.38} scale={5.5} blur={2.6} far={3} color="#060504"/>
        </Suspense>
        {interactive && <OrbitControls enablePan={false} minDistance={5} maxDistance={9} minPolarAngle={0.55} maxPolarAngle={2.2} enableDamping dampingFactor={0.075} />}
      </Canvas>
    </WebGLBoundary>
    {interactive && <div className="stage-hint">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div>}
  </div>;
}
