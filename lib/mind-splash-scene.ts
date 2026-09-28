import { isMobileRendering, mobilePixelRatio } from "./render-budget";
import * as THREE from "three";
import { HERO_BACKGROUND_FRAGMENT } from "./hero-atmosphere";

// The splash shares the hero's sky beneath its photographic glass layer.
export function createMindSplashScene(host: HTMLElement) {
  const compact = isMobileRendering();
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(compact ? mobilePixelRatio(host.clientWidth, host.clientHeight) : Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x141417, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const time = { value: 0 }, aspect = { value: 1 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    depthWrite: false, depthTest: false,
    uniforms: { uTime: time, uAspect: aspect, uProgress: { value: 0 }, uMotion: { value: 1 } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: HERO_BACKGROUND_FRAGMENT,
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
  let frame = 0;
  const draw = () => {
    time.value = (performance.now() - start) / 1000;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(draw);
  };
  if (!compact) draw();
  return { dispose() {
    cancelAnimationFrame(frame); observer.disconnect();
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}
