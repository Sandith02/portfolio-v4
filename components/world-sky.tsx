"use client";

import { useEffect, useRef } from "react";
import { isMobileRendering, mobilePixelRatio, preferLightweightLoading } from "@/lib/render-budget";
import styles from "./mind-world.module.css";

export function WorldSky() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const element = host.current;
    if (!element || preferLightweightLoading()) return;
    const compact = isMobileRendering();
    Promise.all([import("three"), import("@/lib/galaxy-field")]).then(([THREE, { GALAXY_FIELD_GLSL }]) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(compact ? mobilePixelRatio(element.clientWidth, element.clientHeight) : Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uAspect: { value: 1 } },
        depthTest: false, depthWrite: false,
        vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
        fragmentShader: `varying vec2 vUv; uniform float uTime,uAspect;
          ${GALAXY_FIELD_GLSL}
          void main(){
            vec2 p=(vUv-.5)*vec2(uAspect,1.);
            gl_FragColor=vec4(galaxyField(p,0.,0.,0.)*1.15,1.);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      });
      scene.add(new THREE.Mesh(geometry, material));
      const render = () => renderer.render(scene, camera);
      // The shader uses a constant time: this image only changes on resize.
      const resize = () => {
        if (compact) renderer.setPixelRatio(mobilePixelRatio(element.clientWidth, element.clientHeight));
        renderer.setSize(element.clientWidth, element.clientHeight);
        material.uniforms.uAspect.value = element.clientWidth / Math.max(1, element.clientHeight);
        render();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      renderer.domElement.addEventListener("webglcontextrestored", render);
      resize();
      cleanup = () => {
        observer.disconnect();
        renderer.domElement.removeEventListener("webglcontextrestored", render);
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      };
    }).catch(() => { /* Keep the charcoal atmospheric fallback if WebGL is unavailable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <div ref={host} className={styles.sky} aria-hidden="true" />;
}
