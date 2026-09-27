import * as THREE from "three";

// Original, seamless 3D terrain. No photographs or maps of existing planets.
const terrain = /* glsl */ `
  varying vec3 vMindPosition;
  uniform float uWorld;
  uniform vec3 uLow, uMiddle, uHigh;
  float mindHash(vec3 p) {
    p=fract(p*.3183099+vec3(.17,.31,.53));p*=17.;
    return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
  }
  float mindNoise(vec3 p) {
    vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(mix(mindHash(i),mindHash(i+vec3(1,0,0)),f.x),
      mix(mindHash(i+vec3(0,1,0)),mindHash(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(mindHash(i+vec3(0,0,1)),mindHash(i+vec3(1,0,1)),f.x),
      mix(mindHash(i+vec3(0,1,1)),mindHash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float mindFbm(vec3 p) {
    float value=0.,amplitude=.5;
    mat3 turn=mat3(.0,.8,.6,-.8,.36,-.48,-.6,-.48,.64);
    for(int i=0;i<5;i++){value+=mindNoise(p)*amplitude;p=turn*p*2.09+7.3;amplitude*=.49;}
    return value;
  }
  // A cellular surface with raised rims and shallow basins, unique to each seed.
  float basins(vec3 p) {
    vec3 cell=floor(p),f=fract(p);float d=2.;
    for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){
      vec3 o=vec3(float(x),float(y),float(z));
      vec3 center=vec3(mindHash(cell+o),mindHash(cell+o+13.1),mindHash(cell+o+37.7));
      d=min(d,length(o+center-f));
    }
    return d;
  }
  vec4 mindTerrain(vec3 position) {
    vec3 p=normalize(position);
    vec3 seed=vec3(uWorld*13.7,uWorld*7.3,uWorld*19.1);
    float broad=mindFbm(p*3.7+seed);
    float ridge=1.-abs(2.*mindFbm(p*13.+broad*3.+seed)-1.);
    float grain=mindNoise(p*260.+seed);
    float relief;vec3 pigment;
    if(uWorld<.5){
      // Expression: graphite and silver terrain dissolving into digital marks.
      float plate=mindFbm(p*7.+seed+vec3(broad*4.));
      float seam=1.-smoothstep(.013,.045,abs(plate-.48));
      relief=plate*.7+ridge*.15+grain*.035;
      pigment=mix(uLow,uMiddle,smoothstep(.29,.62,plate));
      pigment=mix(pigment,vec3(.012,.018,.023),smoothstep(.49,.7,broad)*.62);
      pigment=mix(pigment,uHigh,seam*.38);
      pigment=mix(pigment,vec3(.23,.29,.33),pow(ridge,18.)*.14);
    }else if(uWorld<1.5){
      // Unsaid: chalk, exposed slate and weathered impact basins.
      float crater=basins(p*9.+seed);
      float rim=exp(-pow((crater-.39)*20.,2.));
      relief=broad*.5+rim*.085-(1.-smoothstep(.08,.4,crater))*.065+grain*.025;
      pigment=mix(uLow,uMiddle,smoothstep(.2,.74,broad));
      pigment=mix(pigment,uHigh,rim*.3+pow(ridge,9.)*.25);
    }else if(uWorld<2.5){
      // Resonance: tilted, storm-wrapped layers over a petrol-dark surface.
      float bands=sin(p.y*28.+p.x*9.+mindFbm(p*5.+seed)*12.);
      float storm=mindFbm(p*vec3(7.,18.,7.)+seed+bands*.5);
      relief=storm*.12;
      pigment=mix(uLow,uMiddle,smoothstep(.24,.72,storm));
      pigment=mix(pigment,uHigh,pow(smoothstep(.45,.8,storm),2.)*.8);
    }else{
      // Becoming: oxidized terrain, dark cooled valleys, warm exposed strata.
      float crater=basins(p*12.+seed);
      float cracks=1.-smoothstep(.006,.027,abs(ridge-.76));
      relief=broad*.5+ridge*.23+grain*.035+exp(-pow((crater-.4)*18.,2.))*.04;
      pigment=mix(uLow,uMiddle,smoothstep(.18,.75,broad));
      pigment=mix(pigment,uHigh,cracks*.4+pow(ridge,12.)*.2);
    }
    pigment*=.8+grain*.26;
    return vec4(pigment,relief);
  }
  vec3 mindBump(vec3 position,vec3 normal,float height) {
    vec3 dx=dFdx(position),dy=dFdy(position);
    vec3 rx=cross(dy,normal),ry=cross(normal,dx);
    float determinant=dot(dx,rx);
    vec3 gradient=sign(determinant)*(dFdx(height)*rx+dFdy(height)*ry);
    return normalize(abs(determinant)*normal-gradient);
  }
`;

export function createMindPlanetMaterial(index: number) {
  const palettes = [
    ["#0d1218", "#384853", "#94a9b3"],
    ["#303039", "#969b9a", "#e0d8c5"],
    ["#071c25", "#376473", "#b2c5c4"],
    ["#251c1b", "#80624e", "#cda276"],
  ];
  const palette = palettes[index];
  const material = new THREE.MeshStandardMaterial({
    roughness: index === 0 ? .48 : index === 2 ? .73 : .92, metalness: index === 0 ? .28 : .02,
    transparent: true, depthWrite: index !== 0,
  });
  material.onBeforeCompile = shader => {
    shader.uniforms.uWorld = { value: index };
    shader.uniforms.uLow = { value: new THREE.Color(palette[0]) };
    shader.uniforms.uMiddle = { value: new THREE.Color(palette[1]) };
    shader.uniforms.uHigh = { value: new THREE.Color(palette[2]) };
    shader.vertexShader = "varying vec3 vMindPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvMindPosition=position;");
    shader.fragmentShader = terrain + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\nvec4 land=mindTerrain(vMindPosition);diffuseColor.rgb=land.rgb;");
    shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal=mindBump(-vViewPosition,normal,land.a*.025);");
    if (index === 0) shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `
      #include <emissivemap_fragment>
      float angle=pow(1.-abs(dot(normal,normalize(vViewPosition))),2.);
      totalEmissiveRadiance+=land.rgb*.035+vec3(.07,.095,.11)*angle*.18;
    `);
    if (index === 0) shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `
      // A continuous curved transition: the mineral skin becomes translucent
      // over the inner light instead of exposing it at a jagged cut edge.
      float coverage=1.-smoothstep(-.22,.38,vMindPosition.x);
      if(coverage<.002)discard;
      diffuseColor.a*=coverage;
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey = () => `mind-world-${index}`;
  return material;
}
