import React, { useEffect, useRef } from 'react';

export default function QuantumCircuit({ opacity = 0.85 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Build circuit lines and gate nodes
    let circuits = [];
    let pulses = [];

    function setupCircuits() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      circuits = [];
      pulses = [];

      const isMobile = width < 768;
      const numRails = isMobile ? 3 : 5;
      const railSpacing = height / (numRails + 1);

      for (let i = 0; i < numRails; i++) {
        const y = railSpacing * (i + 1) + (Math.random() - 0.5) * 40;
        const nodes = [];
        const numNodes = isMobile ? 4 : 7;
        const xStep = width / (numNodes + 1);

        for (let j = 0; j < numNodes; j++) {
          const x = xStep * (j + 1) + (Math.random() - 0.5) * 30;
          nodes.push({
            x,
            y,
            type: j % 2 === 0 ? 'gate' : 'control', // 'gate' = box/circle, 'control' = dot
            pulseOffset: Math.random() * Math.PI * 2,
            hasBridge: j > 1 && j < numNodes - 1 && i < numRails - 1 && Math.random() > 0.55
          });
        }

        circuits.push({
          startY: y,
          nodes,
          speed: 0.2 + Math.random() * 0.2
        });

        // Initialize 1-2 pulses per rail
        pulses.push({
          railIndex: i,
          progress: Math.random(),
          speed: 0.0008 + Math.random() * 0.0006,
          length: 40 + Math.random() * 30
        });
      }
    }

    window.addEventListener('resize', setupCircuits);
    setupCircuits();

    let time = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      time += 0.015;

      // Draw quantum circuit lines
      circuits.forEach((circuit, cIdx) => {
        const nodes = circuit.nodes;
        if (nodes.length === 0) return;

        // Main rail line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(245, 245, 243, 0.055)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, nodes[0].y);
        for (let i = 0; i < nodes.length; i++) {
          ctx.lineTo(nodes[i].x, nodes[i].y);
        }
        ctx.lineTo(width, nodes[nodes.length - 1].y);
        ctx.stroke();

        // Draw nodes and bridge connections
        nodes.forEach((node, nIdx) => {
          const glow = 0.5 + 0.5 * Math.sin(time * 0.8 + node.pulseOffset);

          // Bridge to next rail (Entanglement / CNOT connection)
          if (node.hasBridge && cIdx < circuits.length - 1) {
            const nextRailNode = circuits[cIdx + 1].nodes[nIdx];
            if (nextRailNode) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(200, 191, 170, ${0.04 + glow * 0.04})`;
              ctx.lineWidth = 1;
              ctx.setLineDash([2, 4]);
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(nextRailNode.x, nextRailNode.y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          // Node representation
          if (node.type === 'gate') {
            // Small subtle gate box
            const size = 10;
            ctx.strokeStyle = `rgba(245, 245, 243, ${0.08 + glow * 0.08})`;
            ctx.fillStyle = 'rgba(42, 46, 48, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(node.x - size / 2, node.y - size / 2, size, size);
            ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
          } else {
            // Small circular control dot
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 191, 170, ${0.12 + glow * 0.12})`;
            ctx.fill();
          }
        });
      });

      // Draw travelling photon/electron wave packets
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1.2) {
          pulse.progress = -0.1;
        }

        const circuit = circuits[pulse.railIndex];
        if (!circuit || circuit.nodes.length === 0) return;

        const currentX = pulse.progress * width;
        const currentY = circuit.startY;

        const grad = ctx.createLinearGradient(
          currentX - pulse.length,
          currentY,
          currentX + pulse.length,
          currentY
        );
        grad.addColorStop(0, 'rgba(200, 191, 170, 0)');
        grad.addColorStop(0.5, 'rgba(245, 245, 243, 0.18)');
        grad.addColorStop(1, 'rgba(200, 191, 170, 0)');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(Math.max(0, currentX - pulse.length), currentY);
        ctx.lineTo(Math.min(width, currentX + pulse.length), currentY);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupCircuits);
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
        zIndex: 3,
        pointerEvents: 'none',
        opacity
      }}
    />
  );
}
