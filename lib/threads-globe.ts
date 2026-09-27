import * as THREE from "three";

// One continuous liquid body. Position and normals deform together, so its
// reflections follow the moving folds instead of sliding over a static sphere.
export function createThreadsGlobe() {
  const root = new THREE.Group();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clock = { value: 0 };
  const fluid = `
    uniform float uFluidTime;
    varying vec3 vFluidPosition;
    float fluidFold(vec3 p){
      float t=uFluidTime;
      vec3 q=p+sin(p.yzx*2.7+vec3(t*.62,-t*.47,t*.38))*.3;
      return sin(q.x*3.8+q.y*2.1+t*.78)*.5
        +sin(q.y*4.3-q.z*3.4-t*.61)*.3
        +sin(q.z*5.1+q.x*2.2+t*.49)*.2;
    }
    vec3 fluidShape(vec3 p){
      vec3 n=normalize(p);
      float fold=fluidFold(n);
      float radius=length(p)*(1.+fold*.23+sin(n.y*2.2-uFluidTime*.54)*.055);
      vec3 drift=sin(n.yzx*2.5+vec3(uFluidTime*.46,-uFluidTime*.39,uFluidTime*.32))*.085;
      return n*radius+drift;
    }
  `;
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x819195, metalness: .58, roughness: .16,
    clearcoat: 1, clearcoatRoughness: .12,
    iridescence: .42, iridescenceIOR: 1.32,
    iridescenceThicknessRange: [100, 270],
    transmission: .15, thickness: 1.1, ior: 1.46,
    attenuationColor: new THREE.Color(0x493631), attenuationDistance: 1.8,
    envMapIntensity: .85, transparent: true,
  });
  material.onBeforeCompile = shader => {
    shader.uniforms.uFluidTime = clock;
    shader.vertexShader = fluid + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', `
      #include <beginnormal_vertex>
      vec3 n=normalize(position);
      vec3 axis=abs(n.y)>.95?vec3(1.,0.,0.):vec3(0.,1.,0.);
      vec3 tangent=normalize(cross(axis,n));
      vec3 bitangent=cross(n,tangent);
      vec3 base=fluidShape(position);
      vec3 alongT=fluidShape(position+tangent*.008)-base;
      vec3 alongB=fluidShape(position+bitangent*.008)-base;
      objectNormal=normalize(cross(alongT,alongB));
    `);
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      transformed=fluidShape(position);
      vFluidPosition=transformed;
    `);
    shader.fragmentShader = fluid + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float folds=fluidFold(normalize(vFluidPosition));
      diffuseColor.rgb=mix(vec3(.065,.028,.024),vec3(.16,.22,.24),smoothstep(-.7,.75,folds));
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      float relief=sin(folds*7.+vFluidPosition.y*3.)*.022;
      vec3 dx=dFdx(-vViewPosition),dy=dFdy(-vViewPosition);
      vec3 rx=cross(dy,normal),ry=cross(normal,dx);
      float det=dot(dx,rx);
      vec3 slope=sign(det)*(dFdx(relief)*rx+dFdy(relief)*ry);
      normal=normalize(abs(det)*normal-slope);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      float rim=pow(1.-abs(dot(normal,normalize(vViewPosition))),3.);
      totalEmissiveRadiance+=mix(vec3(.09,.025,.014),vec3(.06,.17,.21),smoothstep(-.3,.6,folds))*rim*.2;
    `);
  };
  material.customProgramCacheKey = () => 'threads-continuous-liquid';
  const geometry = new THREE.SphereGeometry(.94, 128, 96);
  // Account for shader displacement during frustum culling.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.4);
  root.add(new THREE.Mesh(geometry, material));
  return {
    root,
    update(time: number, alpha: number) {
      clock.value=reduced.matches?0:time;
      material.opacity=alpha;
    },
    setEnvironment(texture: THREE.Texture) { material.envMap=texture;material.needsUpdate=true; },
    dispose() { geometry.dispose();material.dispose(); },
  };
}
