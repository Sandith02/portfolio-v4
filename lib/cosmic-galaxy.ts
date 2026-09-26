import * as THREE from "three";

// A viewport-sized destination, revealed only after entering the head.
// It shares the scene clock so pause, reduced motion and reverse scroll stay in sync.
export function createCosmicGalaxy(time: { value: number }, progress: { value: number }) {
  const aspect = { value: 1 };
  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: time, uProgress: progress, uAspect: aspect },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: `varying vec2 vUv;
      void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime, uProgress, uAspect;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
          mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
      }
      float cloud(vec2 p){
        float n=0.,a=.5;
        mat2 turn=mat2(.8,-.6,.6,.8);
        for(int i=0;i<5;i++){n+=a*noise(p);p=turn*p*2.07+13.7;a*=.5;}
        return n;
      }
      vec3 stars(vec2 p,float density,float seed){
        vec2 grid=p*density,cell=floor(grid);
        float h=hash(cell+seed);
        vec2 center=.15+.7*vec2(hash(cell+seed+1.),hash(cell+seed+9.));
        float r=length(fract(grid)-center);
        float aa=max(fwidth(grid.x),fwidth(grid.y));
        float point=1.-smoothstep(.018,.035+aa*.65,r);
        float halo=exp(-r*22.)*.18;
        float twinkle=.8+.2*sin(uTime*.4+h*83.);
        return mix(vec3(.52,.69,1.),vec3(1.,.82,.6),h)
          *(point+halo)*step(.78,h)*twinkle*(.3+h*h);
      }
      void main(){
        float reveal=smoothstep(.77,.97,uProgress);
        if(reveal<=0.)discard;
        vec2 p=(vUv-.5)*vec2(uAspect,1.);
        p*=mix(1.14,1.,smoothstep(.77,1.,uProgress));
        p+=vec2(uTime*.0015,sin(uTime*.06)*.006);
        // Inclined galactic plane: turbulent dust lanes around a warm distant core.
        vec2 q=mat2(.91,-.415,.415,.91)*p;
        float wisps=cloud(q*5.+vec2(uTime*.002,0.));
        float detail=cloud(q*21.+wisps*2.);
        float band=exp(-pow((q.y+(wisps-.5)*.23)*5.3,2.));
        float broad=exp(-pow(q.y*2.5,2.));
        float dust=cloud(q*vec2(9.,19.)+vec2(4.7,1.3));
        float r=length((q-vec2(.12,.015))*vec2(1.1,2.8));
        float core=exp(-r*6.5);
        vec3 color=vec3(.0015,.003,.009);
        color+=mix(vec3(.025,.055,.13),vec3(.13,.055,.12),wisps)
          *broad*pow(wisps,1.7)*1.8;
        color+=mix(vec3(.09,.15,.25),vec3(.3,.25,.2),detail)
          *band*pow(detail,2.)*1.8;
        color+=vec3(.68,.55,.4)*core*(.3+detail);
        color*=1.-smoothstep(.48,.78,dust)*band*.87;
        color+=stars(p,155.,3.)*.55;
        color+=stars(p*1.025,71.,31.)*.7;
        color+=stars(p*1.06,29.,71.)*.65;
        // More distant, unresolved stars collect along the galactic plane.
        color+=vec3(.2,.25,.35)*pow(noise(p*1100.),18.)*band;
        gl_FragColor=vec4(color,reveal);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 10;
  return { mesh, aspect };
}
