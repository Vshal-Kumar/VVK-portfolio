import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl';
import './Particles.css';

export default function Particles({
  particleColors = ['#f5f5f3', '#d4d0c8', '#c8bfaa'],
  particleCount = 90,
  particleSpread = 14,
  speed = 0.02,
  particleBaseSize = 40,
  moveParticlesOnHover = true,
  particleHoverFactor = 0.2,
  alphaParticles = true,
  sizeRandomness = 0.8,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isDestroyed = false;

    const renderer = new Renderer({
      alpha: true,
      depth: false,
      dpr: Math.min(window.devicePixelRatio || 1, pixelRatio)
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, cameraDistance);

    function resize() {
      if (isDestroyed) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize);
    resize();

    const scene = new Transform();

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255
          ]
        : [0.95, 0.95, 0.95];
    };

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count * 4);

    const colorPalette = particleColors.map(hexToRgb);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * particleSpread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * particleSpread * 0.75;
      positions[i * 3 + 2] = (Math.random() - 0.5) * (particleSpread * 0.5);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3 + 0] = col[0];
      colors[i * 3 + 1] = col[1];
      colors[i * 3 + 2] = col[2];

      sizes[i] = particleBaseSize * (1 - sizeRandomness + Math.random() * sizeRandomness);

      randoms[i * 4 + 0] = Math.random();
      randoms[i * 4 + 1] = Math.random();
      randoms[i * 4 + 2] = Math.random();
      randoms[i * 4 + 3] = Math.random();
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      color: { size: 3, data: colors },
      size: { size: 1, data: sizes },
      random: { size: 4, data: randoms }
    });

    const vertex = `
      attribute vec3 position;
      attribute vec3 color;
      attribute float size;
      attribute vec4 random;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uSpeed;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;

        vec3 pos = position;
        
        // Gentle quantum oscillatory drift
        pos.x += sin(uTime * uSpeed * 0.5 + random.x * 6.28) * 0.35;
        pos.y += cos(uTime * uSpeed * 0.4 + random.y * 6.28) * 0.35;
        pos.z += sin(uTime * uSpeed * 0.3 + random.z * 6.28) * 0.2;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Size attenuation with distance
        gl_PointSize = size * (24.0 / -mvPosition.z);

        // Soft pulsing alpha
        vAlpha = 0.25 + 0.35 * sin(uTime * uSpeed * 0.8 + random.w * 6.28);
      }
    `;

    const fragment = `
      precision highp float;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Soft circular gaussian falloff
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha * 0.6;
        gl_FragColor = vec4(vColor, alpha);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: alphaParticles,
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed }
      }
    });

    const particlesMesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    particlesMesh.setParent(scene);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e) => {
      if (!moveParticlesOnHover) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = x * particleHoverFactor * 0.15;
      targetRotX = -y * particleHoverFactor * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let lastTime = performance.now();
    let totalTime = 0;

    function update(t) {
      if (isDestroyed) return;
      animationFrameId = requestAnimationFrame(update);

      const delta = (t - lastTime) * 0.001;
      lastTime = t;
      totalTime += delta;

      program.uniforms.uTime.value = totalTime;

      if (!disableRotation) {
        particlesMesh.rotation.y += (targetRotY - particlesMesh.rotation.y) * 0.04;
        particlesMesh.rotation.x += (targetRotX - particlesMesh.rotation.x) * 0.04;
      }

      renderer.render({ scene, camera });
    }

    animationFrameId = requestAnimationFrame(update);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    particleColors,
    particleCount,
    particleSpread,
    speed,
    particleBaseSize,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return <div ref={containerRef} className="particles-container" />;
}
