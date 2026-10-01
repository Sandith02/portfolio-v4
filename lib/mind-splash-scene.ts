import { isMobileRendering, renderPixelRatio } from "./render-budget";
import * as THREE from "three";
import { GALAXY_FIELD_GLSL } from "./galaxy-field";

// The same starfield and dust lanes as the inner worlds, without an image layer.
export function createMindSplashScene(host: HTMLElement) {
  const compact = isMobileRendering();
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(renderPixelRatio(host.clientWidth, host.clientHeight, compact, compact ? "high" : "balanced"));
  renderer.setClearColor(0x141417, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const time = { value: 0 }, aspect = { value: 1 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    depthWrite: false, depthTest: false,
    uniforms: { uTime: time, uAspect: aspect },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `varying vec2 vUv; uniform float uTime,uAspect;
      ${GALAXY_FIELD_GLSL}
      void main(){
        vec2 p=(vUv-.5)*vec2(uAspect,1.);
        // Omit the subpixel star grain, which shimmers into dots as it drifts.
        gl_FragColor=vec4(galaxyField(p,0.,0.,0.,.65,0.)*.72,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(geometry, material);
  sky.frustumCulled = false;
  scene.add(sky);
  const resize = () => {
    aspect.value = host.clientWidth / Math.max(host.clientHeight, 1);
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.render(scene, camera);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host); resize();
  const start = performance.now();
  let frame = 0, last = 0;
  const draw = (now: number) => {
    frame = requestAnimationFrame(draw);
    if (last && now - last < 1000 / 30 - 1) return;
    last = now;
    time.value = (now - start) / 4000;
    renderer.render(scene, camera);
  };
  const sync = () => {
    cancelAnimationFrame(frame); last = 0;
    if (!compact && !document.hidden) frame = requestAnimationFrame(draw);
  };
  document.addEventListener("visibilitychange", sync);
  sync();
  return { dispose() {
    document.removeEventListener("visibilitychange", sync);
    cancelAnimationFrame(frame); observer.disconnect();
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}
