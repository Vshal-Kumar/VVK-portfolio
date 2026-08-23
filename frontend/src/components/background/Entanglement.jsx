import React, { useEffect, useRef } from 'react';

export default function Entanglement({ opacity = 0.8 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    let pairs = [];

    function setupPairs() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      const isMobile = width < 768;
      const numPairs = isMobile ? 1 : 2;

      pairs = [];

      for (let i = 0; i < numPairs; i++) {
        // Spread pairs in distinct viewport regions
        const xOffset = i === 0 ? width * 0.2 : width * 0.7;
        const yOffset = i === 0 ? height * 0.35 : height * 0.65;

        pairs.push({
          p1: {
            baseX: xOffset - (120 + Math.random() * 80),
            baseY: yOffset - (30 + Math.random() * 40),
            phase: Math.random() * Math.PI * 2
          },
          p2: {
            baseX: xOffset + (120 + Math.random() * 80),
            baseY: yOffset + (30 + Math.random() * 40),
            phase: Math.random() * Math.PI * 2
          },
          curveHeight: 40 + Math.random() * 40,
          pulseTimer: Math.random() * 10,
          pulseDuration: 4.5,
          pulseActive: false,
          pulseProgress: 0
        });
      }
    }

    window.addEventListener('resize', setupPairs);
    setupPairs();

    let lastTime = performance.now();

    function render(currentTime) {
      const delta = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      pairs.forEach((pair) => {
        // Update subtle floating position
        pair.p1.phase += delta * 0.5;
        pair.p2.phase += delta * 0.5;

        const x1 = pair.p1.baseX + Math.sin(pair.p1.phase) * 15;
        const y1 = pair.p1.baseY + Math.cos(pair.p1.phase * 0.8) * 12;

        const x2 = pair.p2.baseX + Math.cos(pair.p2.phase) * 15;
        const y2 = pair.p2.baseY + Math.sin(pair.p2.phase * 0.8) * 12;

        // Entanglement pulse cycle
        pair.pulseTimer += delta;
        if (pair.pulseTimer > 7.0) {
          pair.pulseTimer = 0;
          pair.pulseActive = true;
          pair.pulseProgress = 0;
        }

        let linkAlpha = 0.04;
        let p1Glow = 0.15;
        let p2Glow = 0.15;

        if (pair.pulseActive) {
          pair.pulseProgress += delta / pair.pulseDuration;
          if (pair.pulseProgress >= 1) {
            pair.pulseActive = false;
          } else {
            const p = pair.pulseProgress;
            // Bell state synchronized pulse wave
            linkAlpha = 0.04 + Math.sin(p * Math.PI) * 0.12;
            p1Glow = 0.15 + (1 - p) * 0.25 * Math.sin(p * Math.PI * 2);
            p2Glow = 0.15 + p * 0.25 * Math.sin(p * Math.PI * 2);
          }
        }

        // Draw curved entanglement bridge
        const cx = (x1 + x2) / 2;
        const cy = Math.min(y1, y2) - pair.curveHeight;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(200, 191, 170, ${linkAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Particle A
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 243, ${p1Glow})`;
        ctx.fill();

        // Particle A halo
        ctx.beginPath();
        ctx.arc(x1, y1, 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 191, 170, ${p1Glow * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Particle B
        ctx.beginPath();
        ctx.arc(x2, y2, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 243, ${p2Glow})`;
        ctx.fill();

        // Particle B halo
        ctx.beginPath();
        ctx.arc(x2, y2, 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 191, 170, ${p2Glow * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupPairs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 4,
        pointerEvents: 'none',
        opacity
      }}
    />
  );
}
