module.exports = [
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/environments/RoomEnvironment.js [app-ssr] (ecmascript)");
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
    const position = geometry.getAttribute("position");
    // Hollow the scanned face while preserving the cranium, ears, neck and shoulders.
    for(let index = 0; index < position.count; index++){
        const x = position.getX(index), y = position.getY(index), z = position.getZ(index);
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
    const portalMask = `
    if(uPortalCamera.z>1.075){
      float t=(uPortalCamera.z-1.075)/(uPortalCamera.z-vPortalPosition.z);
      vec3 hit=mix(uPortalCamera,vPortalPosition,t);
      if(pow(hit.x/.843,2.)+pow((hit.y-.94)/1.259,2.)>1.)discard;
    }`;
    const bodyMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
        color: 0x141819,
        metalness: .72,
        roughness: .42,
        clearcoat: .2,
        envMapIntensity: .4,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"]
    });
    bodyMaterial.onBeforeCompile = (shader)=>{
        shader.uniforms.uThoughts = {
            value: words
        };
        shader.uniforms.uTime = time;
        shader.uniforms.uProgress = progressUniform;
        shader.vertexShader = "varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vThoughtPosition = position; vThoughtUv = uv;");
        shader.fragmentShader = `uniform sampler2D uThoughts; uniform float uTime; uniform float uProgress; varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace("#include <clipping_planes_fragment>", `
      #include <clipping_planes_fragment>
      float faceEllipse=pow(vThoughtPosition.x/.88,2.)+pow((vThoughtPosition.y-.94)/1.32,2.);
      if(faceEllipse<.91) discard;
    `);
        shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `
      #include <emissivemap_fragment>
      vec2 thoughtUv=vThoughtUv;
      float row=floor(thoughtUv.y*64.);
      thoughtUv.x+=sin(row*7.13)*uTime*.0008+sin(row*4.2)*uProgress*.1;
      thoughtUv.y+=uTime*.001+uProgress*.085;
      float ink=texture2D(uThoughts,thoughtUv).r;
      float warmth=smoothstep(.2,.65,uProgress)*.2;
      totalEmissiveRadiance+=ink*mix(vec3(.18,.21,.22),vec3(.26,.16,.15),warmth);
    `);
    };
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geometry, bodyMaterial);
    figure.add(body);
    const pmrem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PMREMGenerator"](renderer);
    const room = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoomEnvironment"]();
    const environment = pmrem.fromScene(room, .06);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    const voidMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms: {
            uTime: time,
            uProgress: progressUniform,
            uPortalCamera: portalCamera
        },
        transparent: false,
        vertexShader: `varying vec2 vUv;varying vec3 vPortalPosition;void main(){vUv=uv;vPortalPosition=vec3(position.xy+vec2(0.,.94),-30.);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
      varying vec2 vUv;varying vec3 vPortalPosition;uniform vec3 uPortalCamera; uniform float uTime;uniform float uProgress;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){
        ${portalMask}
        vec2 p=vPortalPosition.xy/8.;
        float bend=.46+sin(p.x*2.1+uTime*.08)*.2+noise(p*8.)*.07;
        float ribbon=pow(max(0.,1.-abs(p.y-bend)*17.),2.);
        float echo=pow(max(0.,1.-abs(p.y-bend+.14)*26.),2.)*.45;
        float cloud=noise(p*31.+uTime*.018)*noise(p*63.);
        vec3 color=vec3(.001,.002,.003)+vec3(.5,.56,.59)*(ribbon+echo)*(.2+cloud*.8);
        color+=vec3(.013,.009,.01)*cloud*uProgress;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    });
    const innerVoid = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](60, 60), voidMaterial);
    innerVoid.position.set(0, .94, -30);
    figure.add(innerVoid);
    const edge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](1, .011, 10, 128), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: 0x4d5956,
        metalness: .85,
        roughness: .32,
        envMapIntensity: .8
    }));
    edge.scale.set(.844, 1.26, 1);
    edge.position.set(0, .94, 1.08);
    figure.add(edge);
    let seed = 921;
    const random = ()=>{
        seed = seed * 16807 % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const starCount = window.innerWidth < 768 ? 9000 : 18000;
    const starPositions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    for(let i = 0; i < starCount; i++){
        const radius = Math.sqrt(random()) * .96;
        const angle = random() * Math.PI * 2;
        const depth = random();
        const spread = 1.5 + depth * 9;
        starPositions.set([
            Math.cos(angle) * radius * spread,
            Math.sin(angle) * radius * spread + .94,
            .95 - depth * 29
        ], i * 3);
        sizes[i] = .65 + Math.pow(random(), 3) * 2.2;
    }
    const starsGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    starsGeometry.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](starPositions, 3));
    starsGeometry.setAttribute("aSize", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](sizes, 1));
    const starsMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms: {
            uTime: time,
            uProgress: progressUniform,
            uPixelRatio: {
                value: renderer.getPixelRatio()
            },
            uPortalCamera: portalCamera
        },
        transparent: true,
        depthWrite: false,
        blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdditiveBlending"],
        vertexShader: `uniform float uTime;uniform float uProgress;uniform float uPixelRatio;attribute float aSize;varying float vOpacity;varying vec3 vPortalPosition;
      void main(){
        float a=uTime*.009;vec3 p=position;
        p.xy=mat2(cos(a),-sin(a),sin(a),cos(a))*(p.xy-vec2(0.,.94))+vec2(0.,.94);
        vPortalPosition=p;vec4 viewPosition=modelViewMatrix*vec4(p,1.);
        gl_Position=projectionMatrix*viewPosition;
        gl_PointSize=clamp(aSize*uPixelRatio*12./max(.3,-viewPosition.z),.7,12.);
        vOpacity=.5+.25*sin(position.x*31.+uTime*.2);
      }`,
        fragmentShader: `uniform vec3 uPortalCamera;varying vec3 vPortalPosition;varying float vOpacity;void main(){
      ${portalMask}
      float d=length(gl_PointCoord-.5);float alpha=smoothstep(.5,.08,d)*vOpacity;
      gl_FragColor=vec4(.7,.79,.83,alpha);
    }`
    });
    const stars = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"](starsGeometry, starsMaterial);
    figure.add(stars);
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
        const approach = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, 0, .57);
        const journey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, .48, 1);
        figure.position.set(0, mobile ? .05 : -.2, 0);
        figure.rotation.set(-.015 + lookY * .05, lookX * .1 + Math.sin(elapsed * .12) * .012 * (1 - approach), 0);
        const cameraY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(.25, .94 + figure.position.y, approach);
        const cameraZ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].lerp(mobile ? 9.9 : 8, 1.6, approach) - journey * 19;
        body.visible = cameraZ > -1.8;
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

//# sourceMappingURL=lib_inner-world-scene_ts_1gpdvql._.js.map