module.exports = [
"[project]/lib/space-scene.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSpaceScene",
    ()=>createSpaceScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-ssr] (ecmascript)");
;
;
function disposeObject(object) {
    const textures = new Set();
    object.traverse((child)=>{
        if (!(child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"] || child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"])) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [
            child.material
        ];
        materials.forEach((material)=>{
            Object.values(material).forEach((value)=>{
                if (value instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Texture"]) textures.add(value);
            });
            material.dispose();
        });
    });
    textures.forEach((texture)=>texture.dispose());
}
async function createSpaceScene(host, hero, signal) {
    const response = await fetch("/models/astronaut-realistic.glb", {
        signal
    });
    if (!response.ok) throw new Error("Astronaut could not be loaded");
    const gltf = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GLTFLoader"]().parseAsync(await response.arrayBuffer(), "/models/");
    if (signal.aborted) {
        disposeObject(gltf.scene);
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
        disposeObject(gltf.scene);
        throw error;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.5));
    renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x030509);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Scene"]();
    const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PerspectiveCamera"](40, 1, .1, 260);
    camera.position.set(0, .15, 10);
    let galaxy;
    try {
        galaxy = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextureLoader"]().loadAsync("/images/deep-galaxy.webp");
    } catch (error) {
        disposeObject(gltf.scene);
        renderer.dispose();
        renderer.domElement.remove();
        throw error;
    }
    galaxy.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    if (signal.aborted) {
        galaxy.dispose();
        disposeObject(gltf.scene);
        renderer.dispose();
        renderer.domElement.remove();
        throw new DOMException("Aborted", "AbortError");
    }
    const sky = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](240, 135), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
        map: galaxy,
        depthWrite: false,
        toneMapped: false
    }));
    sky.position.z = -150;
    scene.add(sky);
    let seed = 8721;
    const random = ()=>{
        seed = seed * 16807 % 2147483647;
        return (seed - 1) / 2147483646;
    };
    const starPositions = new Float32Array(2400 * 3);
    const starColors = new Float32Array(2400 * 3);
    for(let index = 0; index < 2400; index++){
        starPositions[index * 3] = (random() - .5) * 170;
        starPositions[index * 3 + 1] = (random() - .5) * 105;
        starPositions[index * 3 + 2] = -10 - random() * 145;
        const brightness = .2 + Math.pow(random(), 3) * .7;
        starColors.set([
            brightness * .83,
            brightness * .9,
            brightness
        ], index * 3);
    }
    const starsGeometry = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    starsGeometry.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](starPositions, 3));
    starsGeometry.setAttribute("color", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](starColors, 3));
    const stars = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Points"](starsGeometry, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PointsMaterial"]({
        size: .048,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: .38,
        depthWrite: false
    }));
    scene.add(stars);
    const astronaut = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    const model = gltf.scene;
    const bounds = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Box3"]().setFromObject(model);
    const center = bounds.getCenter(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]());
    const height = bounds.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]()).y;
    model.position.sub(center);
    const normalized = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    normalized.add(model);
    normalized.scale.setScalar(3.45 / height);
    astronaut.add(normalized);
    scene.add(astronaut);
    model.traverse((child)=>{
        if (!(child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"])) return;
        const materials = Array.isArray(child.material) ? child.material : [
            child.material
        ];
        materials.forEach((material)=>{
            if (material instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]) {
                material.color.multiplyScalar(.68);
                material.roughness = .92;
                material.metalness = .08;
                material.normalScale.set(.3, .3);
                material.aoMapIntensity = .65;
            }
        });
    });
    scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmbientLight"](0x718099, .16));
    const key = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"](0xc2d5ef, 4.2);
    key.position.set(-6, 3, -4);
    scene.add(key);
    const rim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"](0x8da9cf, 4.2);
    rim.position.set(6, 3, -6);
    scene.add(rim);
    const fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DirectionalLight"](0x6b759b, .2);
    fill.position.set(2, -3, 5);
    scene.add(fill);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = false;
    let visible = true;
    let destroyed = false;
    let targetProgress = 0;
    let progress = 0;
    let elapsed = 0;
    let lastFrame = 0;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let cameraX = 0;
    let cameraY = 0;
    let mobile = window.innerWidth < 768;
    const measureScroll = ()=>{
        if (reduced.matches) {
            targetProgress = 0;
            return;
        }
        const distance = Math.max(1, hero.offsetHeight - host.clientHeight);
        targetProgress = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MathUtils"].clamp(-hero.getBoundingClientRect().top / distance, 0, 1);
    };
    const draw = ()=>{
        const p = reduced.matches ? 0 : progress;
        const descent = p * p * (3 - 2 * p);
        astronaut.position.set((mobile ? .45 : 2.15) * (1 - descent), (mobile ? .95 : .1) - descent * 4 + Math.sin(elapsed * .36) * .1, -descent * 64);
        astronaut.rotation.set(-.28 + descent * 1.15 + Math.sin(elapsed * .18) * .04, -.48 + descent * 2.6 + Math.sin(elapsed * .16) * .06, 1.12 - descent * 2.2 + Math.sin(elapsed * .24) * .045);
        normalized.scale.setScalar((mobile ? 2.75 : 3.45) / height);
        camera.position.set(cameraX, .15 + cameraY, 10 - descent * 3);
        camera.lookAt(0, .15, -descent * 8);
        stars.rotation.z = descent * .07;
        sky.rotation.z = descent * .035;
        hero.style.setProperty("--space-progress", p.toFixed(4));
        hero.style.setProperty("--space-intro-opacity", Math.max(0, 1 - p * 3.1).toFixed(3));
        hero.style.setProperty("--space-outro-opacity", Math.max(0, Math.min(1, (p - .52) * 3.5)).toFixed(3));
        hero.style.setProperty("--space-intro-y", `${-p * 70}px`);
        renderer.render(scene, camera);
    };
    const animate = (now)=>{
        if (destroyed) return;
        const delta = Math.min((now - (lastFrame || now)) / 1000, .05);
        lastFrame = now;
        elapsed += delta;
        const smoothing = 1 - Math.exp(-delta * 5);
        progress += (targetProgress - progress) * smoothing;
        cameraX += (pointerX * .17 - cameraX) * smoothing;
        cameraY += (pointerY * .1 - cameraY) * smoothing;
        draw();
        frame = requestAnimationFrame(animate);
    };
    const syncAnimation = ()=>{
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
        measureScroll();
        draw();
    };
    const pointerMove = (event)=>{
        if (event.pointerType !== "mouse" || paused || reduced.matches) return;
        pointerX = event.clientX / window.innerWidth - .5;
        pointerY = event.clientY / window.innerHeight - .5;
    };
    const pointerLeave = ()=>{
        pointerX = 0;
        pointerY = 0;
    };
    const preferenceChange = ()=>{
        measureScroll();
        if (reduced.matches) {
            progress = 0;
            cameraX = 0;
            cameraY = 0;
        }
        syncAnimation();
    };
    const observer = new IntersectionObserver((entries)=>{
        visible = entries[0].isIntersecting;
        syncAnimation();
    });
    observer.observe(hero);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    window.addEventListener("scroll", measureScroll, {
        passive: true
    });
    hero.addEventListener("pointermove", pointerMove);
    hero.addEventListener("pointerleave", pointerLeave);
    document.addEventListener("visibilitychange", syncAnimation);
    reduced.addEventListener("change", preferenceChange);
    const contextLost = (event)=>{
        event.preventDefault();
        paused = true;
        cancelAnimationFrame(frame);
        host.dataset.ready = "false";
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    resize();
    progress = targetProgress;
    draw();
    host.dataset.ready = "true";
    syncAnimation();
    return {
        setPaused (value) {
            paused = value;
            syncAnimation();
        },
        dispose () {
            destroyed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener("scroll", measureScroll);
            hero.removeEventListener("pointermove", pointerMove);
            hero.removeEventListener("pointerleave", pointerLeave);
            document.removeEventListener("visibilitychange", syncAnimation);
            reduced.removeEventListener("change", preferenceChange);
            renderer.domElement.removeEventListener("webglcontextlost", contextLost);
            disposeObject(scene);
            renderer.dispose();
            renderer.domElement.remove();
            host.dataset.ready = "false";
        }
    };
}
}),
];

//# sourceMappingURL=lib_space-scene_ts_1np2j2x._.js.map