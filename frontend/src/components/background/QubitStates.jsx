import React, { useEffect, useState } from 'react';

const QUBIT_SYMBOLS = [
  '|0⟩',
  '|1⟩',
  '|ψ⟩',
  '|+⟩',
  '|−⟩',
  '|Φ⁺⟩',
  '|Ψ⁻⟩',
  'α|0⟩ + β|1⟩',
  'H|0⟩ = |+⟩',
  '|00⟩ + |11⟩ / √2'
];

export default function QubitStates() {
  const [states, setStates] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const maxCount = isMobile ? 3 : 5;

    const createInitialStates = () => {
      return Array.from({ length: maxCount }).map((_, idx) => ({
        id: idx,
        symbol: QUBIT_SYMBOLS[Math.floor(Math.random() * QUBIT_SYMBOLS.length)],
        x: 10 + Math.random() * 80, // %
        y: 15 + Math.random() * 70, // %
        duration: 8 + Math.random() * 6, // s
        delay: Math.random() * 5
      }));
    };

    setStates(createInitialStates());

    // Cycle symbols occasionally
    const interval = setInterval(() => {
      setStates((prev) =>
        prev.map((item) =>
          Math.random() > 0.6
            ? {
                ...item,
                symbol: QUBIT_SYMBOLS[Math.floor(Math.random() * QUBIT_SYMBOLS.length)],
                x: 10 + Math.random() * 80,
                y: 15 + Math.random() * 70
              }
            : item
        )
      );
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 6,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {states.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontFamily: 'monospace, "DM Sans", sans-serif',
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            color: 'rgba(245, 245, 243, 0.16)',
            userSelect: 'none',
            animation: `qubitFadeDrift ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`
          }}
        >
          {s.symbol}
        </div>
      ))}
      <style>{`
        @keyframes qubitFadeDrift {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          20% {
            opacity: 0.85;
          }
          75% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
            transform: translateY(-16px);
          }
        }
      `}</style>
    </div>
  );
}
