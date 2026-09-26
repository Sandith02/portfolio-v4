import * as THREE from "three";

/** A contained galaxy globe. All positions are local to the scanned head. */
export function createFusionOrb(figure: THREE.Group, portalCamera: { value: THREE.Vector3 }) {
  const center = new THREE.Vector3(0, .94, -.3);
  const position = new THREE.Vector3(-.18, .95, .02);
  const velocity = new THREE.Vector3(.48, .67, -.28);
  const bounds = new THREE.Vector3(.73, .88, .48);
  const normal = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const impactPosition = { value: new THREE.Vector3(0, .94, -1) };
  const impact = { value: 0 };
  const time = { value: 0 };
  const uniforms = { uTime: time, uImpact: impact, uOrbPosition: { value: position }, uPortalCamera: portalCamera };
  const aperture = `
    if(uPortalCamera.z>1.075){
      float t=(uPortalCamera.z-1.075)/(uPortalCamera.z-vHeadPosition.z);
      vec3 hit=mix(uPortalCamera,vHeadPosition,t);
      if(pow(hit.x/.843,2.)+pow((hit.y-.94)/1.259,2.)>1.)discard;
    }`;
  const noise = `
    float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
    float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
    float fbm(vec3 p){float f=0.;f+=.5*noise3(p);p=p*2.03+7.1;f+=.25*noise3(p);p=p*2.01+3.7;f+=.125*noise3(p);return f;}`;
  const material = new THREE.ShaderMaterial({
    uniforms, depthWrite: false,
    vertexShader: `uniform float uTime;uniform float uImpact;uniform vec3 uOrbPosition;
      varying vec3 vSurface;varying vec3 vHeadPosition;varying vec3 vNormal;varying vec3 vView;
      void main(){
        vec3 p=position;
        vSurface=normalize(position);vHeadPosition=p+uOrbPosition;
        vec4 view=modelViewMatrix*vec4(p,1.);vView=-view.xyz;vNormal=normalize(normalMatrix*normal);
        gl_Position=projectionMatrix*view;
      }`,
    fragmentShader: `uniform float uTime;uniform float uImpact;uniform vec3 uPortalCamera;
      varying vec3 vSurface;varying vec3 vHeadPosition;varying vec3 vNormal;varying vec3 vView;
      ${noise}
      void main(){${aperture}
        vec3 origin=vSurface;
        vec3 ray=normalize(vHeadPosition-uPortalCamera);
        float travel=max(0.,-2.*dot(origin,ray));
        vec3 color=vec3(.001,.002,.006);
        float transmittance=1.;
        for(int i=0;i<18;i++){
          vec3 p=origin+ray*travel*(float(i)+.5)/18.;
          float tilt=.58;
          p.yz=mat2(cos(tilt),-sin(tilt),sin(tilt),cos(tilt))*p.yz;
          float spin=uTime*.16;
          p.xz=mat2(cos(spin),-sin(spin),sin(spin),cos(spin))*p.xz;
          float r=length(p.xz);
          float angle=atan(p.z,p.x);
          float dust=fbm(p*9.+vec3(0.,uTime*.025,0.));
          float arms=pow(.5+.5*sin(angle*3.-r*15.+dust*3.),3.);
          float disk=exp(-abs(p.y)*16.)*exp(-r*2.4);
          float nucleus=exp(-dot(p,p)*55.);
          float cloud=pow(max(0.,dust-.26),2.)*exp(-dot(p,p)*2.);
          float density=disk*(.08+arms*.8)+cloud*.75;
          vec3 nebula=mix(vec3(.11,.2,.46),vec3(.39,.2,.45),dust);
          vec3 emission=nebula*density*2.+vec3(1.,.83,.6)*nucleus*2.4;
          color+=emission*transmittance*travel*.3*(1.+uImpact*.3);
          transmittance*=exp(-density*travel*.15);
        }
        float fresnel=pow(1.-max(0.,dot(normalize(vNormal),normalize(vView))),4.);
        color+=vec3(.1,.16,.24)*fresnel*.18;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(.36, 64, 48), material);
  sphere.position.copy(position);
  sphere.renderOrder=1;
  figure.add(sphere);

  const haloMaterial = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: `uniform vec3 uOrbPosition;varying vec3 vHeadPosition;varying vec3 vNormal;varying vec3 vView;
      void main(){vHeadPosition=position+uOrbPosition;vec4 view=modelViewMatrix*vec4(position,1.);vView=-view.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*view;}`,
    fragmentShader: `uniform vec3 uPortalCamera;uniform float uImpact;varying vec3 vHeadPosition;varying vec3 vNormal;varying vec3 vView;
      void main(){${aperture}float rim=pow(abs(dot(normalize(vNormal),normalize(vView))),2.);
      gl_FragColor=vec4(mix(vec3(.12,.2,.4),vec3(.3,.18,.42),uImpact),rim*(.035+uImpact*.035));}`,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(.47, 32, 24), haloMaterial);
  halo.position.copy(position);figure.add(halo);
  const light = new THREE.PointLight(0xa8d8ff, 2.4, 4, 2);
  light.position.copy(position);figure.add(light);

  // Stars occupy the globe's volume rather than tracing its outer surface.
  const starCount = 2400;
  const starPositions = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  let seed=921;
  const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  for(let i=0;i<starCount;i++){
    const radius=Math.cbrt(random())*.35;
    const azimuth=random()*Math.PI*2, vertical=random()*2-1;
    const horizontal=Math.sqrt(1-vertical*vertical);
    starPositions.set([radius*horizontal*Math.cos(azimuth),radius*vertical,radius*horizontal*Math.sin(azimuth)],i*3);
    starSizes[i]=.45+Math.pow(random(),5)*1.8;
  }
  const starGeometry=new THREE.BufferGeometry();
  starGeometry.setAttribute("position",new THREE.BufferAttribute(starPositions,3));
  starGeometry.setAttribute("aSize",new THREE.BufferAttribute(starSizes,1));
  const starMaterial=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`uniform float uTime;uniform vec3 uOrbPosition;attribute float aSize;varying float vBrightness;varying vec3 vHeadPosition;
      void main(){vec3 p=position;float a=uTime*(.14+length(p)*.2);p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;
      vHeadPosition=p+uOrbPosition;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;
      gl_PointSize=clamp(aSize*3./max(.5,-view.z),.65,3.);vBrightness=.45+.3*sin(position.x*421.+uTime*.7);}`,
    fragmentShader:`uniform vec3 uPortalCamera;varying float vBrightness;varying vec3 vHeadPosition;
      void main(){${aperture}float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.78,.85,1.,smoothstep(.5,.04,d)*vBrightness);}`,
  });
  const stars=new THREE.Points(starGeometry,starMaterial);
  stars.renderOrder=2;figure.add(stars);
  const cold = new THREE.Color(0x8aabdf), hot = new THREE.Color(0xb5a4ec);
  const updateVisuals = () => {
    sphere.position.copy(position);halo.position.copy(position);light.position.copy(position);stars.position.copy(position);
    light.intensity=.5+impact.value*1.5+Math.sin(time.value*3.)*.08;
    light.color.copy(cold).lerp(hot,impact.value);
  };
  updateVisuals();
  return {
    position, impact, impactPosition,
    setGlobeVisible(visible: boolean) {
      sphere.visible=visible;stars.visible=visible;halo.visible=visible;
    },
    update(delta: number, elapsed: number, pointerX: number, pointerY: number) {
      time.value=elapsed;
      // Substeps keep the collisions stable even after a slow frame.
      const steps=Math.max(1,Math.ceil(delta/.012));const dt=delta/steps;
      for(let step=0;step<steps;step++){
        velocity.x+=(Math.sin(elapsed*2.1)*.32+pointerX*.65)*dt;
        velocity.y+=(Math.cos(elapsed*1.7)*.3-pointerY*.65)*dt;
        velocity.z+=Math.sin(elapsed*1.3+.8)*.25*dt;
        velocity.clampLength(.78,1.15);
        position.addScaledVector(velocity,dt);
        offset.copy(position).sub(center).divide(bounds);
        if(offset.lengthSq()>1){
          offset.normalize();position.copy(offset).multiply(bounds).add(center);
          normal.copy(offset).divide(bounds).normalize();
          if(velocity.dot(normal)>0)velocity.reflect(normal);
          impact.value=1;
          impactPosition.value.copy(position).addScaledVector(normal,.36);
        }
      }
      impact.value*=Math.exp(-delta*3.5);
      updateVisuals();
    },
  };
}
