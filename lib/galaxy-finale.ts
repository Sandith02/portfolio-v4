import * as THREE from "three";
import { GALAXY_FIELD_GLSL } from "./galaxy-field";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const GALAXY_ARRIVAL_END = 9.4;

// The journey resolves in a distant human presence under a single shaft of light.
export function createGalaxyFinale(scene: THREE.Scene) {
  const root = new THREE.Group();
  root.visible = false; scene.add(root);
  const time = { value: 0 }, elapsed = { value: 0 }, aspect = { value: 1 }, journey = { value: 0 };
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: time, uElapsed: elapsed, uAspect: aspect, uJourney: journey },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `
      varying vec2 vUv;uniform float uTime,uElapsed,uAspect,uJourney;
      ${GALAXY_FIELD_GLSL}
      float hash(float n){return fract(sin(n*127.1)*43758.5453);}
      float starField(vec2 p,float scale,float density,float seed){
        vec2 grid=p*scale,cell=floor(grid),f=fract(grid);
        float h=hash(dot(cell,vec2(13.7,73.1))+seed);
        vec2 centre=.15+.7*vec2(hash(h*87.+seed),hash(h*139.+seed));
        float radius=mix(.024,.115,pow(hash(h*317.),5.));
        float aa=max(fwidth(grid.x),fwidth(grid.y))*.65;
        float d=length(f-centre);
        float point=(1.-smoothstep(radius,radius+aa,d))*radius/(radius+aa*.35);
        float halo=exp(-d*23.)*pow(hash(h*131.),12.)*.28;
        float twinkle=.86+.14*sin(uTime*(.3+h*.45)+h*61.);
        return (point+halo)*step(1.-density,h)*(.25+.75*hash(h*83.))*twinkle;
      }
      float noise(vec2 p){
        vec2 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        float n=dot(c,vec2(13.,73.));
        return mix(mix(hash(n),hash(n+13.),f.x),mix(hash(n+73.),hash(n+86.),f.x),f.y);
      }
      void main(){
        vec2 p=(vUv-.5)*vec2(uAspect,1.);
        float gathering=smoothstep(3.8,5.,uElapsed);
        float beamDraw=smoothstep(4.45,6.35,uElapsed);
        float landing=smoothstep(5.05,9.4,uElapsed);
        float resolve=smoothstep(4.2,8.8,uElapsed);
        float formation=smoothstep(.55,5.6,uElapsed);
        float drive=min(uElapsed,5.);
        float flow=drive*.035+pow(max(0.,drive-.5),2.)*.13;
        float settle=max(0.,uElapsed-5.);
        flow+=1.191*1.2*(1.-exp(-settle/1.2))+settle*.014;
        vec3 galaxy=galaxyField(p,uJourney,formation,flow);
        // The current gathers into a point before a filament grows upward.
        // Its soft surrounding strands join it before the silhouette rises into place.
        float sourceY=mix(.12,.09,landing);
        float beamTip=mix(sourceY,.65,beamDraw);
        float beamWindow=smoothstep(sourceY-.06,sourceY,p.y)
          *(1.-smoothstep(beamTip-.012,beamTip+.015,p.y));
        float width=mix(.00065,.0016,smoothstep(5.1,8.4,uElapsed));
        // Filter the narrow core to the actual pixel footprint so it remains
        // smooth when mobile quality steps down, without another render pass.
        float pixelWidth=fwidth(p.x);
        float filteredWidth=sqrt(width*width+pixelWidth*pixelWidth/6.);
        float shaft=exp(-pow(p.x/filteredWidth,2.))*(width/filteredWidth)*beamWindow*beamDraw;
        float gatheringArc=sin(beamDraw*3.14159)*(1.-landing);
        float strandOffset=sin((p.y-sourceY)*8.)*.025*gatheringArc;
        float strands=(exp(-pow((p.x-strandOffset)/.004,2.))
          +exp(-pow((p.x+strandOffset*.7)/.003,2.)))*beamWindow*gatheringArc*.055;
        float air=exp(-abs(p.x)*34.)*smoothstep(sourceY-.12,sourceY+.03,p.y)*.044*beamDraw;
        vec2 focal=p-vec2(0.,sourceY);
        float focus=exp(-length(focal*vec2(1.8,1.))*95.)*.22*gathering*(1.-landing);
        float bloom=exp(-length(focal*vec2(1.65,1.))*mix(38.,23.,landing))
          *(.72+.16*landing)*gathering;
        float column=exp(-abs(p.x)*7.)*(.45+.55*exp(-abs(focal.y)*3.));
        vec2 drift=vec2(uTime*.0007,-uTime*.0012);
        float cloud=noise(p*7.+drift)*.55+noise(p*19.-drift)*.3+noise(p*43.+drift)*.15;
        float mist=column*(.005+pow(cloud,2.)*.046);
        float stars=starField(p+drift,185.,.27,17.)*.40;
        stars+=starField(p-drift*.5,310.,.18,59.)*.17;
        stars+=starField(p+drift*.25,82.,.12,131.)*.72;
        float illuminated=.34+column*.9;
        vec3 light=vec3(1.,.995,.98)*(shaft*.95+strands+air+bloom+mist+stars*illuminated*.35);
        gl_FragColor=vec4(galaxy+light*resolve+vec3(.98,.985,1.)*focus,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const planeGeometry = new THREE.PlaneGeometry(2,2);
  const plane = new THREE.Mesh(planeGeometry,material);plane.frustumCulled=false;plane.renderOrder=20;root.add(plane);

  const figure = new THREE.Group();root.add(figure);
  // Opaque and unlit from its first visible frame: the beam reveals the outline,
  // never the face, clothing detail or a translucent lit version of the body.
  const silhouette = new THREE.MeshBasicMaterial({
    color: 0x030405, toneMapped: false,
    // Share the beam overlay's render queue, while keeping full opacity.
    transparent: true, opacity: 1,
  });
  silhouette.onBeforeCompile = shader => {
    shader.uniforms.uSoulTime = time;
    shader.vertexShader = `varying vec3 vSoulPosition;varying vec3 vSoulNormal;varying vec3 vSoulView;\n${shader.vertexShader}`
      .replace("#include <project_vertex>", `#include <project_vertex>
        vSoulPosition=(modelMatrix*vec4(transformed,1.)).xyz;
        vSoulView=-mvPosition.xyz;
        #if defined(USE_SKINNING) || defined(USE_ENVMAP)
          vSoulNormal=normalize(transformedNormal);
        #else
          vSoulNormal=normalize(normalMatrix*normal);
        #endif`);
    shader.fragmentShader = `varying vec3 vSoulPosition;varying vec3 vSoulNormal;varying vec3 vSoulView;uniform float uSoulTime;
      float soulHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float soulStars(vec2 p,float scale,float seed,float density){
        vec2 grid=p*scale,cell=floor(grid),f=fract(grid);
        float h=soulHash(cell+seed);
        vec2 centre=.15+.7*vec2(soulHash(cell+seed+17.),soulHash(cell+seed+41.));
        float d=length(f-centre);
        float radius=mix(.045,.13,pow(soulHash(cell+seed+83.),4.));
        float aa=max(fwidth(grid.x),fwidth(grid.y))*.55;
        float point=(1.-smoothstep(radius,radius+aa,d))*radius/max(radius,aa*.55);
        float glow=exp(-d*d*28.)*.18;
        float pulse=.72+.28*sin(uSoulTime*(.45+h*.6)+h*51.);
        return (point+glow)*step(1.-density,h)*pulse;
      }
      ${shader.fragmentShader}`
      .replace("#include <color_fragment>", `#include <color_fragment>
        vec2 innerSpace=vSoulPosition.xy+vec2(vSoulPosition.z*.21,0.);
        float stars=soulStars(innerSpace,27.,7.,.17);
        stars+=soulStars(innerSpace+vec2(.13,-.09),56.,37.,.1)*.3;
        float edge=1.-abs(dot(normalize(vSoulNormal),normalize(vSoulView)));
        float rim=pow(edge,5.)*.14+pow(edge,2.8)*.012;
        diffuseColor.rgb=vec3(.001,.0015,.002)+vec3(.74,.83,1.)*stars*.14
          +vec3(.72,.81,.9)*rim;`);
  };
  silhouette.customProgramCacheKey = () => "living-universe-silhouette-v2";
  const geometries = new Set<THREE.BufferGeometry>([planeGeometry]);
  let disposed = false;
  let mixer: THREE.AnimationMixer | undefined;
  let gestureDuration = 0;
  const skeletons = new Set<THREE.Skeleton>();
  const driftingJoints: { bone: THREE.Bone; base: THREE.Quaternion; initialized: boolean; side: number; forearm: boolean }[] = [];
  const parentRotation = new THREE.Quaternion();
  const driftRotation = new THREE.Quaternion();
  const driftAxis = new THREE.Vector3();
  // The arm gesture uses real shoulder/elbow joints, including the clothing.
  let requested = false;
  const prepare = () => {
    if (requested || disposed) return;
    requested = true;
    new GLTFLoader().load("/models/inner-world-figure.glb?pose=relaxed-drift-6", (gltf) => {
    const sourceMaterials = new Set<THREE.Material>();
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Bone && /^(upperarm01|lowerarm01)[._]?[LR]$/.test(object.name)) {
        driftingJoints.push({ bone: object, base: new THREE.Quaternion(), initialized: false, side: object.name.endsWith("L") ? 1 : -1, forearm: object.name.startsWith("lower") });
      }
      if (!(object instanceof THREE.Mesh)) return;
      if (object instanceof THREE.SkinnedMesh) {
        if (disposed) object.skeleton.dispose();
        else skeletons.add(object.skeleton);
      }
      (Array.isArray(object.material) ? object.material : [object.material]).forEach(m => sourceMaterials.add(m));
      if (disposed) object.geometry.dispose();
      else {
        geometries.add(object.geometry);
        object.material = silhouette;
        object.renderOrder = 30;
      }
    });
    sourceMaterials.forEach(m => m.dispose());
    if (!disposed) {
      figure.add(gltf.scene);
      const gesture = gltf.animations[0];
      if (gesture) {
        gestureDuration = gesture.duration;
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gesture);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      }
    }
  });
  };
  return {
    prepare,
    resize(width:number,height:number){aspect.value=width/height;},
    update(now:number,age:number,distance:number){
      root.visible=age>=0;
      if(age<0)return;
      time.value=now;elapsed.value=age;journey.value=distance;
      const rise = THREE.MathUtils.clamp((age - 5.05) / (GALAXY_ARRIVAL_END - 5.05), 0, 1);
      const arrival = 1 - Math.pow(1 - rise, 3);
      const stillness = THREE.MathUtils.smootherstep(rise, .65, 1);
      // Seeking makes repeated entrances deterministic; the final key holds
      // the original relaxed pose without replaying the gesture in the footer.
      // Restore the sampled pose first: Three caches unchanged animation keys,
      // so applying drift directly without this would accumulate every frame.
      for (const joint of driftingJoints) if (joint.initialized) joint.bone.quaternion.copy(joint.base);
      mixer?.setTime(Math.min(rise, .99999) * gestureDuration);
      for (const joint of driftingJoints) {
        joint.base.copy(joint.bone.quaternion);joint.initialized = true;
        const phase = age * .85 + (joint.side < 0 ? 1.2 : 0) - (joint.forearm ? .55 : 0);
        const degrees = Math.sin(phase) * (joint.forearm ? 3.5 : 7);
        joint.bone.parent?.updateWorldMatrix(true, false);
        joint.bone.parent?.getWorldQuaternion(parentRotation);
        driftAxis.set(0,0,1).applyQuaternion(parentRotation.invert());
        driftRotation.setFromAxisAngle(driftAxis, THREE.MathUtils.degToRad(degrees) * stillness * joint.side);
        joint.bone.quaternion.premultiply(driftRotation);
      }
      // Enter from beneath the viewport at a constant depth and size. The upward
      // current carries the body, then releases it gently beneath the light.
      // At depth 20 the lower edge is y=-6.89; -8.2 hides the entire figure.
      figure.visible = rise > 0;
      figure.position.set(
        -.06*Math.sin(rise*Math.PI)+Math.sin(now*.13)*.012*stillness,
        THREE.MathUtils.lerp(-8.2,.03,arrival)+Math.sin(now*.21)*.018*stillness,
        4,
      );
      figure.rotation.set(
        .015,
        -.14+Math.sin(now*.1)*.025*stillness,
        -.025-.025*Math.sin(rise*Math.PI)+Math.sin(now*.17)*.009*stillness,
      );
    },
    dispose(){disposed=true;scene.remove(root);mixer?.stopAllAction();if(mixer)mixer.uncacheRoot(mixer.getRoot());skeletons.forEach(skeleton=>skeleton.dispose());geometries.forEach(geometry=>geometry.dispose());material.dispose();silhouette.dispose();},
  };
}
