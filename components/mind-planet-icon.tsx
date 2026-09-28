"use client";

import { useEffect, useRef } from "react";
import styles from "./mind-world.module.css";

export function MindPlanetIcon({ world }: { world: "about" | "work" }) {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    Promise.all([
      import("three"),
      import("@/lib/personal-worlds"),
      import("@/lib/thought-texture"),
      import("@/lib/digital-globe"),
      document.fonts.ready,
    ]).then(([THREE, { createPersonalWorld }, { wordTexture }, { createDigitalGlobe }]) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(42, 32);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.85, 1.85, 1.41, -1.41, .1, 20);
      camera.position.z = 5;
      const thoughts = world === "about" ? wordTexture(1024, true) : null;
      const digital = world === "work" ? createDigitalGlobe() : null;
      const personal = thoughts ? createPersonalWorld(1, thoughts) : null;
      const planet = (digital ?? personal)!;
      if (digital) { digital.root.scale.setScalar(1.15); digital.resize(32, renderer.getPixelRatio()); }
      scene.add(planet.root);
      scene.add(new THREE.AmbientLight(0xa7bbd0, .6));
      const light = new THREE.DirectionalLight(0xffedda, 3.5);
      light.position.set(-12, 9, 14);
      scene.add(light);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let frame = 0, last = 0, elapsed = 0;
      const render = () => {
        planet.root.rotation.y = elapsed * .13;
        digital?.update(1, elapsed);
        personal?.update(elapsed, 1);
        renderer.render(scene, camera);
        element.dataset.ready = "true";
      };
      const draw = (now: number) => {
        if (last) elapsed += Math.min((now - last) / 1000, .05);
        last = now;
        render();
        frame = requestAnimationFrame(draw);
      };
      const sync = () => {
        cancelAnimationFrame(frame); last = 0;
        if (!document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
        else if (!document.hidden) render();
      };
      document.addEventListener("visibilitychange", sync);
      reduced.addEventListener("change", sync);
      render(); sync();
      cleanup = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", sync);
        reduced.removeEventListener("change", sync);
        planet.dispose(); thoughts?.dispose(); renderer.dispose(); renderer.domElement.remove();
        delete element.dataset.ready;
      };
    }).catch(() => { /* Retain the quiet planet silhouette when WebGL is unavailable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, [world]);

  return <span ref={host} className={styles.planetIcon} data-world={world} data-planet-icon aria-hidden="true" />;
}
