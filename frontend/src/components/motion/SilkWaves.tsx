'use client';

/**
 * SilkWaves — flowing silk-wave hero background (a recreation of the 21st.dev hero "Silk" look).
 * Zero dependencies: one WebGL1 canvas, one fullscreen triangle, one fragment shader.
 *
 * Usage (inside a `position: relative; overflow: hidden` hero):
 *   <SilkWaves />                          // 21st.dev blue
 *   <SilkWaves colors={ORANGE} />          // brand orange
 *
 * Performance: DPR capped at 1.5 and ~900k pixels, pauses offscreen, a single static
 * frame under prefers-reduced-motion, survives WebGL context loss.
 */

import { useEffect, useRef, type CSSProperties } from 'react';

export const BLUE = ['#050507', '#00103F', '#0034FF', '#4F6FFF'];
export const ORANGE = ['#050507', '#3A1400', '#FF7A00', '#FFB066'];

type Props = {
  /** 2–8 hex colours, dark → bright. The first one is the background. */
  colors?: string[];
  /** Animation speed multiplier (21st uses ~0.4). */
  speed?: number;
  /** Zoom: larger = more, smaller waves. */
  scale?: number;
  /** How strongly the waves fold (0–1). */
  intensity?: number;
  contrast?: number;
  /** Film grain amount (0–0.35). */
  grain?: number;
  seed?: number;
  /** Overall layer opacity (21st uses 0.42 over a near-black page). */
  opacity?: number;
  /** Fade the waves out toward the bottom of the hero. */
  fadeBottom?: boolean;
  className?: string;
  style?: CSSProperties;
};

const VERT = `attribute vec2 a_position;
void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_colors[8];
uniform float u_count;
uniform float u_scale;
uniform float u_intensity;
uniform float u_contrast;
uniform float u_grain;
uniform float u_seed;

float grainHash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 palette(float x){
  float n = max(u_count - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mix(col, u_colors[i + 1], smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  p *= u_scale;

  // Silk: iterated cosine domain-warp, each pass folds the field a little more.
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (int k = 1; k < 5; k++) {
    float i = float(k);
    q.x += amp / i * cos(i * 2.4 * q.y + u_time * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + u_time * 0.6);
  }
  vec3 col = palette(0.5 + 0.5 * sin(q.x + q.y));

  col = (col - 0.5) * u_contrast + 0.5;
  col += (grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.replace(/./g, '$&$&');
  const n = parseInt(h, 16);
  return Number.isFinite(n) ? [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] : [0.5, 0.5, 0.5];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[SilkWaves]', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function SilkWaves({
  colors = BLUE,
  speed = 0.4,
  scale = 1.26,
  intensity = 0.5,
  contrast = 1.03,
  grain = 0.035,
  seed = 1,
  opacity = 0.42,
  fadeBottom = true,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ colors, speed, scale, intensity, contrast, grain, seed });
  live.current = { colors, speed, scale, intensity, contrast, grain, seed };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[SilkWaves]', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // One triangle that covers the whole screen.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U('u_res'), uTime = U('u_time'), uColors = U('u_colors'), uCount = U('u_count');
    const uScale = U('u_scale'), uInt = U('u_intensity'), uCon = U('u_contrast'), uGrain = U('u_grain'), uSeed = U('u_seed');

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const maxPx = 900_000;
      if (r.width * r.height * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / Math.max(1, r.width * r.height));
      const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let time = 3; // start mid-flow so the first frame already looks good
    const draw = () => {
      const o = live.current;
      const cols = o.colors.slice(0, 8).map(hexToRgb);
      while (cols.length < 8) cols.push(cols[cols.length - 1] ?? [0, 0, 0]);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform3fv(uColors, new Float32Array(cols.flat()));
      gl.uniform1f(uCount, Math.min(o.colors.length, 8));
      gl.uniform1f(uScale, o.scale);
      gl.uniform1f(uInt, o.intensity);
      gl.uniform1f(uCon, o.contrast);
      gl.uniform1f(uGrain, o.grain);
      gl.uniform1f(uSeed, o.seed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, visible = false, last = performance.now();
    const tick = (now: number) => {
      time += ((now - last) / 1000) * live.current.speed;
      last = now;
      draw();
      if (visible && !reduce.matches && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (visible && !reduce.matches && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else draw();
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }, { rootMargin: '120px' });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    reduce.addEventListener('change', start);
    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); };
    canvas.addEventListener('webglcontextlost', onLost);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      reduce.removeEventListener('change', start);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  const fade = fadeBottom
    ? 'linear-gradient(#000, rgba(0,0,0,.88) 22%, rgba(0,0,0,.55) 44%, rgba(0,0,0,.2) 64%, transparent 84%)'
    : undefined;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        maskImage: fade,
        WebkitMaskImage: fade,
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}

export default SilkWaves;
