import React, { useEffect, useRef } from 'react';
import './DarkVeil.css';

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0.015,
  scanlineIntensity = 0,
  speed = 0.12,
  scanlineFrequency = 0,
  warpAmount = 0.12,
  resolutionScale = 0.75
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) return;

    let animationFrameId;
    let startTime = performance.now();

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Graphite/slate grey monochrome palette shader
    const fsSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uNoiseIntensity;
      uniform float uWarpAmount;
      varying vec2 vUv;

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

        float t = uTime * 0.04;
        
        // Fluid domain warping
        vec2 q = vec2(snoise(st + vec2(t * 0.3, t * 0.2)), snoise(st + vec2(1.7, 9.2) - t * 0.2));
        vec2 r = vec2(snoise(st + 1.5 * q + vec2(t * 0.15, 3.4)), snoise(st + 1.5 * q + vec2(8.3, t * 0.18)));
        float f = snoise(st + r * uWarpAmount);

        // Base color mapping: deep obsidian charcoal to rich dark graphite
        vec3 colDark = vec3(0.062, 0.070, 0.078);  // #101214
        vec3 colMid  = vec3(0.086, 0.095, 0.106);  // #16181b
        vec3 colWarm = vec3(0.115, 0.125, 0.138);  // #1d2023

        float mixFactor = clamp((f + 1.0) * 0.5, 0.0, 1.0);
        vec3 color = mix(colDark, mix(colMid, colWarm, mixFactor), mixFactor);

        // Subtle fine grain noise for research-grade texture
        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        color += (grain - 0.5) * uNoiseIntensity;

        // Soft radial vignette to keep center content crisp
        float dist = length(uv - 0.5);
        color *= (1.0 - dist * 0.22);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'position');
    const resolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const noiseIntensityLoc = gl.getUniformLocation(program, 'uNoiseIntensity');
    const warpAmountLoc = gl.getUniformLocation(program, 'uWarpAmount');

    function resize() {
      const width = Math.floor(window.innerWidth * resolutionScale);
      const height = Math.floor(window.innerHeight * resolutionScale);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    window.addEventListener('resize', resize);
    resize();

    function render() {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000 * speed;

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform1f(noiseIntensityLoc, noiseIntensity);
      gl.uniform1f(warpAmountLoc, warpAmount);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [noiseIntensity, warpAmount, speed, resolutionScale]);

  return (
    <div className="dark-veil-container">
      <canvas ref={canvasRef} className="dark-veil-canvas" />
    </div>
  );
}
