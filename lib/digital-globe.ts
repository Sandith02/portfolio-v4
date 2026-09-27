import * as THREE from "three";

// Physical silver pieces on a spherical shell: real volume, shaded sides and
// perspective foreshortening, including when the visitor turns the world.
export function createDigitalGlobe() {
  const root = new THREE.Group();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const glowUniforms = { uParticleTime: { value: 0 }, uAlpha: { value: 0 }, uHeight: { value: 1000 } };
  const pulseShader = `
    uniform float uParticleTime;
    float particlePulse(vec3 center){
      float seed=fract(sin(dot(center,vec3(127.1,311.7,74.7)))*43758.5453);
      float wave=.5+.5*sin(uParticleTime*(.65+seed*.5)+seed*6.28318);
      return pow(wave,7.)*(.25+seed*.75);
    }
  `;
  const coreGeometry = new THREE.SphereGeometry(.82, 64, 48);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x241b1a, metalness: .25, roughness: .5,
    clearcoat: .2, clearcoatRoughness: .4,
    emissive: 0xffffff, emissiveIntensity: .25,
    transparent: true, envMapIntensity: .15,
  });
  coreMaterial.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vCoreSurface;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvCoreSurface=position;');
    shader.fragmentShader = 'varying vec3 vCoreSurface;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec3 p=normalize(vCoreSurface);
      float flow=.5+.5*sin(p.x*2.1+p.y*1.7+sin(p.z*2.3)*.7);
      vec3 corePalette=mix(vec3(.32,.105,.18),vec3(.52,.21,.31),flow);
      float cool=.5+.5*sin(p.z*2.4-p.x*1.8+p.y);
      corePalette=mix(corePalette,vec3(.17,.34,.46),smoothstep(.45,.95,cool)*.68);
      corePalette=mix(corePalette,vec3(.43,.23,.19),smoothstep(.78,1.,flow)*.14);
      diffuseColor.rgb=corePalette*.14;
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      float coreFacing=max(0.,dot(normal,normalize(vViewPosition)));
      totalEmissiveRadiance*=corePalette*(.14+.24*pow(coreFacing,2.));
    `);
  };
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  // The inner globe occludes distant particles and gives the shell real depth.
  core.renderOrder = -2;
  root.add(core);
  const material = new THREE.MeshStandardMaterial({
    color: 0x9da2a4, metalness: .38, roughness: .46,
    emissive: 0x202628, emissiveIntensity: .08,
    transparent: true, envMapIntensity: .4,
  });
  // Darken the far side so it contributes depth without doubling the pattern.
  material.onBeforeCompile = shader => {
    shader.uniforms.uParticleTime = glowUniforms.uParticleTime;
    shader.vertexShader = pulseShader + 'varying vec3 vShellNormal,vShellEye;varying float vTwinkle;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      vec3 center=instanceMatrix[3].xyz;
      vTwinkle=particlePulse(center);
      vShellNormal=normalize(normalMatrix*normalize(center));
      vShellEye=normalize(-(modelViewMatrix*vec4(center,1.)).xyz);
    `);
    shader.fragmentShader = 'varying vec3 vShellNormal,vShellEye;varying float vTwinkle;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      totalEmissiveRadiance+=vec3(.33,.38,.4)*(.025+vTwinkle*.65);
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      outgoingLight*=mix(.12,1.,smoothstep(-.25,.45,dot(normalize(vShellNormal),normalize(vShellEye))));
      #include <opaque_fragment>
    `);
  };
  const dotGeometry = new THREE.SphereGeometry(.01, 8, 6);
  const transforms: THREE.Matrix4[] = [];
  const colors: THREE.Color[] = [];
  const glowPositions: number[] = [];
  const node = new THREE.Object3D();
  const random = (n: number) => THREE.MathUtils.seededRandom(n);
  const count = 6400;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - 2 * (i + .5) / count;
    const ring = Math.sqrt(1 - y * y);
    const angle = i * goldenAngle + (random(i * 17 + 7) - .5) * .035;
    const x = Math.cos(angle) * ring, z = Math.sin(angle) * ring;
    // Fine variation gives the shell depth without losing its spherical outline.
    const radial = .966 + random(i * 13 + 3) * .021;
    node.position.set(x, y, z).multiplyScalar(radial);
    glowPositions.push(node.position.x,node.position.y,node.position.z);
    node.scale.setScalar(.5 + random(i * 23 + 11) * .65);
    node.updateMatrix();
    transforms.push(node.matrix.clone());
    colors.push(new THREE.Color(0x858d91).lerp(new THREE.Color(0xb2b5b6), random(i * 19 + 29)));
  }
  const particles = new THREE.InstancedMesh(dotGeometry, material, transforms.length);
  particles.renderOrder = 1;
  transforms.forEach((matrix, i) => {
    particles.setMatrixAt(i, matrix);
    particles.setColorAt(i, colors[i]);
  });
  particles.instanceMatrix.needsUpdate = true;
  particles.computeBoundingSphere();
  root.add(particles);
  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute('position',new THREE.Float32BufferAttribute(glowPositions,3));
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: glowUniforms, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: pulseShader + `
      uniform float uHeight;varying float vGlow;
      void main(){
        vec4 p=modelViewMatrix*vec4(position,1.);
        float facing=dot(normalize(normalMatrix*normalize(position)),normalize(-p.xyz));
        vGlow=particlePulse(position)*smoothstep(-.1,.4,facing);
        gl_Position=projectionMatrix*p;
        gl_PointSize=clamp(.043*uHeight*projectionMatrix[1][1]*length(modelMatrix[0].xyz)/(2.*max(.1,-p.z)),1.,24.);
      }`,
    fragmentShader: `
      uniform float uAlpha;varying float vGlow;
      void main(){
        float r=length(gl_PointCoord-.5);
        float halo=exp(-r*r*22.)*(1.-smoothstep(.35,.5,r));
        gl_FragColor=vec4(.5,.56,.6,halo*vGlow*uAlpha*.18);
      }`,
  });
  const glow = new THREE.Points(glowGeometry,glowMaterial);
  glow.renderOrder=2;
  root.add(glow);
  return {
    root, material,
    resize(height: number, pixelRatio: number) { glowUniforms.uHeight.value=height*pixelRatio; },
    update(alpha: number, time: number) {
      material.opacity = coreMaterial.opacity = alpha;
      glowUniforms.uAlpha.value=alpha;
      glowUniforms.uParticleTime.value=reducedMotion.matches?0:time;
      const breath = .5 - .5 * Math.cos(time * Math.PI * 2 / 5.6);
      coreMaterial.emissiveIntensity = .18 + breath * .55;
    },
    setEnvironment(texture: THREE.Texture) {
      material.envMap = coreMaterial.envMap = texture;
      material.needsUpdate = coreMaterial.needsUpdate = true;
    },
    dispose() {
      particles.dispose();
      dotGeometry.dispose(); material.dispose();
      coreGeometry.dispose(); coreMaterial.dispose();
      glowGeometry.dispose(); glowMaterial.dispose();
    },
  };
}
