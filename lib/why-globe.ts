import * as THREE from "three";

export function createWhyGlobe() {
  const root = new THREE.Group();
  const time = { value: 0 }, alpha = { value: 0 };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const geometry = new THREE.SphereGeometry(1, 96, 64);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: .06, roughness: .72,
    clearcoat: .15, clearcoatRoughness: .5,
    transparent: true, envMapIntensity: .16,
  });
  material.onBeforeCompile = shader => {
    shader.uniforms.uTime = time;
    shader.vertexShader='varying vec3 vWhyPosition;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWhyPosition=position;');
    shader.fragmentShader='uniform float uTime;varying vec3 vWhyPosition;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
      #include <color_fragment>
      vec3 p=normalize(vWhyPosition);
      float flow=sin(p.x*3.+p.y*2.+sin(p.z*4.)*.4);
      float blue=smoothstep(-.45,.65,p.x*.7+p.y*.5+flow*.13);
      vec3 pigment=mix(vec3(.42,.037,.095),vec3(.008,.065,.18),blue);
      float fine=sin(p.x*83.+sin(p.z*37.))*sin(p.y*71.+p.z*33.);
      float mist=.5+.5*sin(p.x*8.+sin(p.y*7.+p.z*4.)*2.);
      pigment*=.83+mist*.17+fine*.025;
      diffuseColor.rgb=pigment;
    `);
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
      #include <emissivemap_fragment>
      totalEmissiveRadiance+=pigment*.2;
    `);
  };
  root.add(new THREE.Mesh(geometry,material));
  const atmosphereGeometry=new THREE.SphereGeometry(1.018,96,64);
  const atmosphereMaterial=new THREE.ShaderMaterial({
    uniforms:{uAlpha:alpha,uTime:time},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`varying vec3 n,e,p;void main(){vec4 v=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);e=normalize(-v.xyz);p=position;gl_Position=projectionMatrix*v;}`,
    fragmentShader:`varying vec3 n,e,p;uniform float uAlpha,uTime;void main(){
      float edge=pow(1.-max(0.,dot(normalize(n),normalize(e))),3.5);
      vec3 sheen=vec3(.6,.55,.58);
      float breathe=.94+.06*sin(uTime*.7);
      gl_FragColor=vec4(sheen,edge*uAlpha*.1*breathe);
    }`,
  });
  root.add(new THREE.Mesh(atmosphereGeometry,atmosphereMaterial));
  return {
    root,
    update(now:number,opacity:number){time.value=reduced.matches?0:now;alpha.value=opacity;material.opacity=opacity;},
    setEnvironment(texture:THREE.Texture){material.envMap=texture;material.needsUpdate=true;},
    dispose(){geometry.dispose();material.dispose();atmosphereGeometry.dispose();atmosphereMaterial.dispose();},
  };
}
