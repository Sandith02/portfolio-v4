(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/cosmic-galaxy.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCosmicGalaxy",
    ()=>createCosmicGalaxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
function createCosmicGalaxy(time, progress) {
    const aspect = {
        value: 1
    };
    const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms: {
            uTime: time,
            uProgress: progress,
            uAspect: aspect
        },
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
      }`
    });
    const mesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](2, 2), material);
    mesh.frustumCulled = false;
    mesh.renderOrder = 10;
    return {
        mesh,
        aspect
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/inner-world-scene.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "THOUGHT_WORD_COUNT",
    ()=>THOUGHT_WORD_COUNT,
    "createInnerWorldScene",
    ()=>createInnerWorldScene,
    "thoughtWords",
    ()=>thoughtWords
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/environments/RoomEnvironment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cosmic$2d$galaxy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cosmic-galaxy.ts [app-client] (ecmascript)");
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
    const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
    texture.wrapS = texture.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    texture.anisotropy = 4;
    return texture;
}
function disposeObject(object) {
    const textures = new Set();
    object.traverse((child)=>{
        if (!(child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"] || child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"])) return;
        child.geometry.dispose();
        (Array.isArray(child.material) ? child.material : [
            child.material
        ]).forEach((material)=>{
            Object.values(material).forEach((value)=>{
                if (value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Texture"]) textures.add(value);
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
            p: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromBufferAttribute(position, index),
            n: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().fromBufferAttribute(normal, index),
            uv: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](uv.getX(index), uv.getY(index))
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
    const raw = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    raw.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](vertices, 3));
    raw.setAttribute("normal", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](normals, 3));
    raw.setAttribute("uv", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](uvs, 2));
    const repaired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$BufferGeometryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeVertices"])(raw);
    raw.dispose();
    return repaired;
}
async function createInnerWorldScene(host, hero, signal) {
    const response = await fetch("/models/inner-world-head.glb", {
        signal
    });
    if (!response.ok) throw new Error("Figure could not be loaded");
    const gltf = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLTFLoader"]().parseAsync(await response.arrayBuffer(), "/models/");
    if (signal.aborted) {
        disposeObject(gltf.scene);
        throw new DOMException("Aborted", "AbortError");
    }
    await document.fonts.ready;
    let source;
    gltf.scene.traverse((child)=>{
        if (child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"]) source = child;
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
        if (z > .45 && ellipse < 1.18) outerPosition.setZ(index, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(z, 1.06, 1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(ellipse, .92, 1.18)));
    }
    outerGeometry.computeVertexNormals();
    const position = geometry.getAttribute("position");
    // Hollow the scanned face while preserving the cranium, ears, neck and shoulders.
    for(let index = 0; index < position.count; index++){
        let x = position.getX(index);
        const y = position.getY(index), z = position.getZ(index);
        // Blend the inward ear folds into the adjacent cranial curve. This moves
        // protruding geometry outward instead of cutting holes in the inner wall.
        const earWeight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(Math.abs(x), .6, .74) * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(y, .25, .5) * (1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(y, .96, 1.25)) * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(z, -.7, -.48) * (1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(z, .42, .7));
        const sideCurve = 1.26 * Math.sqrt(Math.max(0, 1 - ((z + .12) / 1.5) ** 2));
        x = Math.sign(x) * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(Math.abs(x), sideCurve, earWeight);
        position.setX(index, x);
        const ellipse = (x / .88) ** 2 + ((y - .94) / 1.32) ** 2;
        if (z > .45 && ellipse < 1.18) {
            const blend = 1 - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(ellipse, .92, 1.18);
            position.setZ(index, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(z, 1.06, blend));
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
        renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
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
    renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
    renderer.toneMappingExposure = .9;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
    const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](37, 1, .1, 60);
    const figure = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
    scene.add(figure);
    const words = wordTexture(Math.min(renderer.capabilities.maxTextureSize, window.innerWidth < 768 ? 2048 : 4096));
    const time = {
        value: 0
    };
    const progressUniform = {
        value: 0
    };
    const galaxy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cosmic$2d$galaxy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCosmicGalaxy"])(time, progressUniform);
    scene.add(galaxy.mesh);
    const portalCamera = {
        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, .25, 8)
    };
    const reflectionPosition = {
        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, .1)
    };
    const filmPointer = {
        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"]()
    };
    const makeBodyMaterial = (interior)=>{
        const bodyMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshPhysicalMaterial"]({
            color: interior ? 0x010205 : 0x141819,
            metalness: interior ? .16 : .72,
            roughness: interior ? .76 : .48,
            clearcoat: interior ? .025 : .14,
            clearcoatRoughness: interior ? .5 : .22,
            envMapIntensity: interior ? .008 : .3,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
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
            shader.uniforms.uReflectionPosition = reflectionPosition;
            shader.vertexShader = "varying vec3 vThoughtPosition; varying vec2 vThoughtUv;\n" + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vThoughtPosition = position; vThoughtUv = uv;");
            shader.fragmentShader = `
      uniform vec3 uReflectionPosition; uniform sampler2D uThoughts; uniform bool uInterior;
      uniform vec3 uPortalCamera; uniform float uTime; uniform float uProgress;
      varying vec3 vThoughtPosition; varying vec2 vThoughtUv;
      float cosmicHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float cosmicNoise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(cosmicHash(i),cosmicHash(i+vec2(1.,0.)),f.x),
          mix(cosmicHash(i+vec2(0.,1.)),cosmicHash(i+vec2(1.,1.)),f.x),f.y);
      }
      float cosmicCloud(vec2 p){
        return .5*cosmicNoise(p)+.25*cosmicNoise(p*2.03+7.1)+.125*cosmicNoise(p*4.07+19.3);
      }
    ` + shader.fragmentShader;
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
            shader.fragmentShader = shader.fragmentShader.replace("#include <opaque_fragment>", `
      #include <opaque_fragment>
      if(uInterior){
        float depthDarkness=smoothstep(.08,1.,uProgress);
        gl_FragColor.rgb*=mix(1.,.025,depthDarkness);
      }
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
        float glow=exp(-length(vThoughtPosition-uReflectionPosition)*2.2);
        // Cosmic pigment follows the real curved wall; the words remain a separate layer.
        vec2 sky=vThoughtUv*vec2(190.,170.);
        vec2 cell=floor(sky);
        float seed=cosmicHash(cell);
        vec2 starPosition=.15+.7*vec2(cosmicHash(cell+17.2),cosmicHash(cell+51.7));
        float radius=length(fract(sky)-starPosition);
        float star=exp(-radius*radius/(.005+fwidth(sky.x)*.016))*step(.85,seed);
        star*=.75+.25*sin(uTime*.32+seed*63.);
        vec2 cloudUv=vThoughtUv*10.+vec2(uTime*.003,0.);
        float cloud=cosmicCloud(cloudUv);
        float dust=cosmicCloud(cloudUv*3.2+cloud*2.);
        float nebula=pow(max(0.,cloud-.18),1.4)*(.3+dust);
        totalEmissiveRadiance+=vec3(.007,.012,.024)*glow;
        totalEmissiveRadiance+=mix(vec3(.035,.06,.115),vec3(.075,.045,.1),dust)*nebula;
        totalEmissiveRadiance+=vec3(.3,.36,.43)*star;
      }
    `);
        };
        bodyMaterial.customProgramCacheKey = ()=>interior ? "inner-head" : "outer-head";
        return bodyMaterial;
    };
    const body = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](outerGeometry, makeBodyMaterial(false));
    const interiorBody = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geometry, makeBodyMaterial(true));
    figure.add(body, interiorBody);
    const pmrem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PMREMGenerator"](renderer);
    const room = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$environments$2f$RoomEnvironment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomEnvironment"]();
    const environment = pmrem.fromScene(room, .06);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    const edge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TorusGeometry"](1, .011, 10, 128), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        color: 0x4d5956,
        metalness: .85,
        roughness: .32,
        envMapIntensity: .8
    }));
    edge.scale.set(.844, 1.26, 1);
    edge.position.set(0, .94, 1.08);
    figure.add(edge);
    // A transparent, flexible film across the aperture, with soft moving reflections.
    const film = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.688, 2.52, 64, 64), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        uniforms: {
            uTime: time,
            uProgress: progressUniform,
            uPointer: filmPointer
        },
        transparent: true,
        depthWrite: false,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
        vertexShader: `uniform float uTime;uniform vec2 uPointer;varying vec2 vUv;
      void main(){vUv=uv;vec3 p=position;float envelope=max(0.,1.-length((uv-.5)*2.));
      p.z+=sin(uv.x*7.+uv.y*5.+uTime*.6)*.012*envelope;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
        fragmentShader: `uniform float uTime;uniform float uProgress;uniform vec2 uPointer;varying vec2 vUv;
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);if(r>1.)discard;
        float drift=sin(uTime*.23)*.35+uPointer.x*.3;
        float curve=p.x*.72+p.y*.42+sin(p.y*2.6+uTime*.35)*.12;
        float broad=exp(-pow((curve-drift-.22)*5.,2.));
        float streak=exp(-pow((curve-drift-.25)*31.,2.));
        float secondary=exp(-pow((p.x*.8-p.y*.5+drift+.58)*14.,2.));
        float edge=pow(smoothstep(.83,1.,r),2.);
        float fade=1.-smoothstep(.72,.94,uProgress);
        float alpha=(.008+broad*.025+streak*.045+secondary*.015+edge*.025)*fade;
        vec3 tint=mix(vec3(.38,.47,.5),vec3(.82,.89,.9),streak);
        gl_FragColor=vec4(tint,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    }));
    film.position.set(0, .94, 1.095);
    film.renderOrder = 3;
    figure.add(film);
    const liningLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0x9bb5c4, .6, 3.5, 2);
    figure.add(liningLight);
    const haze = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](160, 100), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        depthWrite: false,
        uniforms: {
            uProgress: progressUniform
        },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec2 vUv;uniform float uProgress;void main(){vec2 p=vUv-.5;float glow=exp(-dot(p*vec2(1.2,.8),p*vec2(1.2,.8))*12.);vec3 c=mix(vec3(.009,.012,.014),vec3(.023,.029,.031),glow);c*=1.-smoothstep(.2,.48,uProgress);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`
    }));
    haze.position.set(1, .5, -40);
    scene.add(haze);
    scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0xa5b9bd, .17));
    const key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xc4d5d8, 1.6);
    key.position.set(-4, 5, 3);
    scene.add(key);
    const rim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0x93acb4, 2.2);
    rim.position.set(3, 2, -4);
    scene.add(rim);
    const red = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0x983a33, 7, 9, 2);
    red.position.set(-3, -.5, 1);
    scene.add(red);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false, visible = true, destroyed = false, progress = 0, targetProgress = 0, elapsed = 0, frame = 0, lastFrame = 0;
    let pointerX = 0, pointerY = 0, lookX = 0, lookY = 0;
    let mobile = host.clientWidth < 768;
    const measure = ()=>{
        targetProgress = reduced.matches ? 0 : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - host.clientHeight), 0, 1);
    };
    const draw = ()=>{
        const p = reduced.matches ? 0 : progress;
        const approach = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, 0, 1);
        figure.position.set(Math.sin(elapsed * .31) * .012, (mobile ? .05 : -.2) + Math.sin(elapsed * .43) * .008, 0);
        figure.rotation.set(-.015 + lookY * .05 + Math.sin(elapsed * .29) * .004, lookX * .1 + Math.sin(elapsed * .12) * .012, Math.sin(elapsed * .23) * .002);
        const cameraY = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(.25, .94 + figure.position.y, approach);
        const cameraZ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(mobile ? 9.9 : 8, 1.04, approach);
        body.visible = interiorBody.visible = cameraZ > -1.8;
        edge.visible = cameraZ > 1.12;
        camera.position.set(0, cameraY, cameraZ);
        camera.lookAt(0, cameraY, cameraZ - 10);
        figure.updateMatrixWorld(true);
        portalCamera.value.copy(camera.position);
        figure.worldToLocal(portalCamera.value);
        reflectionPosition.value.set(Math.sin(elapsed * .35) * .4, .94 + Math.cos(elapsed * .27) * .5, .1);
        liningLight.position.copy(reflectionPosition.value);
        liningLight.intensity = .15 * (1. - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, .08, 1.) * .7);
        filmPointer.value.set(lookX, lookY);
        time.value = elapsed;
        progressUniform.value = p;
        galaxy.mesh.visible = p > .77;
        red.intensity = 7 + Math.sin(elapsed * .18) * .5 + p * 6;
        hero.style.setProperty("--inner-progress", p.toFixed(4));
        hero.style.setProperty("--inner-first", Math.max(0, 1 - p * 3.5).toFixed(3));
        hero.style.setProperty("--inner-second", Math.max(0, 1 - Math.abs(p - .47) * 5.5).toFixed(3));
        hero.style.setProperty("--inner-last", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].smoothstep(p, .72, .95).toFixed(3));
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
        galaxy.aspect.value = camera.aspect;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_18frtg7._.js.map