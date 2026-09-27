import * as THREE from "three";
import { GALAXY_FIELD_GLSL } from "./galaxy-field";

// A viewport-sized destination, revealed only after entering the head.
export function createCosmicGalaxy(time: { value: number }, progress: { value: number }) {
  const aspect = { value: 1 };
  const journey = { value: 0 };
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: time, uProgress: progress, uAspect: aspect, uJourney: journey },
    transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime,uProgress,uAspect,uJourney;
      ${GALAXY_FIELD_GLSL}
      void main(){
        float reveal=smoothstep(.77,.97,uProgress);
        if(reveal<=0.)discard;
        vec2 p=(vUv-.5)*vec2(uAspect,1.);
        p*=mix(1.14,1.,smoothstep(.77,1.,uProgress));
        gl_FragColor=vec4(galaxyField(p,uJourney,0.,0.),reveal);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 10;
  return { mesh, aspect, journey };
}
