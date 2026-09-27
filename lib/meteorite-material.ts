import * as THREE from "three";

export function createMeteoriteGeometry(seed = 1) {
  const geometry = new THREE.IcosahedronGeometry(1, 3);
  const positions = geometry.attributes.position;
  const point = new THREE.Vector3();
  const craters = Array.from({ length: 7 }, (_, i) => ({
    direction: new THREE.Vector3(
      THREE.MathUtils.seededRandom(seed * 31 + i * 3) - .5,
      THREE.MathUtils.seededRandom(seed * 47 + i * 7) - .5,
      THREE.MathUtils.seededRandom(seed * 59 + i * 11) - .5,
    ).normalize(),
    width: .16 + THREE.MathUtils.seededRandom(seed * 71 + i) * .28,
  }));
  for (let i = 0; i < positions.count; i++) {
    point.fromBufferAttribute(positions, i).normalize();
    const { x, y, z } = point;
    let radius = 1 + Math.sin(x * 4.1 + seed) * Math.sin(y * 3.7 + z * 2.9) * .16
      + Math.sin(y * 9.3 + x * 4.2) * Math.sin(z * 8.7 - seed) * .055
      + Math.sin(x * 23 + y * 17) * Math.sin(z * 21 + y * 19) * .014;
    for (const crater of craters) {
      const distance = point.distanceTo(crater.direction) / crater.width;
      radius -= Math.exp(-distance * distance * 3) * .1;
      radius += Math.exp(-Math.pow((distance - .8) * 7, 2)) * .018;
    }
    positions.setXYZ(i, x * radius * 1.15, y * radius * .67, z * radius * .86);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function createMeteoriteMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: 0x77736d, roughness: .93, metalness: .05, transparent: true, opacity: 0,
  });
  material.onBeforeCompile = shader => {
    shader.vertexShader = `varying vec3 vRockPosition;\n${shader.vertexShader}`
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRockPosition=position;");
    shader.fragmentShader = `varying vec3 vRockPosition;
      float rockHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float rockNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(rockHash(i),rockHash(i+vec3(1,0,0)),f.x),mix(rockHash(i+vec3(0,1,0)),rockHash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(rockHash(i+vec3(0,0,1)),rockHash(i+vec3(1,0,1)),f.x),mix(rockHash(i+vec3(0,1,1)),rockHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
      ${shader.fragmentShader}`
      .replace("#include <color_fragment>", `#include <color_fragment>
        float grain=rockNoise(vRockPosition*95.);
        float strata=rockNoise(vRockPosition*8.)*.65+rockNoise(vRockPosition*23.)*.35;
        diffuseColor.rgb*=mix(vec3(.3,.32,.33),vec3(.85,.79,.7),smoothstep(.2,.85,strata));
        diffuseColor.rgb*=.72+grain*.4;`)
      .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
        float relief=rockNoise(vRockPosition*26.)*.016+rockNoise(vRockPosition*95.)*.006;
        vec3 q0=dFdx(vViewPosition),q1=dFdy(vViewPosition);
        vec3 r0=cross(q1,normal),r1=cross(normal,q0);
        float determinant=dot(q0,r0);
        normal=normalize(abs(determinant)*normal-sign(determinant)*(dFdx(relief)*r0+dFdy(relief)*r1));`);
  };
  material.customProgramCacheKey = () => "weathered-meteorite-v1";
  return material;
}
