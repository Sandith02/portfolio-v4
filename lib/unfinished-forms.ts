import * as THREE from "three";
import { createMeteoriteGeometry, createMeteoriteMaterial } from "./meteorite-material";

// Scattered sketches of ideas: open contours, missing edges and loose facets.
// Their depth follows the journey, so scrolling carries the viewer past them.
export function createUnfinishedForms(parent: THREE.Group) {
  const root = new THREE.Group();
  parent.add(root);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const random = (seed: number) => THREE.MathUtils.seededRandom(seed);
  let mobile = false;
  let aspect = window.innerWidth / window.innerHeight;

  const forms = Array.from({ length: 7 }, (_, index) => {
    const group = new THREE.Group();
    root.add(group);
    const solid = index % 3 === 2 ? createMeteoriteMaterial() : new THREE.MeshStandardMaterial({
      color: 0x8b929b, emissive: 0x4c5260, emissiveIntensity: .22,
      metalness: .65, roughness: .38, transparent: true, opacity: 0,
    });
    const ink = new THREE.LineBasicMaterial({ color: 0x9ba5b5, transparent: true, opacity: 0 });
    materials.push(solid, ink);
    const pieces: { mesh: THREE.Object3D; origin: THREE.Vector3; phase: number }[] = [];
    const strokes: THREE.BufferGeometry[] = [];

    if (index % 3 === 0) {
      // Two offset arcs leave a generous missing sector, with an unjoined chip.
      for (const [start, arc, radius] of [[.12, 3.5, 1], [4.05, 1.15, 1.04], [5.65, .19, 1.16]]) {
        const geometry = new THREE.TorusGeometry(radius, .014, 5, Math.ceil(arc * 24), arc);
        geometries.push(geometry);
        strokes.push(geometry);
        const mesh = new THREE.Mesh(geometry, solid);
        mesh.rotation.z = start;
        mesh.position.z = radius === 1 ? 0 : .12;
        group.add(mesh);
        pieces.push({ mesh, origin: mesh.position.clone(), phase: start });
      }
    } else if (index % 3 === 1) {
      const source = index % 2 ? new THREE.IcosahedronGeometry(.95, 0) : new THREE.OctahedronGeometry(1);
      const edges = new THREE.EdgesGeometry(source);
      const positions = edges.attributes.position;
      const retained: number[] = [];
      // Keep only selected edges and leave some strokes unfinished mid-edge.
      for (let edge = 0; edge < positions.count / 2; edge++) {
        if (random(index * 91 + edge * 7) < .34) continue;
        const a = new THREE.Vector3().fromBufferAttribute(positions, edge * 2);
        const b = new THREE.Vector3().fromBufferAttribute(positions, edge * 2 + 1);
        b.lerp(a, random(edge * 17 + index) < .28 ? .35 : 0);
        retained.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
      source.dispose(); edges.dispose();
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(retained, 3));
      geometries.push(geometry);
      strokes.push(geometry);
      group.add(new THREE.LineSegments(geometry, ink));
    } else {
      // A handful of facets hover just short of joining into a single object.
      for (let piece = 0; piece < 3; piece++) {
        const geometry = createMeteoriteGeometry(index * 13 + piece);
        geometry.scale(.23, .23, .23);
        geometries.push(geometry);
        const mesh = new THREE.Mesh(geometry, solid);
        const angle = piece * 2.4;
        mesh.position.set(Math.cos(angle) * .5, Math.sin(angle) * .45, (piece - 1.5) * .19);
        mesh.rotation.set(piece * .7, piece * 1.3, piece);
        group.add(mesh);
        pieces.push({ mesh, origin: mesh.position.clone(), phase: angle });
      }
    }

    const side = index % 2 ? 1 : -1;
    const x = side * (3.5 + random(index * 47 + 11) * 4.5);
    const y = (index % 4 < 2 ? 1 : -1) * (2 + random(index * 31 + 8) * 3);
    const size = .42 + random(index * 29 + 4) * .46;
    group.scale.setScalar(size);
    return { group, solid, ink, pieces, strokes, x, y, z: -10 - index * 27, size };
  });

  // One distant ignition per approach: a thought gathers, catches light, disperses.
  const ignition = new THREE.Group();
  root.add(ignition);
  const burstAge = { value: 20 }, burstAlpha = { value: 0 };
  let impact = 0;
  let ignitionStart: number | null = null;
  let lastTravel = 0, ignitionConsumed = false;
  const chooseEncounter = () => {
    const zones = [64, 111, 151];
    return {
      travel: zones[Math.floor(Math.random() * zones.length)] + Math.random() * 9,
      x: (Math.random() > .5 ? 1 : -1) * (.42 + Math.random() * .22),
      y: .38 + Math.random() * .23,
    };
  };
  let encounter = chooseEncounter();
  const flashOrigin = { value: new THREE.Vector2() };
  const sparkPositions = new Float32Array(96 * 3);
  for (let i = 0; i < 96; i++) {
    const direction = new THREE.Vector3(random(i * 11 + 4) - .5, random(i * 17 + 2) - .5, random(i * 29 + 9) - .5).normalize();
    direction.multiplyScalar(.6 + random(i * 31 + 7) * 1.8);
    sparkPositions.set(direction.toArray(), i * 3);
  }
  const sparkGeometry = new THREE.BufferGeometry();
  sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMaterial = new THREE.ShaderMaterial({
    uniforms: { uAge: burstAge, uAlpha: burstAlpha }, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uAge;varying float vLife;
      void main(){float gather=1.-smoothstep(0.,1.2,uAge);
        float spread=1.-exp(-max(0.,uAge-1.2)*1.7);
        vec3 p=position*(gather*.5+spread*1.4);
        vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(190./-mv.z,1.5,5.);
        vLife=(1.-smoothstep(1.5,4.2,uAge))*(.25+.75*smoothstep(.7,1.3,uAge));}`,
    fragmentShader: `uniform float uAlpha;varying float vLife;
      void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(.8,.86,1.,exp(-r*r*24.)*vLife*uAlpha);}`,
  });
  const flashGeometry = new THREE.PlaneGeometry(7, 7);
  const flashMaterial = new THREE.ShaderMaterial({
    uniforms: { uAge: burstAge, uAlpha: burstAlpha }, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float uAge,uAlpha;
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);
        float flash=exp(-pow((uAge-1.4)*2.7,2.));
        float core=exp(-r*r*240.);
        float rays=exp(-abs(p.x)*95.-abs(p.y)*8.)+exp(-abs(p.y)*95.-abs(p.x)*8.);
        float glow=exp(-r*r*16.)*.45;
        float gather=smoothstep(.2,1.2,uAge)*(1.-smoothstep(1.5,4.5,uAge));
        gl_FragColor=vec4(.85,.89,1.,((core+glow*.25)*gather+(core+rays*.85+glow)*flash)*uAlpha);}`,
  });
  ignition.add(new THREE.Points(sparkGeometry, sparkMaterial), new THREE.Mesh(flashGeometry, flashMaterial));
  geometries.push(sparkGeometry, flashGeometry); materials.push(sparkMaterial, flashMaterial);
  const washGeometry = new THREE.PlaneGeometry(2, 2);
  const washMaterial = new THREE.ShaderMaterial({
    uniforms: { uAge: burstAge, uAlpha: burstAlpha, uOrigin: flashOrigin },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float uAge,uAlpha;uniform vec2 uOrigin;
      void main(){float d=length((vUv-uOrigin)*vec2(1.3,1.));
        float arrival=1.48+d*.18;
        float front=smoothstep(arrival-.1,arrival,uAge)*exp(-max(0.,uAge-arrival)*3.4);
        gl_FragColor=vec4(.9,.94,1.,front*.82*min(1.,uAlpha));}`,
  });
  const wash = new THREE.Mesh(washGeometry, washMaterial);
  wash.frustumCulled = false;
  wash.renderOrder = 1000;
  root.add(wash);
  geometries.push(washGeometry); materials.push(washMaterial);

  return {
    resize(width: number) { mobile = width < 768; aspect = width / window.innerHeight; },
    getImpact() { return impact; },
    update(time: number, travel: number, reveal: number) {
      impact = 0;
      const advancing = travel > lastTravel + .001;
      const retreating = travel < lastTravel - .001;
      lastTravel = travel;
      if (travel < 35 && ignitionConsumed) {
        ignitionConsumed = false;
        encounter = chooseEncounter();
      }
      if (retreating) ignitionStart = null;
      const t = reduced ? 0 : time;
      forms.forEach((form, index) => {
        const z = form.z + travel;
        const fade = THREE.MathUtils.smoothstep(z, -95, -45)
          * (1 - THREE.MathUtils.smoothstep(z, 12, 22)) * reveal;
        form.group.visible = fade > .005 && (!mobile || index % 3 !== 2);
        if (!form.group.visible) return;
        form.group.position.set(form.x * (mobile ? .46 : 1) + Math.sin(t * .12 + index) * .18,
          form.y + Math.cos(t * .1 + index * 2) * .16, z);
        form.group.rotation.set(.45 + index * .71 + t * .055, index * 1.2 + t * .075, index * .6 + t * .035);
        form.solid.opacity = fade * .7;
        form.ink.opacity = fade * .46;
        // Strokes draw themselves into place while the separated facets gather.
        const cycle = (.5 + .5 * Math.sin(t * .48 + index * 1.9));
        const forming = reduced ? .85 : THREE.MathUtils.smoothstep(cycle, .08, .92);
        form.strokes.forEach(geometry => {
          const count = geometry.index?.count ?? geometry.attributes.position.count;
          const unit = geometry.index ? 3 : 2;
          geometry.setDrawRange(0, Math.floor(count * (.3 + forming * .7) / unit) * unit);
        });
        form.pieces.forEach(({ mesh, origin, phase }) => {
          mesh.position.copy(origin).multiplyScalar(1.9 - forming * 1.05);
          mesh.position.x += Math.cos(phase) * (1 - forming) * .2;
          mesh.position.z += Math.sin(phase) * (1 - forming) * .3;
        });
      });
      const distanceAlpha = 1 - THREE.MathUtils.smoothstep(travel, 174, 187);
      const withinReach = !reduced && distanceAlpha * reveal > .001;
      const burstTime = performance.now() / 1000;
      if (withinReach && travel >= encounter.travel && advancing && !ignitionConsumed) {
        ignitionStart = burstTime;
        ignitionConsumed = true;
      }
      ignition.visible = withinReach && ignitionStart !== null && burstTime - ignitionStart < 5.5;
      wash.visible = ignition.visible;
      if (ignition.visible) {
        burstAge.value = burstTime - ignitionStart!;
        burstAlpha.value = distanceAlpha * reveal * 1.5;
        const shockAge = burstAge.value - 1.55;
        impact = shockAge > 0 ? Math.exp(-shockAge * 2.5)
          * THREE.MathUtils.smoothstep(shockAge, 0, .07) * distanceAlpha * reveal : 0;
        // A distant event framed above the worlds, with space from both edges.
        const halfHeight = Math.tan(THREE.MathUtils.degToRad(19)) * 79;
        ignition.position.set(halfHeight * aspect * encounter.x, halfHeight * encounter.y, -55);
        flashOrigin.value.set(.5 + encounter.x * .5, .5 + encounter.y * .5);
        ignition.scale.setScalar(mobile ? 1.45 : 2.3);
      } else ignitionStart = null;
    },
    dispose() {
      parent.remove(root);
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    },
  };
}
