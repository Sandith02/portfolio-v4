import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function createMindSplashScene(host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x07090b, 1);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090b, .055);
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 50);
  camera.position.set(0, .1, 10.5); camera.lookAt(0, .6, 0);
  const clock = { value: 0 };
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const skeletons = new Set<THREE.Skeleton>();
  let mixer: THREE.AnimationMixer | undefined;
  let disposed = false, frame = 0;
  const random = (seed: number) => THREE.MathUtils.seededRandom(seed);

  // Each fragment is a tiny illuminated thought, arranged on a rising helix.
  const count = window.innerWidth < 600 ? 1700 : 2900;
  const tileGeometry = new THREE.PlaneGeometry(1, 1);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) seeds[i] = random(i * 37 + 11);
  tileGeometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
  const tileMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: clock }, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed;varying vec2 vUv;varying float vSeed,vDepth;
      void main(){vUv=uv;vSeed=aSeed;vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.);
        vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec2 vUv;varying float vSeed,vDepth;uniform float uTime;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){vec2 edge=min(vUv,1.-vUv);float border=1.-smoothstep(.012,.04,min(edge.x,edge.y));
        float row=floor(vUv.y*9.);float lines=step(.48,fract(vUv.y*9.))*step(vUv.x,.2+hash(vec2(row,vSeed))*.65)*step(.1,vUv.x);
        float cells=step(.5,hash(floor(vUv*vec2(17.,9.))+vSeed*23.));
        float diagram=exp(-abs(length((vUv-.5)*vec2(1.,1.4))-.28)*70.);
        float content=mix(lines*cells,diagram,step(.72,vSeed));
        float surface=.11+content*.95+border*.24;
        vec3 tint=mix(vec3(.35,.56,.62),vec3(.77,.83,.83),step(.35,vSeed));
        tint=mix(tint,vec3(.62,.33,.17),step(.88,vSeed));
        float breath=.65+.35*sin(uTime*(.4+vSeed)+vSeed*80.);
        float depth=clamp(1.8-vDepth*.085,.2,1.);
        gl_FragColor=vec4(tint*1.5,surface*(.35+vSeed*.65)*breath*depth);}`,
  });
  const tiles = new THREE.InstancedMesh(tileGeometry, tileMaterial, count);
  tiles.frustumCulled = false;
  const transform = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const along = random(i * 13 + 5);
    const lane = random(i * 23 + 9);
    const angle = along * Math.PI * 7.6 + lane * .65;
    const y = -1.1 + along * 7.8 + (lane - .5) * .85;
    const radius = 2.2 + along * .95 + Math.sin(along * 8) * .3 + random(i * 17 + 7) * .18;
    transform.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    transform.rotation.set((random(i * 31 + 8) - .5) * .2, -angle + Math.PI / 2, .035);
    const size = .045 + Math.pow(random(i * 7 + 21), 4) * .4;
    transform.scale.set(size * (1.2 + random(i * 19 + 3)), size * .7, 1);
    transform.updateMatrix(); tiles.setMatrixAt(i, transform.matrix);
  }
  scene.add(tiles); geometries.push(tileGeometry); materials.push(tileMaterial);

  // The same spiral sinks into a broken, dark reflection below the figure.
  const reflectionMaterial = tileMaterial.clone();
  reflectionMaterial.uniforms = { uTime: clock };
  reflectionMaterial.fragmentShader = reflectionMaterial.fragmentShader.replace("surface*(.35+vSeed*.65)*breath*depth", "surface*(.35+vSeed*.65)*breath*depth*.14");
  const reflection = new THREE.InstancedMesh(tileGeometry, reflectionMaterial, count);
  reflection.instanceMatrix = tiles.instanceMatrix;
  reflection.scale.y = -.35; reflection.position.y = -3.1;
  scene.add(reflection); materials.push(reflectionMaterial);

  const glowGeometry = new THREE.PlaneGeometry(7, 7);
  const glowMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv;void main(){vec2 p=(vUv-.5)*vec2(1.3,.85);float r=length(p);gl_FragColor=vec4(.2,.39,.46,exp(-r*r*22.)*.3);}`,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.set(0, -1, -1.8); scene.add(glow);
  geometries.push(glowGeometry); materials.push(glowMaterial);

  const silhouette = new THREE.MeshBasicMaterial({ color: 0x020304 }); materials.push(silhouette);
  const person = new THREE.Group(); person.position.set(0, -1.65, 2.2); person.scale.setScalar(.55); scene.add(person);
  new GLTFLoader().load("/models/inner-world-figure.glb?pose=relaxed-drift-6", gltf => {
    gltf.scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose());
      if (disposed) { object.geometry.dispose(); if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose(); return; }
      geometries.push(object.geometry); object.material = silhouette;
      if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
    });
    if (!disposed) {
      person.add(gltf.scene);
      const gesture = gltf.animations[0];
      if (gesture) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gesture);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        mixer.setTime(gesture.duration);
      }
    }
  });

  const dustGeometry = new THREE.BufferGeometry();
  const dust = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i++) dust.set([(random(i * 7 + 1) - .5) * 12, (random(i * 11 + 3) - .5) * 12, (random(i * 13 + 5) - .5) * 8], i * 3);
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustMaterial = new THREE.PointsMaterial({ color: 0x899b9f, size: .014, transparent: true, opacity: .35, depthWrite: false });
  scene.add(new THREE.Points(dustGeometry, dustMaterial)); geometries.push(dustGeometry); materials.push(dustMaterial);

  const resize = () => {
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.position.z = camera.aspect < .8 ? 13.5 : 10.5;
    camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight);
  };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const start = performance.now();
  const draw = () => {
    if (disposed) return;
    const t = (performance.now() - start) / 1000; clock.value = t;
    tiles.rotation.y = -.3 + t * .055; reflection.rotation.y = tiles.rotation.y;
    camera.position.x = Math.sin(t * .15) * .08;
    camera.lookAt(0, .6, 0);
    renderer.render(scene, camera); frame = requestAnimationFrame(draw);
  };
  draw();
  return { dispose() { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); mixer?.stopAllAction(); skeletons.forEach(s => s.dispose()); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); renderer.dispose(); renderer.domElement.remove(); } };
}
