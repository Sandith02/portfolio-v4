import { isMobileRendering } from "./render-budget";
import * as THREE from "three";
import { createContactGlobe } from "./contact-globe";
import { createAboutRings } from "./about-rings";
import { createThreadsGlobe } from "./threads-globe";
import { createWhyGlobe } from "./why-globe";

export function createPersonalWorld(index: number, thoughts: THREE.Texture) {
  const compact = isMobileRendering();
  const root = new THREE.Group();
  const sculpture = new THREE.Group();root.add(sculpture);
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.MeshPhysicalMaterial>();
  function mesh(geometry: THREE.BufferGeometry, material: THREE.MeshPhysicalMaterial) {
    geometries.add(geometry);materials.add(material);
    const object = new THREE.Mesh(geometry, material);sculpture.add(object);
  }
  const contact = index === 2 ? createContactGlobe() : undefined;
  const threads = index === 4 ? createThreadsGlobe() : undefined;
  const rings = index === 1 ? createAboutRings() : undefined;
  const why = index === 3 ? createWhyGlobe() : undefined;

  if (index === 1) {
    // ABOUT: a closed globe made from the same inscribed skin as the hero.
    const wordMaterial=(inside:boolean)=>{
      const material=new THREE.MeshPhysicalMaterial({
        color:0x182226,metalness:inside?.24:.58,roughness:inside?.52:.42,
        clearcoat:.18,clearcoatRoughness:.3,envMapIntensity:inside?.16:.3,
        side:inside?THREE.BackSide:THREE.FrontSide,transparent:true,
      });
      material.onBeforeCompile=shader=>{
        shader.uniforms.uThoughts={value:thoughts};
        shader.uniforms.uInside={value:inside};
        shader.vertexShader='varying vec2 vThoughtUv;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvThoughtUv=uv;');
        shader.fragmentShader='uniform sampler2D uThoughts;uniform bool uInside;varying vec2 vThoughtUv;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`
          #include <color_fragment>
          vec2 thoughtUv=vThoughtUv*vec2(.32,.28)+vec2(.08,.12);
          if(uInside)thoughtUv.x=-thoughtUv.x;
          float ink=texture2D(uThoughts,thoughtUv).r;
          diffuseColor.rgb=mix(vec3(.018,.027,.033),vec3(.25,.29,.3),ink*.8);
        `);
        shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
          #include <normal_fragment_maps>
          // Recess the lettering into the curved surface: grazing reflections
          // pick up the carved edges rather than floating typography.
          vec3 dx=dFdx(-vViewPosition),dy=dFdy(-vViewPosition);
          vec3 rx=cross(dy,normal),ry=cross(normal,dx);
          float det=dot(dx,rx);
          vec3 slope=sign(det)*(dFdx(ink)*rx+dFdy(ink)*ry)*-.0015;
          normal=normalize(abs(det)*normal-slope);
        `);
        shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`
          #include <emissivemap_fragment>
          totalEmissiveRadiance+=vec3(.12,.15,.16)*ink*(uInside?.8:.55);
        `);
      };
      material.customProgramCacheKey=()=>`thought-globe-${inside}`;
      return material;
    };
    mesh(new THREE.SphereGeometry(.88,compact ? 48 : 112,compact ? 32 : 80),wordMaterial(false));
    sculpture.add(rings!.root);
  } else if (threads) {
    sculpture.add(threads.root);
  } else if (why) {
    sculpture.add(why.root);
  } else if (contact) {
    sculpture.add(contact.root);
  }

  return {
    root,
    resize(height: number, pixelRatio: number) { contact?.resize(height,pixelRatio); },
    setEnvironment(texture: THREE.Texture) {
      contact?.setEnvironment(texture);
      threads?.setEnvironment(texture);
      why?.setEnvironment(texture);
      materials.forEach(material=>{material.envMap=texture;material.needsUpdate=true;});
    },
    update(time: number, alpha: number) {
      contact?.update(time,alpha);
      threads?.update(time,alpha);
      rings?.update(time,alpha);
      why?.update(time,alpha);
      materials.forEach(material=>{material.opacity=alpha;});

    },
    dispose(){why?.dispose();threads?.dispose();contact?.dispose();rings?.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());},
  };
}
