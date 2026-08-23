import React, { useState, useEffect } from 'react';
import DarkVeil from './DarkVeil';
import Particles from './Particles';
import QuantumCircuit from './QuantumCircuit';
import Entanglement from './Entanglement';
import QuantumWaveform from './QuantumWaveform';
import QubitStates from './QubitStates';
import BlochSphere from './BlochSphere';

export default function QuantumBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div
      className="quantum-background"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--bg, #101214)'
      }}
    >
      {/* 1. Atmospheric Deep Veil Layer */}
      <DarkVeil
        hueShift={0}
        noiseIntensity={0.012}
        scanlineIntensity={0}
        speed={reducedMotion ? 0.02 : 0.08}
        warpAmount={0.09}
        resolutionScale={0.75}
      />

      {/* 2. Quantum Particle Field Layer */}
      <Particles
        particleColors={['#f5f5f3', '#d4d0c8', '#c8bfaa']}
        particleCount={reducedMotion ? 40 : 85}
        particleSpread={15}
        speed={reducedMotion ? 0.005 : 0.018}
        particleBaseSize={38}
        moveParticlesOnHover={!reducedMotion}
        particleHoverFactor={0.15}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={22}
        disableRotation={reducedMotion}
        pixelRatio={1}
      />

      {/* 3. Quantum Logic Circuit Rails & Pulses */}
      {!reducedMotion && <QuantumCircuit opacity={0.75} />}

      {/* 4. Entangled Bell-State Pairs Overlay */}
      {!reducedMotion && <Entanglement opacity={0.75} />}

      {/* 5. Quantum Probability Waveform Harmonics */}
      {!reducedMotion && <QuantumWaveform opacity={0.7} />}

      {/* 6. Subtle Floating Dirac Notation Labels */}
      {!reducedMotion && <QubitStates />}

      {/* 7. Wireframe 3D Bloch Spheres */}
      <BlochSphere opacity={reducedMotion ? 0.4 : 0.75} />
    </div>
  );
}
