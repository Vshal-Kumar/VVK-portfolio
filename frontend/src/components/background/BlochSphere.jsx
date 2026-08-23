import React, { useEffect, useRef } from 'react';

export default function BlochSphere({ opacity = 0.85 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    let spheres = [];

    function setupSpheres() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      const isMobile = width < 768;
      const isTablet = width < 1024;

      spheres = [];

      // Sphere 1: Top right background region
      spheres.push({
        xRatio: 0.84,
        yRatio: 0.22,
        radius: isMobile ? 45 : 75,
        rotX: 0.35,
        rotY: 0.2,
        rotZ: 0,
        speedY: 0.002,
        speedX: 0.0015,
        // State vector spherical angles theta, phi
        theta: Math.PI / 3.2,
        phi: Math.PI / 4,
        phiSpeed: 0.006
      });

      // Sphere 2: Bottom left background region (desktop only)
      if (!isTablet) {
        spheres.push({
          xRatio: 0.12,
          yRatio: 0.78,
          radius: 60,
          rotX: 0.5,
          rotY: -0.3,
          rotZ: 0.1,
          speedY: -0.0018,
          speedX: 0.0012,
          theta: Math.PI / 2.2,
          phi: Math.PI / 1.5,
          phiSpeed: -0.005
        });
      }
    }

    window.addEventListener('resize', setupSpheres);
    setupSpheres();

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D rotation helper
    function rotate3D(x, y, z, rx, ry, rz) {
      // Rotate around X
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);

      // Rotate around Y
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);

      // Rotate around Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      return { x: x3, y: y3, z: z2 };
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      spheres.forEach((sphere) => {
        sphere.rotY += sphere.speedY;
        sphere.rotX += sphere.speedX;
        sphere.phi += sphere.phiSpeed;

        // Subtle mouse parallax
        const parallaxX = (mouseX / width - 0.5) * 8;
        const parallaxY = (mouseY / height - 0.5) * 8;

        const cx = sphere.xRatio * width + parallaxX;
        const cy = sphere.yRatio * height + parallaxY;
        const R = sphere.radius;

        // 1. Outer Sphere Circle
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 245, 243, 0.09)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 2. Coordinate Axes (Z: vertical, X: depth, Y: horizontal)
        const axes = [
          { name: '|0⟩', from: [0, -R * 1.25, 0], to: [0, R * 1.25, 0], labelTo: '|1⟩' },
          { name: '|+⟩', from: [-R * 1.2, 0, 0], to: [R * 1.2, 0, 0], labelTo: '|−⟩' },
          { name: '|i⟩', from: [0, 0, -R * 1.2], to: [0, 0, R * 1.2], labelTo: '|-i⟩' }
        ];

        axes.forEach((axis, idx) => {
          const p1 = rotate3D(axis.from[0], axis.from[1], axis.from[2], sphere.rotX, sphere.rotY, sphere.rotZ);
          const p2 = rotate3D(axis.to[0], axis.to[1], axis.to[2], sphere.rotX, sphere.rotY, sphere.rotZ);

          ctx.beginPath();
          ctx.strokeStyle = idx === 0 ? 'rgba(200, 191, 170, 0.16)' : 'rgba(245, 245, 243, 0.07)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.moveTo(cx + p1.x, cy + p1.y);
          ctx.lineTo(cx + p2.x, cy + p2.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Pole annotation
          if (idx === 0) {
            ctx.font = '10px monospace';
            ctx.fillStyle = 'rgba(245, 245, 243, 0.22)';
            ctx.fillText(axis.name, cx + p1.x - 6, cy + p1.y - 4);
            ctx.fillText(axis.labelTo, cx + p2.x - 6, cy + p2.y + 12);
          }
        });

        // 3. Equator Ellipse (X-Y plane)
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const px = Math.cos(angle) * R;
          const pz = Math.sin(angle) * R;
          const p = rotate3D(px, 0, pz, sphere.rotX, sphere.rotY, sphere.rotZ);
          if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
          else ctx.lineTo(cx + p.x, cy + p.y);
        }
        ctx.strokeStyle = 'rgba(200, 191, 170, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 4. Meridian Ellipse (X-Z plane)
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const px = Math.cos(angle) * R;
          const py = Math.sin(angle) * R;
          const p = rotate3D(px, py, 0, sphere.rotX, sphere.rotY, sphere.rotZ);
          if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
          else ctx.lineTo(cx + p.x, cy + p.y);
        }
        ctx.strokeStyle = 'rgba(245, 245, 243, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 5. State Vector |ψ⟩
        // Cartesian: x = R sin(theta) cos(phi), y = -R cos(theta), z = R sin(theta) sin(phi)
        const vx = R * Math.sin(sphere.theta) * Math.cos(sphere.phi);
        const vy = -R * Math.cos(sphere.theta);
        const vz = R * Math.sin(sphere.theta) * Math.sin(sphere.phi);

        const vRot = rotate3D(vx, vy, vz, sphere.rotX, sphere.rotY, sphere.rotZ);

        // Vector line from origin
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200, 191, 170, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + vRot.x, cy + vRot.y);
        ctx.stroke();

        // Vector tip dot (qubit state point)
        ctx.beginPath();
        ctx.arc(cx + vRot.x, cy + vRot.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 245, 243, 0.75)';
        ctx.fill();

        // Subtle state label
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(200, 191, 170, 0.38)';
        ctx.fillText('|ψ⟩', cx + vRot.x + 5, cy + vRot.y - 3);
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupSpheres);
      window.removeEventListener('mousemove', handleMouseMove);
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
        zIndex: 7,
        pointerEvents: 'none',
        opacity
      }}
    />
  );
}
