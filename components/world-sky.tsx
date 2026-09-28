"use client";

import { useEffect, useRef } from "react";
import styles from "./mind-world.module.css";

export function WorldSky() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const element = host.current;
    if (!element) return;
    Promise.all([import("three"), import("@/lib/galaxy-field")]).then(([THREE, { GALAXY_FIELD_GLSL }]) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
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
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let frame = 0, last = 0;
      const render = () => renderer.render(scene, camera);
      const draw = (now: number) => {
        if (last) material.uniforms.uTime.value += Math.min((now - last) / 1000, .05);
        last = now;
        render();
        frame = requestAnimationFrame(draw);
      };
      const sync = () => {
        cancelAnimationFrame(frame); last = 0;
        if (!document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
        else if (!document.hidden) render();
      };
      const resize = () => {
        renderer.setSize(element.clientWidth, element.clientHeight);
        material.uniforms.uAspect.value = element.clientWidth / Math.max(1, element.clientHeight);
        render();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      document.addEventListener("visibilitychange", sync);
      reduced.addEventListener("change", sync);
      resize(); sync();
      cleanup = () => {
        cancelAnimationFrame(frame); observer.disconnect();
        document.removeEventListener("visibilitychange", sync);
        reduced.removeEventListener("change", sync);
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { /* Keep the charcoal atmospheric fallback if WebGL is unavailable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <div ref={host} className={styles.sky} aria-hidden="true" />;
}
