import { isMobileRendering } from "./render-budget";
import * as THREE from "three";

export function createContactGlobe() {
  const compact = isMobileRendering();
  const root = new THREE.Group();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const uniforms = { uTime: { value: 0 }, uAlpha: { value: 0 }, uHeight: { value: 1000 } };
  const glassGeometry = new THREE.SphereGeometry(1, compact ? 40 : 80, compact ? 28 : 64);
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x073b38, metalness: .08, roughness: .2,
    clearcoat: 1, clearcoatRoughness: .18, envMapIntensity: .45,
    transparent: true, opacity: .2, depthWrite: false,
  });
  glass.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      #include <opaque_fragment>
      float rim=pow(1.-abs(dot(normal,normalize(vViewPosition))),2.4);
      gl_FragColor.a*=.22+rim*.78;
    `);
  };
  const shell = new THREE.Mesh(glassGeometry, glass);
  shell.renderOrder = 3;
  root.add(shell);
  // A tinted interior dims background stars without hiding the lights inside.
  const interiorMaterial = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `varying vec3 n,e;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);e=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,
    fragmentShader: `varying vec3 n,e;uniform float uAlpha;void main(){float face=max(0.,dot(normalize(n),normalize(e)));gl_FragColor=vec4(.005,.027,.024,(.24+pow(face,.6)*.42)*uAlpha);}`,
  });
  const interior = new THREE.Mesh(glassGeometry,interiorMaterial);
  interior.scale.setScalar(.995);
  interior.renderOrder = -1;
  root.add(interior);

  const count = compact ? 1000 : 2800;
  const positions = new Float32Array(count * 3), seeds = new Float32Array(count);
  const random = (n: number) => THREE.MathUtils.seededRandom(n);
  for (let i = 0; i < count; i++) {
    const y = random(i * 17 + 23) * 2 - 1;
    const angle = random(i * 31 + 11) * Math.PI * 2;
    const radius = .12 + Math.pow(random(i * 13 + 7), .42) * .79;
    const ring = Math.sqrt(1 - y * y);
    positions.set([Math.cos(angle) * ring * radius, y * radius, Math.sin(angle) * ring * radius], i * 3);
    seeds[i] = random(i * 29 + 101);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uTime,uHeight;attribute float aSeed;varying float vLight,vDepth;
      void main(){
        vec3 p=position;
        float angle=uTime*(.023+aSeed*.016);
        p.xz=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p.xz;
        p.y+=sin(uTime*.32+aSeed*6.28)*.012;
        vec4 view=modelViewMatrix*vec4(p,1.);
        vec3 center=(modelViewMatrix*vec4(0.,0.,0.,1.)).xyz;
        vDepth=clamp(.55+(view.z-center.z)/length(modelMatrix[0].xyz)*.4,.15,1.);
        vLight=(.8+1.2*pow(.5+.5*sin(uTime*(.6+aSeed*.4)+aSeed*37.),3.))*vDepth;
        gl_Position=projectionMatrix*view;
        gl_PointSize=clamp((.022+aSeed*aSeed*.027)*uHeight*projectionMatrix[1][1]*length(modelMatrix[0].xyz)/(2.*max(.1,-view.z)),1.5,19.);
      }`,
    fragmentShader: `
      uniform float uAlpha;varying float vLight,vDepth;
      void main(){
        float r=length(gl_PointCoord-.5);if(r>.5)discard;
        float spark=exp(-r*r*80.)+exp(-r*r*15.)*.38;
        vec3 mint=mix(vec3(.2,.67,.55),vec3(.73,1.,.89),vDepth);
        gl_FragColor=vec4(mint,spark*vLight*uAlpha);
      }`,
  });
  const points = new THREE.Points(geometry, material);
  points.renderOrder = 1;
  root.add(points);

  const hazeGeometry = new THREE.PlaneGeometry(1.96, 1.96);
  const hazeMaterial = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(0.,0.,0.,1.);p.xy+=position.xy*length(modelMatrix[0].xyz);gl_Position=projectionMatrix*p;}`,
    fragmentShader: `varying vec2 vUv;uniform float uAlpha,uTime;void main(){float r=length(vUv-.5);float haze=exp(-r*r*11.)*(1.-smoothstep(.35,.5,r));gl_FragColor=vec4(.035,.48,.35,haze*uAlpha*(.4+.045*sin(uTime*.5)));}`,
  });
  root.add(new THREE.Mesh(hazeGeometry, hazeMaterial));
  return {
    root,
    resize(height: number, pixelRatio: number) { uniforms.uHeight.value = height * pixelRatio; },
    update(time: number, alpha: number) {
      uniforms.uTime.value = reducedMotion.matches ? 0 : time;
      uniforms.uAlpha.value = alpha;
      glass.opacity = alpha * .42;
    },
    setEnvironment(texture: THREE.Texture) { glass.envMap = texture; glass.needsUpdate = true; },
    dispose() { glassGeometry.dispose(); glass.dispose(); interiorMaterial.dispose(); geometry.dispose(); material.dispose(); hazeGeometry.dispose(); hazeMaterial.dispose(); },
  };
}
