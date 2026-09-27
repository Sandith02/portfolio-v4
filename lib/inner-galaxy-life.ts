import * as THREE from "three";
import { createUnfinishedForms } from "./unfinished-forms";
import { createMeteoriteGeometry, createMeteoriteMaterial } from "./meteorite-material";

// Fragments of an inner world. Everything lives in 3D and shares the same
// bounded, scroll-relative space as the destinations; nothing catches input.
export function createInnerGalaxyLife(scene: THREE.Scene) {
  const root = new THREE.Group();
  scene.add(root);
  const unfinished = createUnfinishedForms(root);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const clock = { value: 0 }, travelUniform = { value: 0 }, alpha = { value: 0 };
  let mobile = false;
  const random = (seed: number) => THREE.MathUtils.seededRandom(seed);
  const wrap = (z: number, travel: number, span = 140) => THREE.MathUtils.euclideanModulo(z + travel - 25, span) - span + 25;

  // Fast silver streaks with a bright nucleus and an incomplete, dissolving tail.
  const meteorGeometry = new THREE.PlaneGeometry(1, 1);
  geometries.push(meteorGeometry);
  const meteors = Array.from({ length: 6 }, (_, i) => {
    const material = new THREE.ShaderMaterial({
      uniforms: { alpha: { value: 0 }, seed: { value: i * 3.7 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv;uniform float alpha,seed;
        void main(){
          float crossSection=exp(-pow((vUv.y-.5)*9.,2.));
          float tail=pow(vUv.x,2.5)*(1.-smoothstep(.91,1.,vUv.x));
          float breaks=.5+.5*smoothstep(-.5,.7,sin(vUv.x*78.+seed));
          float head=exp(-pow((vUv.x-.94)*42.,2.));
          vec3 color=mix(vec3(.35,.54,.67),vec3(.88,.95,1.),vUv.x);
          gl_FragColor=vec4(color,crossSection*(tail*breaks*.55+head)*alpha);
        }`,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(meteorGeometry, material);
    root.add(mesh);
    return { mesh, material };
  });

  // A small field of broken strata. Instancing keeps the endless field bounded.
  const shardGeometry = createMeteoriteGeometry(17);
  const shardMaterial = createMeteoriteMaterial();
  const shards = new THREE.InstancedMesh(shardGeometry, shardMaterial, 14);
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shards.frustumCulled = false;
  root.add(shards);
  geometries.push(shardGeometry); materials.push(shardMaterial);
  const transform = new THREE.Object3D();

  // Fine, irregular currents: particles repeatedly disappear and reappear in
  // the flow, leaving deliberate gaps rather than a solid smoke blanket.
  const dustCount = 1050;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustSeeds = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    const angle = random(i * 13 + 2) * Math.PI * 2;
    const radius = 3.5 + random(i * 5 + 9) * 20;
    dustPositions.set([Math.cos(angle) * radius, Math.sin(angle) * radius * .65, -random(i * 17 + 3) * 140], i * 3);
    dustSeeds[i] = random(i * 7 + 19);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute("aSeed", new THREE.BufferAttribute(dustSeeds, 1));
  const dustMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: clock, uTravel: travelUniform, uAlpha: alpha },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed;uniform float uTime,uTravel;varying float vLife;
      void main(){vec3 p=position;
        p.z=mod(p.z+uTravel+uTime*.23-25.,140.)-140.+25.;
        p.x+=sin(p.z*.12+uTime*.23+aSeed*9.)*1.1;
        p.y+=cos(p.x*.2+uTime*.19+aSeed*5.)*.7;
        vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp((24.+aSeed*16.)/-mv.z,.6,2.1);
        vLife=smoothstep(-.35,.7,sin(uTime*.5+aSeed*43.))*(.25+aSeed*.4);
      }`,
    fragmentShader: `uniform float uAlpha;varying float vLife;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(.52,.67,.74,(1.-smoothstep(.05,.5,r))*vLife*uAlpha);}`,
  });
  root.add(new THREE.Points(dustGeometry, dustMaterial));
  geometries.push(dustGeometry); materials.push(dustMaterial);

  // Soft, warm presences with short curved trails: the "beautiful souls".
  const soulCount = 7, trailCount = 20;
  const soulPositions = new Float32Array(soulCount * trailCount * 3);
  const soulAges = new Float32Array(soulCount * trailCount);
  for (let i = 0; i < soulCount; i++) for (let j = 0; j < trailCount; j++) soulAges[i * trailCount + j] = j / trailCount;
  const soulGeometry = new THREE.BufferGeometry();
  soulGeometry.setAttribute("position", new THREE.BufferAttribute(soulPositions, 3).setUsage(THREE.DynamicDrawUsage));
  soulGeometry.setAttribute("aAge", new THREE.BufferAttribute(soulAges, 1));
  const soulMaterial = new THREE.ShaderMaterial({
    uniforms: { uAlpha: alpha }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aAge;varying float vAge;
      void main(){vAge=aAge;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;
        gl_PointSize=clamp((1.-aAge)*180./-p.z,1.,14.);}`,
    fragmentShader: `uniform float uAlpha;varying float vAge;
      void main(){float r=length(gl_PointCoord-.5);
        float core=exp(-r*r*85.),halo=exp(-r*r*14.)*.25;
        vec3 color=mix(vec3(1.,.83,.57),vec3(.4,.68,.77),vAge);
        gl_FragColor=vec4(color,(core+halo)*pow(1.-vAge,2.)*uAlpha*.85);}`,
  });
  const souls = new THREE.Points(soulGeometry, soulMaterial);
  souls.frustumCulled = false;
  root.add(souls);
  geometries.push(soulGeometry); materials.push(soulMaterial);


  return {
    getImpact() { return root.visible ? unfinished.getImpact() : 0; },
    resize(width: number) { mobile = width < 768; unfinished.resize(width); dustGeometry.setDrawRange(0, mobile ? 560 : dustCount); shards.count = mobile ? 7 : 14; },
    update(time: number, travel: number, reveal: number) {
      clock.value = time;travelUniform.value = travel;alpha.value = reveal;
      root.visible = reveal > .001;
      if (!root.visible) return;
      unfinished.update(time, travel, reveal);
      meteors.forEach(({mesh,material},i)=>{
        const period=5.3+i*.47;
        const cycle=Math.floor((time+i*1.71)/period);
        const age=(time+i*1.71)%period;
        const duration=2.35+i*.17;
        const phase=age/duration;
        mesh.visible=phase<1 && (!mobile || i<4);
        if(!mesh.visible)return;
        const seed=i*71+cycle*17;
        const direction=i%2===0?1:-1;
        const z=-3-random(seed+2)*44;
        const startY=3+random(seed+9)*8;
        mesh.position.set(direction*(-15+phase*31),startY-phase*(8+random(seed+5)*8),z);
        mesh.rotation.z=direction===1?-.42:Math.PI+.42;
        mesh.scale.set(3.5+random(seed+3)*3,.08+random(seed+4)*.06,1);
        material.uniforms.alpha.value=reveal*Math.sin(Math.PI*Math.min(1,phase))*.9;
      });
      shardMaterial.opacity=reveal*.85;
      for(let i=0;i<shards.count;i++){
        const angle=random(i*17+7)*Math.PI*2;
        const radius=3+random(i*11+5)*13;
        const z=wrap(-random(i*13+1)*140,travel+time*.065);
        transform.position.set(Math.cos(angle)*radius+Math.sin(time*.07+i)*.3,Math.sin(angle)*radius*.6,z);
        transform.rotation.set(time*(.06+random(i+3)*.09)+i,time*.08+i*2,time*.03+i*.7);
        const size=.06+random(i*31+2)*.24;
        transform.scale.set(size, size*(.7+random(i*17+4)*.6), size*(.65+random(i*23+5)*.7));
        if(z>22) transform.scale.setScalar(0);
        transform.updateMatrix();shards.setMatrixAt(i,transform.matrix);
      }
      shards.instanceMatrix.needsUpdate=true;
      for(let i=0;i<soulCount;i++){
        const baseZ=wrap(-i*19-8,travel);
        for(let j=0;j<trailCount;j++){
          const t=time*.31-j*.025;
          const radius=3.5+(i%3)*2.7;
          const x=Math.sin(t*.61+i*2.2)*radius+(i%2===0?-2:2);
          const y=Math.cos(t*.47+i*1.7)*radius*.42;
          const offset=(i*trailCount+j)*3;
          soulPositions[offset]=x;soulPositions[offset+1]=y;soulPositions[offset+2]=baseZ+Math.sin(t+i)*.6;
        }
      }
      soulGeometry.attributes.position.needsUpdate=true;
      soulGeometry.setDrawRange(0,(mobile?4:soulCount)*trailCount);

    },
    dispose() {
      unfinished.dispose();
      scene.remove(root);
      geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());
    },
  };
}
