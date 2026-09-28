import { isMobileRendering, mobilePixelRatio } from "./render-budget";
import * as THREE from "three";
import { worldReturn } from "./world-navigation";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCosmicGalaxy } from "./cosmic-galaxy";
import { createPlanetarySystem } from "./planetary-system";
import { createMindGateway } from "./mind-gateway";
import { atmosphericEvents, HERO_BACKGROUND_FRAGMENT } from "./hero-atmosphere";

export type InnerWorldScene = { setPaused: (value: boolean) => void; dispose: () => void };

import { wordTexture } from "./thought-texture";
export { thoughtWords, THOUGHT_WORD_COUNT } from "./thought-texture";

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
  const compact = isMobileRendering();
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
  try { renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: false, powerPreference: "high-performance" }); }
  catch (error) { geometry.dispose(); outerGeometry.dispose(); throw error; }
  renderer.setPixelRatio(compact ? mobilePixelRatio(host.clientWidth, host.clientHeight) : Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x141417);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 60);
  const figure = new THREE.Group();
  scene.add(figure);
  const words = wordTexture(Math.min(renderer.capabilities.maxTextureSize, compact ? 1024 : 4096), false, compact);
  const time = { value: 0 };
  const atmosphereMotion = { value: 1 };
  const progressUniform = { value: 0 };
  const galaxy = createCosmicGalaxy(time, progressUniform);
  const globeWords = wordTexture(words.image.width, true, compact);
  const planets = createPlanetarySystem(renderer, hero, globeWords);
  scene.add(galaxy.mesh);
  const portalCamera = { value: new THREE.Vector3(0, .25, 8) };
  const reflectionPosition = { value: new THREE.Vector3(0, 1, .1) };
  const filmPointer = { value: new THREE.Vector2() };
  const makeBodyMaterial = (interior: boolean) => {
  const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: interior ? 0x010205 : 0x141819, metalness: interior ? .16 : .72, roughness: interior ? .76 : .48, clearcoat: interior ? .025 : .14, clearcoatRoughness: interior ? .5 : .22, envMapIntensity: interior ? .008 : .3, side: THREE.DoubleSide });
  bodyMaterial.onBeforeCompile = shader => {
    shader.uniforms.uThoughts = { value: words };
    shader.uniforms.uTime = time;
    shader.uniforms.uProgress = progressUniform;
    shader.uniforms.uPortalCamera = portalCamera;
    shader.uniforms.uInterior = { value: interior };
    shader.uniforms.uReflectionPosition = reflectionPosition;
    shader.vertexShader = "varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vThoughtPosition = position; vThoughtUv = uv;");
    shader.fragmentShader = `
      uniform vec3 uReflectionPosition; uniform sampler2D uThoughts; uniform bool uInterior;
      uniform vec3 uPortalCamera; uniform float uTime; uniform float uProgress;
      varying vec3 vThoughtPosition; varying vec2 vThoughtUv;
      float cosmicHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float cosmicNoise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(cosmicHash(i),cosmicHash(i+vec2(1.,0.)),f.x),
          mix(cosmicHash(i+vec2(0.,1.)),cosmicHash(i+vec2(1.,1.)),f.x),f.y);
      }
      float cosmicCloud(vec2 p){
        return .5*cosmicNoise(p)+.25*cosmicNoise(p*2.03+7.1)+.125*cosmicNoise(p*4.07+19.3);
      }
    ` + shader.fragmentShader;
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
    shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `
      #include <opaque_fragment>
      if(uInterior){
        float depthDarkness=smoothstep(.08,1.,uProgress);
        gl_FragColor.rgb*=mix(1.,.025,depthDarkness);
      }
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
        float glow=exp(-length(vThoughtPosition-uReflectionPosition)*2.2);
        // Cosmic pigment follows the real curved wall; the words remain a separate layer.
        vec2 sky=vThoughtUv*vec2(190.,170.);
        vec2 cell=floor(sky);
        float seed=cosmicHash(cell);
        vec2 starPosition=.15+.7*vec2(cosmicHash(cell+17.2),cosmicHash(cell+51.7));
        float radius=length(fract(sky)-starPosition);
        float star=exp(-radius*radius/(.005+fwidth(sky.x)*.016))*step(.85,seed);
        star*=.75+.25*sin(uTime*.32+seed*63.);
        vec2 cloudUv=vThoughtUv*10.+vec2(uTime*.003,0.);
        float cloud=cosmicCloud(cloudUv);
        float dust=cosmicCloud(cloudUv*3.2+cloud*2.);
        float nebula=pow(max(0.,cloud-.18),1.4)*(.3+dust);
        totalEmissiveRadiance+=vec3(.007,.012,.024)*glow;
        totalEmissiveRadiance+=mix(vec3(.035,.06,.115),vec3(.075,.045,.1),dust)*nebula;
        totalEmissiveRadiance+=vec3(.3,.36,.43)*star;
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
  planets.setEnvironment(environment.texture);
  room.dispose();
  pmrem.dispose();

  const edge = new THREE.Mesh(new THREE.TorusGeometry(1, .011, 10, 128), new THREE.MeshStandardMaterial({ color: 0x4d5956, metalness: .85, roughness: .32, envMapIntensity: .8 }));
  edge.scale.set(.844, 1.26, 1);
  edge.position.set(0, .94, 1.08);
  figure.add(edge);

  // A transparent, flexible film across the aperture, with soft moving reflections.
  const film = new THREE.Mesh(new THREE.PlaneGeometry(1.688, 2.52, compact ? 24 : 64, compact ? 24 : 64), new THREE.ShaderMaterial({
    uniforms: { uTime: time, uProgress: progressUniform, uPointer: filmPointer, uAspect: { value: .8 }, uMotion: atmosphereMotion },
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: `uniform float uTime;uniform vec2 uPointer;varying vec2 vUv;
      void main(){vUv=uv;vec3 p=position;float envelope=max(0.,1.-length((uv-.5)*2.));
      p.z+=sin(uv.x*7.+uv.y*5.+uTime*.6)*.012*envelope;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `uniform float uTime;uniform float uProgress;uniform float uAspect,uMotion;uniform vec2 uPointer;varying vec2 vUv;
      ${atmosphericEvents}
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);if(r>1.)discard;
        float drift=sin(uTime*.23)*.35+uPointer.x*.3;
        float curve=p.x*.72+p.y*.42+sin(p.y*2.6+uTime*.35)*.12;
        float broad=exp(-pow((curve-drift-.22)*5.,2.));
        float streak=exp(-pow((curve-drift-.25)*31.,2.));
        float secondary=exp(-pow((p.x*.8-p.y*.5+drift+.58)*14.,2.));
        float edge=pow(smoothstep(.83,1.,r),2.);
        float fade=1.-smoothstep(.72,.94,uProgress);
        // Bend travelling reflections around the laminate instead of drawing a flat overlay.
        vec2 reflectionUv=p*.5;
        reflectionUv+=vec2(p.y*p.y*.055,p.x*p.x*.12)+uPointer*.025;
        float reflectedMeteor=meteor(reflectionUv,0.)+meteor(reflectionUv,1.);
        float reflectedPulse=pulse(reflectionUv);
        float reflection=(reflectedMeteor*.7+reflectedPulse*2.4)*uMotion
          *(1.-smoothstep(.82,1.,r));
        float alpha=(.008+broad*.025+streak*.045+secondary*.015+edge*.025+reflection)*fade;
        vec3 tint=mix(vec3(.38,.47,.5),vec3(.82,.89,.9),streak);
        tint=mix(tint,vec3(.73,.84,.9),smoothstep(.005,.1,reflection));
        gl_FragColor=vec4(tint,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  film.position.set(0,.94,1.095);
  film.renderOrder=3;
  figure.add(film);
  const liningLight = new THREE.PointLight(0x9bb5c4, .6, 3.5, 2);
  figure.add(liningLight);

  const hazeAspect = { value: 1 };
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    depthWrite: false, depthTest: false,
    uniforms: { uProgress: progressUniform, uTime: time, uAspect: hazeAspect, uMotion: atmosphereMotion },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: HERO_BACKGROUND_FRAGMENT
  }));
  haze.frustumCulled = false;
  haze.renderOrder = -10;
  scene.add(haze);
  scene.add(new THREE.AmbientLight(0xa5b9bd, .17));
  const key = new THREE.DirectionalLight(0xc4d5d8, 1.6); key.position.set(-4, 5, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0x93acb4, 2.2); rim.position.set(3, 2, -4); scene.add(rim);
  const red = new THREE.PointLight(0x983a33, 7, 9, 2); red.position.set(-3, -.5, 1); scene.add(red);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const returnDestination = worldReturn(window.location.hash);
  const gateway = createMindGateway(hero);
  let paused = false, visible = true, destroyed = false, progress = 0, targetProgress = 0, elapsed = 0, frame = 0, lastFrame = 0;
  let pointerX = 0, pointerY = 0, lookX = 0, lookY = 0;
  let arrivalStarted: number | null = null;
  let arrival = 0;
  let mobile = host.clientWidth < 768;
  const measure = () => {
    const screen = Math.max(1, host.clientHeight);
    const distance = Math.max(0, -hero.getBoundingClientRect().top);
    targetProgress = reduced.matches ? (returnDestination?.progress ?? 0) : distance / screen;
  };
  const draw = () => {
    const p = Math.min(1, progress / 3);
    atmosphereMotion.value = reduced.matches ? 0 : 1;
    const approach = THREE.MathUtils.smoothstep(p, 0, 1);
    // Hold the figure below the frame until the splash starts dissolving.
    // Arrival only runs once; the camera and scroll journey keep their own positions.
    if (reduced.matches || progress > .08) arrival = 1;
    if (arrival < 1) {
      const splash = document.querySelector<HTMLElement>('.mind-splash:not([hidden])');
      if (arrivalStarted === null && (!splash || splash.dataset.leaving === "true")) {
        arrivalStarted = elapsed + (splash ? .35 : 0);
      }
      if (arrivalStarted !== null) {
        const t = THREE.MathUtils.clamp((elapsed - arrivalStarted) / 2.15, 0, 1);
        arrival = 1 - Math.pow(1 - t, 3);
      }
    }
    const arrivalState = arrival >= 1 ? "complete" : arrivalStarted === null ? "waiting" : "entering";
    if (host.dataset.arrival !== arrivalState) host.dataset.arrival = arrivalState;
    const baseY = (mobile ? .05 : -.2) + Math.sin(elapsed*.43)*.008;
    figure.position.set(Math.sin(elapsed*.31)*.012, baseY - (1 - arrival) * (mobile ? 6 : 5.2), 0);
    figure.rotation.set(-.015 + lookY*.05 + Math.sin(elapsed*.29)*.004, lookX*.1 + Math.sin(elapsed*.12)*.012, Math.sin(elapsed*.23)*.002);
    const cameraY = THREE.MathUtils.lerp(.25, .94 + baseY, approach);
    const cameraZ = THREE.MathUtils.lerp(mobile ? 9.9 : 8, 1.04, approach);
    // Once the galaxy is opaque, the head and its lights are fully covered.
    figure.visible = !compact || p < .98;
    haze.visible = !compact || p < .98;
    body.visible = interiorBody.visible = cameraZ > -1.8;
    edge.visible = cameraZ > 1.12;
    camera.position.set(0, cameraY, cameraZ);
    camera.lookAt(0, cameraY, cameraZ - 10);
    figure.updateMatrixWorld(true);
    portalCamera.value.copy(camera.position);
    figure.worldToLocal(portalCamera.value);
    reflectionPosition.value.set(Math.sin(elapsed*.35)*.4, .94+Math.cos(elapsed*.27)*.5, .1);
    liningLight.position.copy(reflectionPosition.value);
    liningLight.intensity=.15*(1.-THREE.MathUtils.smoothstep(p,.08,1.)*.7);
    filmPointer.value.set(lookX,lookY);
    time.value = elapsed;
    progressUniform.value = p;
    galaxy.journey.value = Math.max(0, progress - 3);
    galaxy.mesh.visible = p > .77;
    red.intensity = 7 + Math.sin(elapsed * .18) * .5 + p * 6;
    hero.style.setProperty("--inner-first", Math.max(0, 1 - p * 3.5).toFixed(3));
    hero.style.setProperty("--inner-second", Math.max(0, 1 - Math.abs(p - .47) * 5.5).toFixed(3));
    hero.style.setProperty("--inner-last", (THREE.MathUtils.smoothstep(p, .72, .85) * (1 - THREE.MathUtils.smoothstep(p, .83, .94))).toFixed(3));
    renderer.render(scene, camera);
    planets.draw(progress, elapsed);
  };
  const animate = (now: number) => {
    if (destroyed) return;
    frame = requestAnimationFrame(animate);
    if (compact && lastFrame && now - lastFrame < 1000 / 30 - 1) return;
    // The intro covers the hero. Keep its prepared first frame, not two live skies.
    if (compact && document.documentElement.dataset.splash === "active" && !document.querySelector('.mind-splash[data-leaving="true"]')) { lastFrame = now; return; }
    const delta = Math.min((now - (lastFrame || now)) / 1000, .05); lastFrame = now; elapsed += delta;
    const ease = 1 - Math.exp(-delta * 4.5);
    if (hero.dataset.rewindProgress !== undefined) { measure(); progress = targetProgress; }
    else progress += (targetProgress - progress) * ease;
    gateway.update(progress);
    lookX += (pointerX - lookX) * ease; lookY += (pointerY - lookY) * ease;
    draw();
  };
  const sync = () => { cancelAnimationFrame(frame); lastFrame = 0; if (!paused && !reduced.matches && visible && !document.hidden && !destroyed) frame = requestAnimationFrame(animate); else if (!destroyed && !document.hidden && visible) draw(); };
  const resize = () => { mobile = host.clientWidth < 768; camera.aspect = host.clientWidth / host.clientHeight; galaxy.aspect.value = hazeAspect.value = camera.aspect; camera.updateProjectionMatrix(); if (compact) renderer.setPixelRatio(mobilePixelRatio(host.clientWidth, host.clientHeight)); renderer.setSize(host.clientWidth, host.clientHeight); planets.resize(host.clientWidth, host.clientHeight); measure(); draw(); };
  const pointer = (event: PointerEvent) => { if (event.pointerType === "mouse" && !paused && !reduced.matches) { pointerX = event.clientX / window.innerWidth - .5; pointerY = event.clientY / window.innerHeight - .5; } };
  const leave = () => { pointerX = 0; pointerY = 0; };
  const preference = () => { measure(); if (reduced.matches) { hero.style.height = ""; progress = targetProgress; lookX = 0; lookY = 0; } sync(); };
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }); observer.observe(hero);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  window.addEventListener("scroll", measure, { passive: true }); hero.addEventListener("pointermove", pointer); hero.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", sync); reduced.addEventListener("change", preference);
  const lost = (event: Event) => { event.preventDefault(); paused = true; cancelAnimationFrame(frame); host.dataset.ready = "false"; hero.dataset.fallback = "true"; };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  if (returnDestination && !reduced.matches) {
    const top = hero.offsetTop + host.clientHeight * returnDestination.progress;
    window.dispatchEvent(new Event("mind-native-return"));
    window.scrollTo({ top, behavior: "instant" });
    window.dispatchEvent(new CustomEvent("mind-rewind-scroll", { detail: top }));
  }
  resize(); progress = targetProgress; gateway.update(progress); draw(); host.dataset.ready = "true"; sync();
  return {
    setPaused(value) { paused = value; sync(); },
    dispose() {
      destroyed = true; cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("scroll", measure); hero.removeEventListener("pointermove", pointer); hero.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", preference); renderer.domElement.removeEventListener("webglcontextlost", lost);
      gateway.dispose(); planets.dispose(); globeWords.dispose(); disposeObject(scene); words.dispose(); environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); host.dataset.ready = "false";
    }
  };
}
