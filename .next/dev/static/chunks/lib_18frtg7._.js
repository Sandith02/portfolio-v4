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
    "SANDITH",
    "SITHMAKA",
    "UNSAID",
    "UNREAD",
    "QUIET",
    "STILL",
    "WITHIN",
    "RESTLESS",
    "WATCHFUL",
    "UNFINISHED",
    "BECOMING",
    "WONDER",
    "IMAGINE",
    "FREEDOM",
    "EXPRESSION",
    "POSSIBILITY",
    "WHAT IF",
    "LOOK CLOSER",
    "MORE THAN I SHOW",
    "THINKING IN PIXELS",
    "ROOM TO CREATE",
    "LET ME MAKE IT MY WAY",
    "THINGS I NEVER SAID",
    "WHAT I COULDN’T SAY, I MADE",
    "SOMEWHERE BETWEEN ART AND CODE",
    "STILL FINDING MY OWN FORM",
    "THIS IS WHERE THE QUIET GOES",
    "SANDITH WAS HERE",
    "MY MIND"
];
const THOUGHT_WORD_COUNT = 128 * 80;
const singleWords = thoughtWords.filter((word)=>!word.includes(" "));
// Shared event timing lets the face film catch the same light as the atmosphere.
const atmosphericEvents = `
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float meteor(vec2 p,float lane){
        float period=6.7+lane*2.3;
        float clock=uTime+lane*3.1;
        float cycle=floor(clock/period);
        float age=mod(clock,period);
        float seed=hash(vec2(cycle,lane+17.));
        vec2 direction=normalize(vec2(-.52,-1.));
        vec2 start=vec2((seed-.5)*uAspect*1.3+.24,.72);
        vec2 head=start+direction*age*.78;
        vec2 relative=p-head;
        float along=dot(relative,-direction);
        float across=abs(relative.x*direction.y-relative.y*direction.x);
        float tail=exp(-across*across/0.0000025)*exp(-max(along,0.)*15.)
          *smoothstep(-.009,.012,along)*(1.-smoothstep(.18,.32,along));
        float core=exp(-dot(relative,relative)/0.000016);
        return (tail*.18+core*.32)*smoothstep(0.,.16,age)*(1.-smoothstep(1.6,2.,age));
      }
      float pulse(vec2 p){
        float cycle=floor(uTime/9.4);
        float age=mod(uTime,9.4)-2.8;
        float envelope=smoothstep(0.,.07,age)*(1.-smoothstep(.11,.62,age));
        float side=mod(cycle,2.)<1.?1.:-1.;
        vec2 q=p-vec2(side*uAspect*.34,.2+sin(cycle*2.3)*.13);
        float curve=q.x*.24+sin(q.x*59.+cycle)*.011+sin(q.x*137.)*.004;
        float distance=abs(q.y-curve);
        float extent=1.-smoothstep(.08,.23,abs(q.x));
        float filament=exp(-distance*distance/0.000003)*.06;
        float halo=exp(-distance*distance/.00065)*.009;
        return (filament+halo)*extent*envelope;
      }
`;
function wordTexture(size) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, size, size);
    context.textBaseline = "middle";
    const cellWidth = size / 80;
    const cellHeight = size / 128;
    // Keep the dense 10,240-word layer; phrases get wider spaces in the accent layer.
    for(let row = 0; row < 128; row++){
        for(let column = 0; column < 80; column++){
            const word = singleWords[(row * 7 + column * 3 + (row % 4 === 0 ? 0 : column)) % singleWords.length];
            context.font = `400 ${cellHeight * (.58 + (row + column) % 4 * .06)}px "IBM Plex Mono", monospace`;
            context.fillStyle = `rgb(${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130})`;
            context.fillText(word, column * cellWidth + cellWidth * .06, (row + .5) * cellHeight + Math.sin(column * 4 + row) * cellHeight * .08, cellWidth * .89);
        }
    }
    // Every entry appears here. Separate cells keep long phrases intact and prevent overlaps.
    for(let index = 0; index < 80; index++){
        const word = thoughtWords[index % thoughtWords.length];
        const fontSize = size * (word.includes(" ") ? .01 : .012);
        context.font = `400 ${fontSize}px "IBM Plex Mono", monospace`;
        const width = Math.min(context.measureText(word).width, size * .184);
        const column = index % 5;
        const row = Math.floor(index / 5);
        const spareWidth = size * .184 - width;
        const x = size * (column * .2 + .008) + spareWidth * (index * 7 % 11 / 10);
        const y = size * ((row + .3 + index * 3 % 7 * .06) / 16);
        context.fillStyle = "#080909";
        context.fillRect(x - size * .002, y - size * .007, width + size * .004, size * .014);
        context.fillStyle = "#eeeeee";
        context.fillText(word, x, y, width);
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
    renderer.setClearColor(0x141417);
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
    const atmosphereMotion = {
        value: 1
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
            uPointer: filmPointer,
            uAspect: {
                value: .8
            },
            uMotion: atmosphereMotion
        },
        transparent: true,
        depthWrite: false,
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
        vertexShader: `uniform float uTime;uniform vec2 uPointer;varying vec2 vUv;
      void main(){vUv=uv;vec3 p=position;float envelope=max(0.,1.-length((uv-.5)*2.));
      p.z+=sin(uv.x*7.+uv.y*5.+uTime*.6)*.012*envelope;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
        fragmentShader: `uniform float uTime;uniform float uProgress;uniform float uAspect,uMotion;uniform vec2 uPointer;varying vec2 vUv;
      ${atmosphericEvents}
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);if(r>1.)discard;
        float drift=sin(uTime*.23)*.35+uPointer.x*.3;
        float curve=p.x*.72+p.y*.42+sin(p.y*2.6+uTime*.35)*.12;
        float broad=exp(-pow((curve-drift-.22)*5.,2.));
        float streak=exp(-pow((curve-drift-.25)*31.,2.));
        float secondary=exp(-pow((p.x*.8-p.y*.5+drift+.58)*14.,2.));
        float edge=pow(smoothstep(.83,1.,r),2.);
        float fade=1.-smoothstep(.72,.94,uProgress);
        // Bend travelling reflections around the laminate instead of drawing a flat overlay.
        vec2 reflectionUv=p*.5;
        reflectionUv+=vec2(p.y*p.y*.055,p.x*p.x*.12)+uPointer*.025;
        float reflectedMeteor=meteor(reflectionUv,0.)+meteor(reflectionUv,1.);
        float reflectedPulse=pulse(reflectionUv);
        float reflection=(reflectedMeteor*.7+reflectedPulse*2.4)*uMotion
          *(1.-smoothstep(.82,1.,r));
        float alpha=(.008+broad*.025+streak*.045+secondary*.015+edge*.025+reflection)*fade;
        vec3 tint=mix(vec3(.38,.47,.5),vec3(.82,.89,.9),streak);
        tint=mix(tint,vec3(.73,.84,.9),smoothstep(.005,.1,reflection));
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
    const hazeAspect = {
        value: 1
    };
    const haze = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](2, 2), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
        depthWrite: false,
        depthTest: false,
        uniforms: {
            uProgress: progressUniform,
            uTime: time,
            uAspect: hazeAspect,
            uMotion: atmosphereMotion
        },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
        fragmentShader: `
      varying vec2 vUv;uniform float uProgress,uTime,uAspect,uMotion;
      ${atmosphericEvents}
      vec3 starField(vec2 p){
        vec3 light=vec3(0.);
        // A loose diagonal concentration gives depth without adding grain or cloudy texture.
        float band=exp(-pow((p.y-p.x*.3-.12)*4.,2.));
        for(int layer=0;layer<3;layer++){
          float depth=float(layer);
          float scale=95.-depth*32.;
          vec2 drift=vec2(uProgress*.022,uTime*.00022*uMotion)*(1.+depth*.6);
          vec2 grid=(p+drift)*scale+depth*37.;
          vec2 cell=floor(grid);
          float seed=hash(cell+depth*11.);
          float threshold=mix(.986,.952,band)+depth*.009;
          vec2 point=fract(grid)-(.15+.7*vec2(hash(cell+7.),hash(cell+19.)));
          float pixel=max(fwidth(grid.x),fwidth(grid.y));
          float radius=max(mix(.025,.062,hash(cell+31.)),pixel*.65);
          float core=1.-smoothstep(0.,radius,length(point));
          float twinkle=.8+.2*sin(uTime*(.45+seed*.5)*uMotion+seed*63.);
          float glow=exp(-dot(point,point)*90.)*.035*step(.995,seed);
          vec3 tint=mix(vec3(.56,.65,.76),vec3(.91,.88,.8),hash(cell+43.));
          light+=tint*(core+glow)*step(threshold,seed)*twinkle*(.18+depth*.13);
        }
        // A few brighter pinpoints balance Scorpius without crowding the left-hand copy.
        vec2 accents[5];
        accents[0]=vec2(.075,.71);
        accents[1]=vec2(.245,.82);
        accents[2]=vec2(.135,.32);
        accents[3]=vec2(.055,.19);
        accents[4]=vec2(.275,.41);
        for(int i=0;i<5;i++){
          vec2 position=(accents[i]-.5)*vec2(uAspect,1.);
          position.y+=uProgress*.012;
          float d=length(p-position);
          float radius=max(.0008,fwidth(p.y)*1.15);
          float core=1.-smoothstep(0.,radius,d);
          float halo=exp(-d*d/.000012)*.035;
          float twinkle=.86+.14*sin(uTime*.6*uMotion+float(i)*1.9);
          light+=vec3(.57,.65,.73)*(core+halo)*twinkle;
        }
        return light;
      }
      vec3 scorpius(vec2 p){
        // Stylized positions from the ESO / IAU Scorpius chart, north upwards.
        // https://eso.org/public/images/eso1726d/
        float small=1.-smoothstep(.65,.95,uAspect);
        float size=mix(.25,.105,small);
        vec2 center=vec2(uAspect*mix(.34,.31,small),mix(.24,.37,small));
        center.y+=uProgress*.016;
        vec2 q=(p-center)/size+.5;
        q.y=1.-q.y;
        if(q.x<-.2||q.x>1.2||q.y<-.2||q.y>1.2)return vec3(0.);
        vec2 stars[16];
        stars[0]=vec2(.952,0.);     // Acrab
        stars[1]=vec2(.994,.124);   // Dschubba
        stars[2]=vec2(.994,.274);   // Pi Scorpii
        stars[3]=vec2(.78,.236);    // Alniyat
        stars[4]=vec2(.702,.268);   // Antares
        stars[5]=vec2(.638,.342);
        stars[6]=vec2(.506,.6);
        stars[7]=vec2(.492,.758);
        stars[8]=vec2(.478,.95);
        stars[9]=vec2(.334,.984);
        stars[10]=vec2(.132,.992);
        stars[11]=vec2(.034,.88);
        stars[12]=vec2(.07,.83);
        stars[13]=vec2(.132,.74);   // Shaula
        stars[14]=vec2(.158,.744);  // Lesath
        stars[15]=vec2(0.,.754);
        vec3 light=vec3(0.);
        for(int i=0;i<16;i++){
          if(i==4)continue;
          float d=length(q-stars[i]);
          float radius=max(.005,fwidth(q.x)*1.05);
          float core=1.-smoothstep(0.,radius,d);
          float shimmer=.88+.12*sin(uTime*.55*uMotion+float(i)*2.7);
          light+=vec3(.46,.54,.62)*(core+exp(-d*d/.00016)*.045)*shimmer;
        }
        float d=length(q-stars[4]);
        float core=1.-smoothstep(0.,max(.01,fwidth(q.x)*1.7),d);
        float halo=exp(-d*d/.0011)*.15+exp(-d*d/.005)*.014;
        float shimmer=.93+.07*sin(uTime*.48*uMotion);
        light+=(vec3(1.,.69,.4)*core+vec3(.9,.27,.09)*halo)*shimmer;
        return light;
      }
      void main(){
        vec2 p=(vUv-.5)*vec2(uAspect,1.);
        float inward=smoothstep(0.,.72,uProgress);
        float radius=mix(.72,.18,inward);
        // Two desaturated light fields converge behind the head as the visitor approaches.
        vec2 drift=vec2(sin(uTime*.12)*.015,cos(uTime*.09)*.012);
        vec2 left=p-vec2(-.48*(1.-inward),.07+inward*.1)-drift;
        vec2 right=p-vec2(.5*(1.-inward),-.12+inward*.22)+drift;
        float glow=exp(-dot(left,left)/(radius*radius))*.65
          +exp(-dot(right,right)/(radius*radius*.72))*.5;
        float distance=length(p*vec2(.8,1.));
        float wave=sin(distance*8.+inward*5.+p.y*2.+uTime*.06)*.5+.5;
        float current=wave*glow*sin(inward*3.14159)*.65;
        vec3 color=vec3(.006,.006,.007);
        color+=vec3(.014,.013,.016)*glow;
        color+=vec3(.015,.013,.018)*current;
        color+=starField(p);
        color+=scorpius(p);
        float events=meteor(p,0.)+meteor(p,1.)+meteor(p,2.);
        color+=vec3(.7,.82,.9)*(events+pulse(p))*uMotion;
        color*=1.-smoothstep(.32,.85,uProgress)*.94;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
    }));
    haze.frustumCulled = false;
    haze.renderOrder = -10;
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
        atmosphereMotion.value = reduced.matches ? 0 : 1;
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
        galaxy.aspect.value = hazeAspect.value = camera.aspect;
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