import React, { useEffect, useRef } from 'react';

export default function QuantumWaveform({ opacity = 0.75 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      time += 0.008;

      // Draw two subtle quantum wavepacket superpositions
      const waves = [
        {
          baseY: height * 0.42,
          amplitude: 14,
          wavelength: 0.005,
          speed: 1.0,
          envelopeCenter: width * 0.35,
          envelopeWidth: width * 0.28,
          alpha: 0.065
        },
        {
          baseY: height * 0.78,
          amplitude: 18,
          wavelength: 0.004,
          speed: -0.8,
          envelopeCenter: width * 0.68,
          envelopeWidth: width * 0.32,
          alpha: 0.055
        }
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(212, 208, 200, ${w.alpha})`;
        ctx.lineWidth = 1;

        let first = true;
        const step = 4;

        for (let x = 0; x <= width; x += step) {
          // Gaussian envelope: e^(-((x - x0)/sigma)^2)
          const dist = (x - w.envelopeCenter) / w.envelopeWidth;
          const envelope = Math.exp(-dist * dist * 3.0);

          // Superposition harmonic: sin(k1*x - w*t) + 0.4*sin(2*k1*x - 1.5*w*t)
          const phase = x * w.wavelength - time * w.speed;
          const harmonic = Math.sin(phase) + 0.35 * Math.sin(phase * 2.1 + 1.2);

          const y = w.baseY + harmonic * w.amplitude * envelope;

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Wave probability density line (dashed |psi|^2 envelope)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(200, 191, 170, ${w.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);

        first = true;
        for (let x = 0; x <= width; x += step * 2) {
          const dist = (x - w.envelopeCenter) / w.envelopeWidth;
          const envelope = Math.exp(-dist * dist * 3.0);
          const y = w.baseY - envelope * w.amplitude * 1.35;

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
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
        zIndex: 5,
        pointerEvents: 'none',
        opacity
      }}
    />
  );
}
