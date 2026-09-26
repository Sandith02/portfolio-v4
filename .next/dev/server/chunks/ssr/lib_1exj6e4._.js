module.exports = [
"[project]/lib/fusion-orb.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFusionOrb",
    ()=>createFusionOrb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
;
function createFusionOrb(figure, portalCamera) {
    const center = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, .94, -.3);
    const position = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](-.18, .95, .02);
    const velocity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](.48, .67, -.28);
    const bounds = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](.73, .88, .48);
    const normal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
    const offset = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
    const impactPosition = {
        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, .94, -1)
    };
    const impact = {
        value: 0
    };
    const time = {
        value: 0
    };
    const uniforms = {
        uTime: time,
        uImpact: impact,
        uOrbPosition: {
            value: position
        },
        uPortalCamera: portalCamera
    };
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
    const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms,
        depthWrite: false,
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
      }`
    });
    const sphere = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.36, 64, 48), material);
    sphere.position.copy(position);
    sphere.renderOrder = 1;
    figure.add(sphere);
    const haloMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms,
        transparent: true,
        depthWrite: false,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BackSide"],
        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdditiveBlending"],
        vertexShader: `uniform vec3 uOrbPosition;varying vec3 vHeadPosition;varying vec3 vNormal;varying vec3 vView;
      void main(){vHeadPosition=position+uOrbPosition;vec4 view=modelViewMatrix*vec4(position,1.);vView=-view.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*view;}`,
        fragmentShader: `uniform vec3 uPortalCamera;uniform float uImpact;varying vec3 vHeadPosition;varying vec3 vNormal;varying vec3 vView;
      void main(){${aperture}float rim=pow(abs(dot(normalize(vNormal),normalize(vView))),2.);
      gl_FragColor=vec4(mix(vec3(.12,.2,.4),vec3(.3,.18,.42),uImpact),rim*(.035+uImpact*.035));}`
    });
    const halo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](.47, 32, 24), haloMaterial);
    halo.position.copy(position);
    figure.add(halo);
    const light = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"](0xa8d8ff, 2.4, 4, 2);
    light.position.copy(position);
    figure.add(light);
    // Stars occupy the globe's volume rather than tracing its outer surface.
    const starCount = 2400;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    let seed = 921;
    const random = ()=>{
        seed = seed * 16807 % 2147483647;
        return (seed - 1) / 2147483646;
    };
    for(let i = 0; i < starCount; i++){
        const radius = Math.cbrt(random()) * .35;
        const azimuth = random() * Math.PI * 2, vertical = random() * 2 - 1;
        const horizontal = Math.sqrt(1 - vertical * vertical);
        starPositions.set([
            radius * horizontal * Math.cos(azimuth),
            radius * vertical,
            radius * horizontal * Math.sin(azimuth)
        ], i * 3);
        starSizes[i] = .45 + Math.pow(random(), 5) * 1.8;
    }
    const starGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    starGeometry.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](starPositions, 3));
    starGeometry.setAttribute("aSize", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](starSizes, 1));
    const starMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdditiveBlending"],
        vertexShader: `uniform float uTime;uniform vec3 uOrbPosition;attribute float aSize;varying float vBrightness;varying vec3 vHeadPosition;
      void main(){vec3 p=position;float a=uTime*(.14+length(p)*.2);p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;
      vHeadPosition=p+uOrbPosition;vec4 view=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*view;
      gl_PointSize=clamp(aSize*3./max(.5,-view.z),.65,3.);vBrightness=.45+.3*sin(position.x*421.+uTime*.7);}`,
        fragmentShader: `uniform vec3 uPortalCamera;varying float vBrightness;varying vec3 vHeadPosition;
      void main(){${aperture}float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.78,.85,1.,smoothstep(.5,.04,d)*vBrightness);}`
    });
    const stars = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"](starGeometry, starMaterial);
    stars.renderOrder = 2;
    figure.add(stars);
    const cold = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](0x8aabdf), hot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](0xb5a4ec);
    const updateVisuals = ()=>{
        sphere.position.copy(position);
        halo.position.copy(position);
        light.position.copy(position);
        stars.position.copy(position);
        light.intensity = .5 + impact.value * 1.5 + Math.sin(time.value * 3.) * .08;
        light.color.copy(cold).lerp(hot, impact.value);
    };
    updateVisuals();
    return {
        position,
        impact,
        impactPosition,
        setGlobeVisible (visible) {
            sphere.visible = visible;
            stars.visible = visible;
            halo.visible = visible;
        },
        update (delta, elapsed, pointerX, pointerY) {
            time.value = elapsed;
            // Substeps keep the collisions stable even after a slow frame.
            const steps = Math.max(1, Math.ceil(delta / .012));
            const dt = delta / steps;
            for(let step = 0; step < steps; step++){
                velocity.x += (Math.sin(elapsed * 2.1) * .32 + pointerX * .65) * dt;
                velocity.y += (Math.cos(elapsed * 1.7) * .3 - pointerY * .65) * dt;
                velocity.z += Math.sin(elapsed * 1.3 + .8) * .25 * dt;
                velocity.clampLength(.78, 1.15);
                position.addScaledVector(velocity, dt);
                offset.copy(position).sub(center).divide(bounds);
                if (offset.lengthSq() > 1) {
                    offset.normalize();
                    position.copy(offset).multiply(bounds).add(center);
                    normal.copy(offset).divide(bounds).normalize();
                    if (velocity.dot(normal) > 0) velocity.reflect(normal);
                    impact.value = 1;
                    impactPosition.value.copy(position).addScaledVector(normal, .36);
                }
            }
            impact.value *= Math.exp(-delta * 3.5);
            updateVisuals();
        }
    };
}
}),
"[project]/lib/inner-world-scene.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "THOUGHT_WORD_COUNT",
    ()=>THOUGHT_WORD_COUNT,
    "createInnerWorldScene",
    ()=>createInnerWorldScene,
    "thoughtWords",
    ()=>thoughtWords
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fusion$2d$orb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/fusion-orb.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/environments/RoomEnvironment.js [app-ssr] (ecmascript)");
;
;
;
;
;
const thoughtWords = [
    "UNSAID",
    "UNSEEN",
    "ECHO",
    "ABSENCE",
    "AGAIN",
    "ALMOST",
    "ELSEWHERE",
    "STATIC",
    "STILL",
    "WITHIN",
    "DISTANT",
    "SILENT",
    "DRIFT",
    "AFTERIMAGE",
    "UNFINISHED",
    "HOLLOW",
    "BETWEEN",
    "TRACE",
    "UNHEARD",
    "RETURN",
    "THRESHOLD",
    "REMNANT",
    "OTHER",
    "NEARLY",
    "FRACTURE",
    "WAIT",
    "PAUSE",
    "OUTSIDE",
    "INSIDE",
    "FAR",
    "LOOP",
    "ERASURE"
];
const THOUGHT_WORD_COUNT = 128 * 80;
function wordTexture(size) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, size, size);
    context.textBaseline = "middle";
    const cellWidth = size / 80;
    const cellHeight = size / 128;
    // 10,240 separate word instances, with no sentences or generated personal claims.
    for(let row = 0; row < 128; row++){
        for(let column = 0; column < 80; column++){
            const word = thoughtWords[(row * 7 + column * 3 + (row % 4 === 0 ? 0 : column)) % thoughtWords.length];
            context.font = `400 ${cellHeight * (.58 + (row + column) % 4 * .06)}px "IBM Plex Mono", monospace`;
            context.fillStyle = `rgb(${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130})`;
            context.fillText(word, column * cellWidth + cellWidth * .06, (row + .5) * cellHeight + Math.sin(column * 4 + row) * cellHeight * .08, cellWidth * .89);
        }
    }
    // Occasional larger fragments surface above the dense, quieter layer.
    for(let index = 0; index < 80; index++){
        const x = index * 337 % 1900 / 2048 * size;
        const y = (index * 193 + 53) % 2000 / 2048 * size;
        context.fillStyle = "#080909";
        context.fillRect(x - 2, y - size * .007, size * .068, size * .014);
        context.font = `400 ${size * .012}px "IBM Plex Mono", monospace`;
        context.fillStyle = "#eeeeee";
        context.fillText(thoughtWords[index % thoughtWords.length], x, y, size * .064);
    }
    const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    texture.wrapS = texture.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    texture.anisotropy = 4;
    return texture;
}
function disposeObject(object) {
    const textures = new Set();
    object.traverse((child)=>{
        if (!(child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"] || child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"])) return;
        child.geometry.dispose();
        (Array.isArray(child.material) ? child.material : [
            child.material
        ]).forEach((material)=>{
            Object.values(material).forEach((value)=>{
                if (value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Texture"]) textures.add(value);
            });
            material.dispose();
        });
    });
    textures.forEach((texture)=>texture.dispose());
}
// Reconstruct the damaged side from the intact scanned half. Clipping crossing
// triangles at the center keeps a closed seam and preserves the original contours.
function repairHeadSymmetry(source) {
    const position = source.getAttribute("position"), normal = source.getAttribute("normal"), uv = source.getAttribute("uv");
    const indices = source.getIndex();
    const vertices = [], normals = [], uvs = [];
    const read = (index)=>({
            p: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]().fromBufferAttribute(position, index),
            n: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]().fromBufferAttribute(normal, index),
            uv: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector2"](uv.getX(index), uv.getY(index))
        });
    const emit = (triangle, mirror)=>{
        for (const v of mirror ? [
            ...triangle
        ].reverse() : triangle){
            vertices.push(v.p.x * (mirror ? -1 : 1), v.p.y, v.p.z);
            normals.push(v.n.x * (mirror ? -1 : 1), v.n.y, v.n.z);
            uvs.push(v.uv.x, v.uv.y);
        }
    };
    for(let i = 0; i < (indices?.count ?? position.count); i += 3){
        const triangle = [
            0,
            1,
            2
        ].map((offset)=>read(indices ? indices.getX(i + offset) : i + offset));
        const clipped = [];
        for(let corner = 0; corner < 3; corner++){
            const a = triangle[corner], b = triangle[(corner + 1) % 3];
            if (a.p.x <= 0) clipped.push(a);
            if (a.p.x <= 0 !== b.p.x <= 0) {
                const t = -a.p.x / (b.p.x - a.p.x);
                const intersection = {
                    p: a.p.clone().lerp(b.p, t),
                    n: a.n.clone().lerp(b.n, t).normalize(),
                    uv: a.uv.clone().lerp(b.uv, t)
                };
                intersection.p.x = 0;
                clipped.push(intersection);
            }
        }
        for(let fan = 1; fan + 1 < clipped.length; fan++){
            const triangle = [
                clipped[0],
                clipped[fan],
                clipped[fan + 1]
            ];
            emit(triangle, false);
            emit(triangle, true);
        }
    }
    const raw = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    raw.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    raw.setAttribute("normal", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](normals, 3));
    raw.setAttribute("uv", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](uvs, 2));
    const repaired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeVertices"])(raw);
    raw.dispose();
    return repaired;
}
async function createInnerWorldScene(host, hero, signal) {
    const response = await fetch("/models/inner-world-head.glb", {
        signal
    });
    if (!response.ok) throw new Error("Figure could not be loaded");
    const gltf = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GLTFLoader"]().parseAsync(await response.arrayBuffer(), "/models/");
    if (signal.aborted) {
        disposeObject(gltf.scene);
        throw new DOMException("Aborted", "AbortError");
    }
    await document.fonts.ready;
    let source;
    gltf.scene.traverse((child)=>{
        if (child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"]) source = child;
    });
    if (!source) {
        disposeObject(gltf.scene);
        throw new Error("Figure geometry missing");
    }
    const geometry = repairHeadSymmetry(source.geometry);
    geometry.scale(.62, .62, .62);
    const outerGeometry = geometry.clone();
    const outerPosition = outerGeometry.getAttribute("position");
    for(let index = 0; index < outerPosition.count; index++){
        const x = outerPosition.getX(index), y = outerPosition.getY(index), z = outerPosition.getZ(index);
        const ellipse = (x / .88) ** 2 + ((y - .94) / 1.32) ** 2;
        if (z > .45 && ellipse < 1.18) outerPosition.setZ(index, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(z, 1.06, 1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(ellipse, .92, 1.18)));
    }
    outerGeometry.computeVertexNormals();
    const position = geometry.getAttribute("position");
    // Hollow the scanned face while preserving the cranium, ears, neck and shoulders.
    for(let index = 0; index < position.count; index++){
        let x = position.getX(index);
        const y = position.getY(index), z = position.getZ(index);
        // Blend the inward ear folds into the adjacent cranial curve. This moves
        // protruding geometry outward instead of cutting holes in the inner wall.
        const earWeight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(Math.abs(x), .6, .74) * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(y, .25, .5) * (1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(y, .96, 1.25)) * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(z, -.7, -.48) * (1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(z, .42, .7));
        const sideCurve = 1.26 * Math.sqrt(Math.max(0, 1 - ((z + .12) / 1.5) ** 2));
        x = Math.sign(x) * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(Math.abs(x), sideCurve, earWeight);
        position.setX(index, x);
        const ellipse = (x / .88) ** 2 + ((y - .94) / 1.32) ** 2;
        if (z > .45 && ellipse < 1.18) {
            const blend = 1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(ellipse, .92, 1.18);
            position.setZ(index, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(z, 1.06, blend));
        }
    }
    geometry.computeVertexNormals();
    disposeObject(gltf.scene);
    if (signal.aborted) {
        geometry.dispose();
        outerGeometry.dispose();
        throw new DOMException("Aborted", "AbortError");
    }
    let renderer;
    try {
        renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
    } catch (error) {
        geometry.dispose();
        outerGeometry.dispose();
        throw error;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.5));
    renderer.setClearColor(0x080a0b);
    renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
    renderer.toneMappingExposure = .9;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Scene"]();
    const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PerspectiveCamera"](37, 1, .1, 60);
    const figure = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    scene.add(figure);
    const words = wordTexture(Math.min(renderer.capabilities.maxTextureSize, window.innerWidth < 768 ? 2048 : 4096));
    const time = {
        value: 0
    };
    const progressUniform = {
        value: 0
    };
    const portalCamera = {
        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, .25, 8)
    };
    const fusion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$fusion$2d$orb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFusionOrb"])(figure, portalCamera);
    fusion.setGlobeVisible(false);
    const makeBodyMaterial = (interior)=>{
        const bodyMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
            color: interior ? 0x090e11 : 0x141819,
            metalness: .72,
            roughness: interior ? .6 : .42,
            clearcoat: interior ? .05 : .2,
            envMapIntensity: interior ? .12 : .4,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
        });
        bodyMaterial.onBeforeCompile = (shader)=>{
            shader.uniforms.uThoughts = {
                value: words
            };
            shader.uniforms.uTime = time;
            shader.uniforms.uProgress = progressUniform;
            shader.uniforms.uPortalCamera = portalCamera;
            shader.uniforms.uInterior = {
                value: interior
            };
            shader.uniforms.uOrbPosition = {
                value: fusion.position
            };
            shader.uniforms.uImpact = fusion.impact;
            shader.uniforms.uImpactPosition = fusion.impactPosition;
            shader.vertexShader = "varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n" + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vThoughtPosition = position; vThoughtUv = uv;");
            shader.fragmentShader = `uniform vec3 uOrbPosition; uniform vec3 uImpactPosition; uniform float uImpact; uniform sampler2D uThoughts; uniform bool uInterior; uniform vec3 uPortalCamera; uniform float uTime; uniform float uProgress; varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n` + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace("#include <clipping_planes_fragment>", `
      #include <clipping_planes_fragment>
      float faceEllipse=pow(vThoughtPosition.x/.88,2.)+pow((vThoughtPosition.y-.94)/1.32,2.);
      if(faceEllipse<.91 && (!uInterior || vThoughtPosition.z>-.25)) discard;
      bool inside=false;
      if(vThoughtPosition.z<1.085){
        if(uPortalCamera.z<=1.075) inside=true;
        else {
          float t=(uPortalCamera.z-1.075)/(uPortalCamera.z-vThoughtPosition.z);
          vec3 hit=mix(uPortalCamera,vThoughtPosition,t);
          inside=pow(hit.x/.844,2.)+pow((hit.y-.94)/1.26,2.)<1.;
        }
      }
      if(uInterior){
        if(!inside || gl_FrontFacing) discard;

      }else if(inside) discard;
    `);
            shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `
      #include <emissivemap_fragment>
      vec2 thoughtUv=vThoughtUv;
      float row=floor(thoughtUv.y*64.);
      thoughtUv.x+=sin(row*7.13)*uTime*.0008+sin(row*4.2)*uProgress*.1;
      thoughtUv.y+=uTime*.001+uProgress*.085;
      float ink=texture2D(uThoughts,thoughtUv).r;
      float warmth=smoothstep(.2,.65,uProgress)*.2;
      totalEmissiveRadiance+=ink*mix(vec3(.18,.21,.22),vec3(.26,.16,.15),warmth)*(uInterior ? .45 : 1.);
      if(uInterior){
        float glow=exp(-length(vThoughtPosition-uOrbPosition)*2.2);
        float hitDistance=length(vThoughtPosition-uImpactPosition);
        float hit=exp(-hitDistance*4.)*uImpact;
        float ripple=exp(-pow((hitDistance-(1.-uImpact)*1.5)*9.,2.))*uImpact;
        totalEmissiveRadiance+=vec3(.12,.28,.38)*glow+vec3(.28,.2,.5)*(hit+ripple*.4);
      }
    `);
        };
        bodyMaterial.customProgramCacheKey = ()=>interior ? "inner-head" : "outer-head";
        return bodyMaterial;
    };
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](outerGeometry, makeBodyMaterial(false));
    const interiorBody = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geometry, makeBodyMaterial(true));
    figure.add(body, interiorBody);
    const pmrem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PMREMGenerator"](renderer);
    const room = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoomEnvironment"]();
    const environment = pmrem.fromScene(room, .06);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    const edge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](1, .011, 10, 128), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: 0x4d5956,
        metalness: .85,
        roughness: .32,
        envMapIntensity: .8
    }));
    edge.scale.set(.844, 1.26, 1);
    edge.position.set(0, .94, 1.08);
    figure.add(edge);
    const haze = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](160, 100), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        depthWrite: false,
        uniforms: {
            uProgress: progressUniform
        },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec2 vUv;uniform float uProgress;void main(){vec2 p=vUv-.5;float glow=exp(-dot(p*vec2(1.2,.8),p*vec2(1.2,.8))*12.);vec3 c=mix(vec3(.009,.012,.014),vec3(.023,.029,.031),glow);c*=1.-smoothstep(.2,.48,uProgress);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`
    }));
    haze.position.set(1, .5, -40);
    scene.add(haze);
    scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmbientLight"](0xa5b9bd, .17));
    const key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"](0xc4d5d8, 1.6);
    key.position.set(-4, 5, 3);
    scene.add(key);
    const rim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"](0x93acb4, 2.2);
    rim.position.set(3, 2, -4);
    scene.add(rim);
    const red = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointLight"](0x983a33, 7, 9, 2);
    red.position.set(-3, -.5, 1);
    scene.add(red);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false, visible = true, destroyed = false, progress = 0, targetProgress = 0, elapsed = 0, frame = 0, lastFrame = 0;
    let pointerX = 0, pointerY = 0, lookX = 0, lookY = 0;
    let mobile = host.clientWidth < 768;
    const measure = ()=>{
        targetProgress = reduced.matches ? 0 : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - host.clientHeight), 0, 1);
    };
    const draw = ()=>{
        const p = reduced.matches ? 0 : progress;
        const approach = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, 0, 1);
        figure.position.set(0, mobile ? .05 : -.2, 0);
        figure.rotation.set(-.015 + lookY * .05, lookX * .1 + Math.sin(elapsed * .12) * .012 * (1 - approach), 0);
        const cameraY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(.25, .94 + figure.position.y, approach);
        const cameraZ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(mobile ? 9.9 : 8, 1.04, approach);
        body.visible = interiorBody.visible = cameraZ > -1.8;
        edge.visible = cameraZ > 1.12;
        camera.position.set(0, cameraY, cameraZ);
        camera.lookAt(0, cameraY, cameraZ - 10);
        figure.updateMatrixWorld(true);
        portalCamera.value.copy(camera.position);
        figure.worldToLocal(portalCamera.value);
        time.value = elapsed;
        progressUniform.value = p;
        red.intensity = 7 + Math.sin(elapsed * .18) * .5 + p * 6;
        hero.style.setProperty("--inner-progress", p.toFixed(4));
        hero.style.setProperty("--inner-first", Math.max(0, 1 - p * 3.5).toFixed(3));
        hero.style.setProperty("--inner-second", Math.max(0, 1 - Math.abs(p - .47) * 5.5).toFixed(3));
        hero.style.setProperty("--inner-last", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, .72, .95).toFixed(3));
        renderer.render(scene, camera);
    };
    const animate = (now)=>{
        if (destroyed) return;
        const delta = Math.min((now - (lastFrame || now)) / 1000, .05);
        lastFrame = now;
        elapsed += delta;
        const ease = 1 - Math.exp(-delta * 4.5);
        progress += (targetProgress - progress) * ease;
        lookX += (pointerX - lookX) * ease;
        lookY += (pointerY - lookY) * ease;
        fusion.update(delta, elapsed, lookX, lookY);
        draw();
        frame = requestAnimationFrame(animate);
    };
    const sync = ()=>{
        cancelAnimationFrame(frame);
        lastFrame = 0;
        if (!paused && !reduced.matches && visible && !document.hidden && !destroyed) frame = requestAnimationFrame(animate);
        else draw();
    };
    const resize = ()=>{
        mobile = host.clientWidth < 768;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
        measure();
        draw();
    };
    const pointer = (event)=>{
        if (event.pointerType === "mouse" && !paused && !reduced.matches) {
            pointerX = event.clientX / window.innerWidth - .5;
            pointerY = event.clientY / window.innerHeight - .5;
        }
    };
    const leave = ()=>{
        pointerX = 0;
        pointerY = 0;
    };
    const preference = ()=>{
        measure();
        if (reduced.matches) {
            progress = 0;
            lookX = 0;
            lookY = 0;
        }
        sync();
    };
    const observer = new IntersectionObserver((entries)=>{
        visible = entries[0].isIntersecting;
        sync();
    });
    observer.observe(hero);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("scroll", measure, {
        passive: true
    });
    hero.addEventListener("pointermove", pointer);
    hero.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", preference);
    const lost = (event)=>{
        event.preventDefault();
        paused = true;
        cancelAnimationFrame(frame);
        host.dataset.ready = "false";
        hero.dataset.fallback = "true";
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    resize();
    progress = targetProgress;
    draw();
    host.dataset.ready = "true";
    sync();
    return {
        setPaused (value) {
            paused = value;
            sync();
        },
        dispose () {
            destroyed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener("scroll", measure);
            hero.removeEventListener("pointermove", pointer);
            hero.removeEventListener("pointerleave", leave);
            document.removeEventListener("visibilitychange", sync);
            reduced.removeEventListener("change", preference);
            renderer.domElement.removeEventListener("webglcontextlost", lost);
            disposeObject(scene);
            words.dispose();
            environment.dispose();
            renderer.dispose();
            renderer.domElement.remove();
            host.dataset.ready = "false";
        }
    };
}
}),
];

//# sourceMappingURL=lib_1exj6e4._.js.map