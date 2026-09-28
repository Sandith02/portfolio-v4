import { isMobileRendering } from "./render-budget";
import * as THREE from "three";

export function createAboutRings() {
  const compact = isMobileRendering();
  const root = new THREE.Group();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const time = { value: 0 }, alpha = { value: 0 };
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.ShaderMaterial[] = [];
  // Two slightly separated orbital planes, pitched toward the viewer and
  // diagonally inclined. The globe's depth buffer hides the far-side arcs.
  const tracks = [
    { radius: 1.24, width: .24, pitch: 1.04, tilt: -.64, speed: 4.8, phase: 0 },
    { radius: 1.43, width: .12, pitch: 1.12, tilt: -.52, speed: -3.9, phase: 2.1 },
  ];
  tracks.forEach(track => {
    const orbit = new THREE.Group();
    orbit.rotation.set(track.pitch, .15, track.tilt, 'ZXY');
    root.add(orbit);
    const bandGeometry = new THREE.RingGeometry(track.radius-track.width/2,track.radius+track.width/2,compact ? 96 : 256,compact ? 3 : 8);
    const bandMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: time, uAlpha: alpha, uSpeed: { value: track.speed }, uPhase: { value: track.phase }, uRadius: { value: track.radius }, uWidth: { value: track.width } },
      side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vOrbit;void main(){vOrbit=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `
        varying vec2 vOrbit;uniform float uTime,uAlpha,uSpeed,uPhase,uRadius,uWidth;
        void main(){
          float radius=(length(vOrbit)-uRadius)/uWidth+.5;
          float angle=atan(vOrbit.y,vOrbit.x);
          float lane=floor(radius*32.);
          float moving=angle-uTime*uSpeed+uPhase;
          float strands=pow(.5+.5*sin(radius*190.),5.);
          float packets=pow(.5+.5*sin(moving*3.+lane*.37),14.);
          float sparks=pow(.5+.5*sin(moving*43.+lane*11.),20.);
          float broad=.5+.5*sin(moving*2.+radius*6.);
          float edge=smoothstep(0.,.07,radius)*(1.-smoothstep(.93,1.,radius));
          float energy=.12+strands*.24+packets*(.18+strands*.4)+sparks*.2+broad*.08;
          gl_FragColor=vec4(.84,.92,1.,energy*edge*uAlpha);
        }`,
    });
    const band = new THREE.Mesh(bandGeometry,bandMaterial);
    band.renderOrder=2;
    orbit.add(band);
    geometries.push(bandGeometry);materials.push(bandMaterial);
    for (const halo of [false, true]) {
      const geometry = new THREE.TorusGeometry(track.radius, halo ? .023 : .005, compact ? 5 : 8, compact ? 96 : 256);
      const material = new THREE.ShaderMaterial({
        uniforms: { uTime: time, uAlpha: alpha, uSpeed: { value: track.speed }, uPhase: { value: track.phase }, uHalo: { value: halo ? 1 : 0 } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          varying vec2 vUv;uniform float uTime,uAlpha,uSpeed,uPhase,uHalo;
          void main(){
            float angle=vUv.x*6.283185;
            float moving=angle-uTime*uSpeed+uPhase;
            float packets=pow(.5+.5*sin(moving*3.),20.);
            float fine=pow(.5+.5*sin(moving*17.+sin(angle*7.)),10.);
            float trail=pow(.5+.5*cos(moving),9.);
            float energy=.16+packets*.85+fine*.27+trail*.65;
            float edge=pow(abs(sin(vUv.y*6.283185)),1.5);
            float strength=mix(energy,energy*edge*.09,uHalo);
            gl_FragColor=vec4(.84,.92,1.,strength*uAlpha);
          }`,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = halo ? 3 : 2;
      orbit.add(mesh);
      geometries.push(geometry); materials.push(material);
    }
  });
  return {
    root,
    update(now: number, opacity: number) { time.value = reducedMotion.matches ? 0 : now; alpha.value = opacity; },
    dispose() { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); },
  };
}
