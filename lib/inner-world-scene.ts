import * as THREE from "three";
import { createFusionOrb } from "./fusion-orb";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type InnerWorldScene = { setPaused: (value: boolean) => void; dispose: () => void };

// Visual vocabulary, not a diagnosis or a claim about the visitor.
export const thoughtWords = [
  "UNSAID", "UNSEEN", "ECHO", "ABSENCE", "AGAIN", "ALMOST", "ELSEWHERE", "STATIC",
  "STILL", "WITHIN", "DISTANT", "SILENT", "DRIFT", "AFTERIMAGE", "UNFINISHED", "HOLLOW",
  "BETWEEN", "TRACE", "UNHEARD", "RETURN", "THRESHOLD", "REMNANT", "OTHER", "NEARLY",
  "FRACTURE", "WAIT", "PAUSE", "OUTSIDE", "INSIDE", "FAR", "LOOP", "ERASURE"
];

export const THOUGHT_WORD_COUNT = 128 * 80;

function wordTexture(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#000";
  context.fillRect(0, 0, size, size);
  context.textBaseline = "middle";
  const cellWidth = size / 80;
  const cellHeight = size / 128;
  // 10,240 separate word instances, with no sentences or generated personal claims.
  for (let row = 0; row < 128; row++) {
    for (let column = 0; column < 80; column++) {
      const word = thoughtWords[(row * 7 + column * 3 + (row % 4 === 0 ? 0 : column)) % thoughtWords.length];
      context.font = `400 ${cellHeight * (.58 + ((row + column) % 4) * .06)}px "IBM Plex Mono", monospace`;
      context.fillStyle = `rgb(${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130})`;
      context.fillText(word, column * cellWidth + cellWidth * .06, (row + .5) * cellHeight + Math.sin(column * 4 + row) * cellHeight * .08, cellWidth * .89);
    }
  }
  // Occasional larger fragments surface above the dense, quieter layer.
  for (let index = 0; index < 80; index++) {
    const x = ((index * 337) % 1900) / 2048 * size;
    const y = ((index * 193 + 53) % 2000) / 2048 * size;
    context.fillStyle = "#080909";
    context.fillRect(x - 2, y - size * .007, size * .068, size * .014);
    context.font = `400 ${size * .012}px "IBM Plex Mono", monospace`;
    context.fillStyle = "#eeeeee";
    context.fillText(thoughtWords[index % thoughtWords.length], x, y, size * .064);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function disposeObject(object: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  object.traverse(child => {
    if (!(child instanceof THREE.Mesh || child instanceof THREE.Points)) return;
    child.geometry.dispose();
    (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => {
      Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
      material.dispose();
    });
  });
  textures.forEach(texture => texture.dispose());
}

// Reconstruct the damaged side from the intact scanned half. Clipping crossing
// triangles at the center keeps a closed seam and preserves the original contours.
function repairHeadSymmetry(source: THREE.BufferGeometry) {
  const position = source.getAttribute("position"), normal = source.getAttribute("normal"), uv = source.getAttribute("uv");
  const indices = source.getIndex();
  const vertices: number[] = [], normals: number[] = [], uvs: number[] = [];
  type Vertex = { p: THREE.Vector3; n: THREE.Vector3; uv: THREE.Vector2 };
  const read = (index: number): Vertex => ({
    p: new THREE.Vector3().fromBufferAttribute(position, index),
    n: new THREE.Vector3().fromBufferAttribute(normal, index),
    uv: new THREE.Vector2(uv.getX(index), uv.getY(index)),
  });
  const emit = (triangle: Vertex[], mirror: boolean) => {
    for (const v of mirror ? [...triangle].reverse() : triangle) {
      vertices.push(v.p.x * (mirror ? -1 : 1), v.p.y, v.p.z);
      normals.push(v.n.x * (mirror ? -1 : 1), v.n.y, v.n.z);
      uvs.push(v.uv.x, v.uv.y);
    }
  };
  for (let i = 0; i < (indices?.count ?? position.count); i += 3) {
    const triangle = [0, 1, 2].map(offset => read(indices ? indices.getX(i + offset) : i + offset));
    const clipped: Vertex[] = [];
    for (let corner = 0; corner < 3; corner++) {
      const a = triangle[corner], b = triangle[(corner + 1) % 3];
      if (a.p.x <= 0) clipped.push(a);
      if ((a.p.x <= 0) !== (b.p.x <= 0)) {
        const t = -a.p.x / (b.p.x - a.p.x);
        const intersection = { p: a.p.clone().lerp(b.p, t), n: a.n.clone().lerp(b.n, t).normalize(), uv: a.uv.clone().lerp(b.uv, t) };
        intersection.p.x = 0;
        clipped.push(intersection);
      }
    }
    for (let fan = 1; fan + 1 < clipped.length; fan++) {
      const triangle = [clipped[0], clipped[fan], clipped[fan + 1]];
      emit(triangle, false); emit(triangle, true);
    }
  }
  const raw = new THREE.BufferGeometry();
  raw.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  raw.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  raw.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  const repaired = mergeVertices(raw);
  raw.dispose();
  return repaired;
}

export async function createInnerWorldScene(host: HTMLDivElement, hero: HTMLElement, signal: AbortSignal): Promise<InnerWorldScene> {
  const response = await fetch("/models/inner-world-head.glb", { signal });
  if (!response.ok) throw new Error("Figure could not be loaded");
  const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "/models/");
  if (signal.aborted) { disposeObject(gltf.scene); throw new DOMException("Aborted", "AbortError"); }
  await document.fonts.ready;
  let source: THREE.Mesh | undefined;
  gltf.scene.traverse(child => { if (child instanceof THREE.Mesh) source = child; });
  if (!source) { disposeObject(gltf.scene); throw new Error("Figure geometry missing"); }
  const geometry = repairHeadSymmetry(source.geometry);
  geometry.scale(.62, .62, .62);
  const outerGeometry = geometry.clone();
  const outerPosition = outerGeometry.getAttribute("position");
  for (let index = 0; index < outerPosition.count; index++) {
    const x = outerPosition.getX(index), y = outerPosition.getY(index), z = outerPosition.getZ(index);
    const ellipse = (x / .88) ** 2 + ((y - .94) / 1.32) ** 2;
    if (z > .45 && ellipse < 1.18) outerPosition.setZ(index, THREE.MathUtils.lerp(z, 1.06, 1 - THREE.MathUtils.smoothstep(ellipse, .92, 1.18)));
  }
  outerGeometry.computeVertexNormals();
  const position = geometry.getAttribute("position");
  // Hollow the scanned face while preserving the cranium, ears, neck and shoulders.
  for (let index = 0; index < position.count; index++) {
    let x = position.getX(index);
    const y = position.getY(index), z = position.getZ(index);
    // Blend the inward ear folds into the adjacent cranial curve. This moves
    // protruding geometry outward instead of cutting holes in the inner wall.
    const earWeight = THREE.MathUtils.smoothstep(Math.abs(x), .6, .74)
      * THREE.MathUtils.smoothstep(y, .25, .5)
      * (1 - THREE.MathUtils.smoothstep(y, .96, 1.25))
      * THREE.MathUtils.smoothstep(z, -.7, -.48)
      * (1 - THREE.MathUtils.smoothstep(z, .42, .7));
    const sideCurve = 1.26 * Math.sqrt(Math.max(0, 1 - ((z + .12) / 1.5) ** 2));
    x = Math.sign(x) * THREE.MathUtils.lerp(Math.abs(x), sideCurve, earWeight);
    position.setX(index, x);
    const ellipse = (x / .88) ** 2 + ((y - .94) / 1.32) ** 2;
    if (z > .45 && ellipse < 1.18) {
      const blend = 1 - THREE.MathUtils.smoothstep(ellipse, .92, 1.18);
      position.setZ(index, THREE.MathUtils.lerp(z, 1.06, blend));
    }
  }
  geometry.computeVertexNormals();
  disposeObject(gltf.scene);
  if (signal.aborted) { geometry.dispose(); outerGeometry.dispose(); throw new DOMException("Aborted", "AbortError"); }

  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }); }
  catch (error) { geometry.dispose(); outerGeometry.dispose(); throw error; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.5));
  renderer.setClearColor(0x080a0b);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 60);
  const figure = new THREE.Group();
  scene.add(figure);
  const words = wordTexture(Math.min(renderer.capabilities.maxTextureSize, window.innerWidth < 768 ? 2048 : 4096));
  const time = { value: 0 };
  const progressUniform = { value: 0 };
  const portalCamera = { value: new THREE.Vector3(0, .25, 8) };
  const fusion = createFusionOrb(figure, portalCamera);
  fusion.setGlobeVisible(false);
  const makeBodyMaterial = (interior: boolean) => {
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: interior ? 0x090e11 : 0x141819, metalness: .72, roughness: interior ? .6 : .42, clearcoat: interior ? .05 : .2, envMapIntensity: interior ? .12 : .4, side: THREE.DoubleSide });
  bodyMaterial.onBeforeCompile = shader => {
    shader.uniforms.uThoughts = { value: words };
    shader.uniforms.uTime = time;
    shader.uniforms.uProgress = progressUniform;
    shader.uniforms.uPortalCamera = portalCamera;
    shader.uniforms.uInterior = { value: interior };
    shader.uniforms.uOrbPosition = { value: fusion.position };
    shader.uniforms.uImpact = fusion.impact;
    shader.uniforms.uImpactPosition = fusion.impactPosition;
    shader.vertexShader = "varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vThoughtPosition = position; vThoughtUv = uv;");
    shader.fragmentShader = `uniform vec3 uOrbPosition; uniform vec3 uImpactPosition; uniform float uImpact; uniform sampler2D uThoughts; uniform bool uInterior; uniform vec3 uPortalCamera; uniform float uTime; uniform float uProgress; varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <clipping_planes_fragment>", `
      #include <clipping_planes_fragment>
      float faceEllipse=pow(vThoughtPosition.x/.88,2.)+pow((vThoughtPosition.y-.94)/1.32,2.);
      if(faceEllipse<.91 && (!uInterior || vThoughtPosition.z>-.25)) discard;
      bool inside=false;
      if(vThoughtPosition.z<1.085){
        if(uPortalCamera.z<=1.075) inside=true;
        else {
          float t=(uPortalCamera.z-1.075)/(uPortalCamera.z-vThoughtPosition.z);
          vec3 hit=mix(uPortalCamera,vThoughtPosition,t);
          inside=pow(hit.x/.844,2.)+pow((hit.y-.94)/1.26,2.)<1.;
        }
      }
      if(uInterior){
        if(!inside || gl_FrontFacing) discard;

      }else if(inside) discard;
    `);
    shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `
      #include <emissivemap_fragment>
      vec2 thoughtUv=vThoughtUv;
      float row=floor(thoughtUv.y*64.);
      thoughtUv.x+=sin(row*7.13)*uTime*.0008+sin(row*4.2)*uProgress*.1;
      thoughtUv.y+=uTime*.001+uProgress*.085;
      float ink=texture2D(uThoughts,thoughtUv).r;
      float warmth=smoothstep(.2,.65,uProgress)*.2;
      totalEmissiveRadiance+=ink*mix(vec3(.18,.21,.22),vec3(.26,.16,.15),warmth)*(uInterior ? .45 : 1.);
      if(uInterior){
        float glow=exp(-length(vThoughtPosition-uOrbPosition)*2.2);
        float hitDistance=length(vThoughtPosition-uImpactPosition);
        float hit=exp(-hitDistance*4.)*uImpact;
        float ripple=exp(-pow((hitDistance-(1.-uImpact)*1.5)*9.,2.))*uImpact;
        totalEmissiveRadiance+=vec3(.12,.28,.38)*glow+vec3(.28,.2,.5)*(hit+ripple*.4);
      }
    `);
  };
  bodyMaterial.customProgramCacheKey = () => interior ? "inner-head" : "outer-head";
  return bodyMaterial;
  };
  const body = new THREE.Mesh(outerGeometry, makeBodyMaterial(false));
  const interiorBody = new THREE.Mesh(geometry, makeBodyMaterial(true));
  figure.add(body, interiorBody);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .06);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();

  const edge = new THREE.Mesh(new THREE.TorusGeometry(1, .011, 10, 128), new THREE.MeshStandardMaterial({ color: 0x4d5956, metalness: .85, roughness: .32, envMapIntensity: .8 }));
  edge.scale.set(.844, 1.26, 1);
  edge.position.set(0, .94, 1.08);
  figure.add(edge);

  const haze = new THREE.Mesh(new THREE.PlaneGeometry(160, 100), new THREE.ShaderMaterial({
    depthWrite: false, uniforms: {uProgress: progressUniform},
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float uProgress;void main(){vec2 p=vUv-.5;float glow=exp(-dot(p*vec2(1.2,.8),p*vec2(1.2,.8))*12.);vec3 c=mix(vec3(.009,.012,.014),vec3(.023,.029,.031),glow);c*=1.-smoothstep(.2,.48,uProgress);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`
  }));
  haze.position.set(1, .5, -40);
  scene.add(haze);
  scene.add(new THREE.AmbientLight(0xa5b9bd, .17));
  const key = new THREE.DirectionalLight(0xc4d5d8, 1.6); key.position.set(-4, 5, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0x93acb4, 2.2); rim.position.set(3, 2, -4); scene.add(rim);
  const red = new THREE.PointLight(0x983a33, 7, 9, 2); red.position.set(-3, -.5, 1); scene.add(red);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false, visible = true, destroyed = false, progress = 0, targetProgress = 0, elapsed = 0, frame = 0, lastFrame = 0;
  let pointerX = 0, pointerY = 0, lookX = 0, lookY = 0;
  let mobile = host.clientWidth < 768;
  const measure = () => { targetProgress = reduced.matches ? 0 : THREE.MathUtils.clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - host.clientHeight), 0, 1); };
  const draw = () => {
    const p = reduced.matches ? 0 : progress;
    const approach = THREE.MathUtils.smoothstep(p, 0, 1);
    figure.position.set(0, mobile ? .05 : -.2, 0);
    figure.rotation.set(-.015 + lookY * .05, lookX * .1 + Math.sin(elapsed * .12) * .012 * (1 - approach), 0);
    const cameraY = THREE.MathUtils.lerp(.25, .94 + figure.position.y, approach);
    const cameraZ = THREE.MathUtils.lerp(mobile ? 9.9 : 8, 1.04, approach);
    body.visible = interiorBody.visible = cameraZ > -1.8;
    edge.visible = cameraZ > 1.12;
    camera.position.set(0, cameraY, cameraZ);
    camera.lookAt(0, cameraY, cameraZ - 10);
    figure.updateMatrixWorld(true);
    portalCamera.value.copy(camera.position);
    figure.worldToLocal(portalCamera.value);
    time.value = elapsed;
    progressUniform.value = p;
    red.intensity = 7 + Math.sin(elapsed * .18) * .5 + p * 6;
    hero.style.setProperty("--inner-progress", p.toFixed(4));
    hero.style.setProperty("--inner-first", Math.max(0, 1 - p * 3.5).toFixed(3));
    hero.style.setProperty("--inner-second", Math.max(0, 1 - Math.abs(p - .47) * 5.5).toFixed(3));
    hero.style.setProperty("--inner-last", THREE.MathUtils.smoothstep(p, .72, .95).toFixed(3));
    renderer.render(scene, camera);
  };
  const animate = (now: number) => {
    if (destroyed) return;
    const delta = Math.min((now - (lastFrame || now)) / 1000, .05); lastFrame = now; elapsed += delta;
    const ease = 1 - Math.exp(-delta * 4.5);
    progress += (targetProgress - progress) * ease;
    lookX += (pointerX - lookX) * ease; lookY += (pointerY - lookY) * ease;
    fusion.update(delta, elapsed, lookX, lookY);
    draw(); frame = requestAnimationFrame(animate);
  };
  const sync = () => { cancelAnimationFrame(frame); lastFrame = 0; if (!paused && !reduced.matches && visible && !document.hidden && !destroyed) frame = requestAnimationFrame(animate); else draw(); };
  const resize = () => { mobile = host.clientWidth < 768; camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); measure(); draw(); };
  const pointer = (event: PointerEvent) => { if (event.pointerType === "mouse" && !paused && !reduced.matches) { pointerX = event.clientX / window.innerWidth - .5; pointerY = event.clientY / window.innerHeight - .5; } };
  const leave = () => { pointerX = 0; pointerY = 0; };
  const preference = () => { measure(); if (reduced.matches) { progress = 0; lookX = 0; lookY = 0; } sync(); };
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }); observer.observe(hero);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  window.addEventListener("scroll", measure, { passive: true }); hero.addEventListener("pointermove", pointer); hero.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", sync); reduced.addEventListener("change", preference);
  const lost = (event: Event) => { event.preventDefault(); paused = true; cancelAnimationFrame(frame); host.dataset.ready = "false"; hero.dataset.fallback = "true"; };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  resize(); progress = targetProgress; draw(); host.dataset.ready = "true"; sync();
  return {
    setPaused(value) { paused = value; sync(); },
    dispose() {
      destroyed = true; cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("scroll", measure); hero.removeEventListener("pointermove", pointer); hero.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", preference); renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeObject(scene); words.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove(); host.dataset.ready = "false";
    }
  };
}
