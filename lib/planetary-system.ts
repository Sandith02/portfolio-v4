import * as THREE from "three";
import { createDigitalGlobe } from "./digital-globe";
import { isMobileRendering } from "./render-budget";
import { createPersonalWorld } from "./personal-worlds";
import { createInnerGalaxyLife } from "./inner-galaxy-life";
import { createGalaxyFinale, GALAXY_ARRIVAL_END } from "./galaxy-finale";
import { PLANET_DEPTHS, PLANET_JOURNEY_START, PLANET_TRAVEL_PER_SCREEN, PLANET_CAMERA_Z } from "./journey-stops";
import { WORLD_RETURN_DURATION_MS } from "./world-navigation";

// A second camera lives beyond the head. The five worlds occupy actual depth;
// scrolling translates the camera, rather than scaling a flat arrangement.
export function createPlanetarySystem(renderer: THREE.WebGLRenderer, hero: HTMLElement, thoughts: THREE.Texture) {
  const compact = isMobileRendering();
  const boundary = hero.querySelector<HTMLElement>(".mind-boundary");
  const footer = hero.querySelector<HTMLElement>(".galaxy-footer");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .02, 150);
  scene.add(new THREE.AmbientLight(0xa7bbd0, .13));
  const sun = new THREE.DirectionalLight(0xffedda, 3.5);
  sun.position.set(-12, 9, 14);
  scene.add(sun);
  const nav = hero.querySelector<HTMLElement>(".planet-navigation")!;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>(".planet-link"));
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  let width = 1, height = 1, mobile = false;
  let selected = -1, enteredAt = 0, hovered = -1, routeTimer = 0;
  let lastTime = 0, dragging = -1, downX = 0, downY = 0, lastX = 0, lastY = 0, moved = false;
  let suppressClickUntil = 0;
  const startCamera = new THREE.Vector3();
  const destination = new THREE.Vector3();
  const projected = new THREE.Vector3();

  const depths = PLANET_DEPTHS;
  let finaleStartedAt = -1;
  const airColors = [0xa7bec9, 0xc4c3c1, 0x628ca8, 0xc39770, 0xd7a46a];
  const planets = depths.map((depth, index) => {
    const group = new THREE.Group();
    const personal = index > 0 ? createPersonalWorld(index, thoughts) : undefined;
    const digital = index === 0 ? createDigitalGlobe() : undefined;
    const surface = personal?.material ?? digital!.material;
    const geometry = index === 0 ? new THREE.SphereGeometry(1, compact ? 48 : 128, compact ? 32 : 96) : null;
    if (geometry) geometries.push(geometry);
    surface.side = personal ? THREE.DoubleSide : THREE.FrontSide;
    const globe = personal?.root ?? digital!.root;
    group.add(globe);
    const air = new THREE.ShaderMaterial({
      uniforms: { tint: { value: new THREE.Color(airColors[index]) }, alpha: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 n,eye,worldN;
        void main(){vec4 v=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);
          worldN=normalize(mat3(modelMatrix)*normal);eye=normalize(-v.xyz);gl_Position=projectionMatrix*v;}`,
      fragmentShader: `varying vec3 n,eye,worldN;uniform vec3 tint;uniform float alpha;
        void main(){float edge=pow(1.-max(0.,dot(normalize(n),normalize(eye))),4.);
          float day=smoothstep(-.3,.7,dot(normalize(worldN),normalize(vec3(-12.,9.,14.))));
          gl_FragColor=vec4(tint,edge*day*.16*alpha);}`,
    });
    materials.push(air);
    if (geometry) {
      const atmosphere = new THREE.Mesh(geometry, air);
      atmosphere.scale.setScalar(1.016);
      globe.add(atmosphere);
    }
    scene.add(group);
    return { group, globe, surface, personal, digital, air, depth, radius: 1, turnX: 0, turnY: 0, velocity: 0 };
  });

  const random = (n: number) => THREE.MathUtils.seededRandom(n);

  // Stars at distinct depths provide genuine parallax during the inward journey.
  const starCount = 650;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions.set([(random(i * 3 + 100) - .5) * 100, (random(i * 7 + 201) - .5) * 68, 10 - random(i * 11 + 303) * 105], i * 3);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: { alpha: { value: 0 }, travel: { value: 0 }, pixelRatio: { value: renderer.getPixelRatio() } },
    transparent: true, depthWrite: false,
    vertexShader: `uniform float pixelRatio,travel;void main(){vec3 point=position;point.z=mod(point.z+travel-24.,110.)-110.+24.;vec4 p=modelViewMatrix*vec4(point,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(18./-p.z,.65,2.2)*pixelRatio;}`,
    fragmentShader: `uniform float alpha;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.67,.73,.8,(1.-smoothstep(.1,.5,d))*alpha);}`,
  });
  scene.add(new THREE.Points(starGeometry, starMaterial));
  geometries.push(starGeometry); materials.push(starMaterial);

  const life = createInnerGalaxyLife(scene);
  const finale = createGalaxyFinale(scene);

  function enter(index: number) {
    if (selected >= 0) return;
    selected = index; enteredAt = performance.now(); startCamera.copy(camera.position);
    hero.dataset.entering = "true";
    nav.setAttribute("aria-busy", "true");
    hero.querySelector<HTMLElement>(".planet-status")!.textContent = `Entering ${links[index].dataset.planet}…`;
    // Completion is independent of frame visibility, including a tab switch.
    routeTimer = window.setTimeout(() => {
      hero.dispatchEvent(new CustomEvent("planet-entered", { detail: links[index].getAttribute("href") }));
    }, 1900);
  }
  const onClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || hero.dataset.fallback === "true") return;
    if (nav.inert) return;
    event.preventDefault();
    enter(links.indexOf(event.currentTarget as HTMLAnchorElement));
  };
  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || selected >= 0 || nav.inert) return;
    dragging = links.indexOf(event.currentTarget as HTMLAnchorElement);
    downX = lastX = event.clientX; downY = lastY = event.clientY; moved = false;
    planets[dragging].velocity = 0;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent) => {
    if (dragging < 0) return;
    const dx = event.clientX - lastX, dy = event.clientY - lastY;
    moved ||= Math.hypot(event.clientX - downX, event.clientY - downY) > 6;
    if (moved) {
      const planet = planets[dragging];
      planet.turnY += dx * .009;
      planet.turnX = THREE.MathUtils.clamp(planet.turnX + dy * .006, -1.2, 1.2);
      planet.velocity = THREE.MathUtils.clamp(dx * .025, -2.5, 2.5);
      hero.dataset.rotating = "true";
    }
    lastX = event.clientX; lastY = event.clientY;
  };
  const onUp = (event: PointerEvent) => {
    if (dragging < 0) return;
    if (moved) suppressClickUntil = performance.now() + 350;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    dragging = -1;
    delete hero.dataset.rotating;
  };
  const onKey = (event: KeyboardEvent) => {
    const planet = planets[links.indexOf(event.currentTarget as HTMLAnchorElement)];
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") planet.turnY += event.key === "ArrowLeft" ? -.15 : .15;
      else planet.turnX += event.key === "ArrowUp" ? -.12 : .12;
    }
  };
  const onHover = (event: Event) => { hovered = links.indexOf(event.currentTarget as HTMLAnchorElement); };
  const onLeave = () => { hovered = -1; };
  links.forEach(link => {
    link.addEventListener("click", onClick);
    link.addEventListener("pointerdown", onDown);
    link.addEventListener("pointermove", onMove);
    link.addEventListener("pointerup", onUp);
    link.addEventListener("pointercancel", onUp);
    link.addEventListener("keydown", onKey);
    link.addEventListener("pointerenter", onHover);
    link.addEventListener("focus", onHover);
    link.addEventListener("pointerleave", onLeave);
    link.addEventListener("blur", onLeave);
  });

  function resize(w: number, h: number) {
    width = w; height = h; mobile = w < 768;
    life.resize(w);
    finale.resize(w,h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    // Every world sits beside the flight path, at a different longitudinal
    // distance. Its size on screen is purely perspective as we approach/pass.
    const layout = mobile
      ? [[-1.7,-.2,1.0], [2.0,1.55,1.9], [-2.0,-1.0,.95], [1.9,-.65,1.05], [-1.75,.65,1.3]]
      : [[-3.2,-.35,1.8], [4.4,2.8,3.4], [-4.7,-2.1,1.6], [4.0,-1.0,1.75], [-3.6,1.1,2.25]];
    planets.forEach((planet, i) => {
      const [x, y, radius] = layout[i];
      planet.radius = radius;
      planet.digital?.resize(h,renderer.getPixelRatio());
      planet.personal?.resize(h,renderer.getPixelRatio());
      planet.group.position.set(x, y, planet.depth);
      planet.group.scale.setScalar(radius);
    });
  }
  return {
    resize,
    setEnvironment(texture: THREE.Texture) { planets.forEach(planet=>{planet.personal?.setEnvironment(texture);planet.digital?.setEnvironment(texture);}); },
    draw(progress: number, time: number) {
      const reveal = selected >= 0 ? 1 : THREE.MathUtils.smoothstep(progress, 2.55, 3.3);
      const rewind = hero.dataset.rewindProgress;
      // The finale only plays on the outward journey. Returning uses the
      // regular galaxy sky, with no cloud rotation, beam or figure replay.
      if (rewind !== undefined || progress < 27.1 || selected >= 0) finaleStartedAt = -1;
      else if (finaleStartedAt < 0) finaleStartedAt = performance.now() / 1000;
      const finaleAge = finaleStartedAt < 0 ? -1 : performance.now() / 1000 - finaleStartedAt;
      hero.dataset.finaleAge = finaleAge.toFixed(3);
      const departing = THREE.MathUtils.smoothstep(progress, 25.8, 27.1);
      hero.style.setProperty("--galaxy-departure", departing.toFixed(3));
      hero.dataset.finale = finaleAge < 0 ? "false" : finaleAge < GALAXY_ARRIVAL_END ? "flight" : "arrived";
      const messageIn = THREE.MathUtils.smoothstep(finaleAge, .15, .95);
      const messageOut = THREE.MathUtils.smoothstep(finaleAge, 3.35, 4.1);
      const messageOpacity = messageIn * (1 - messageOut);
      hero.style.setProperty("--mind-message", messageOpacity.toFixed(3));
      hero.style.setProperty("--mind-message-offset", `${((1 - messageIn) * 12 - messageOut * 8).toFixed(2)}px`);
      hero.style.setProperty("--mind-message-blur", `${((1 - messageIn) * 8 + messageOut * 4).toFixed(2)}px`);
      boundary?.setAttribute("aria-hidden", messageOpacity < .02 ? "true" : "false");
      const footerReveal = THREE.MathUtils.smoothstep(finaleAge, GALAXY_ARRIVAL_END, GALAXY_ARRIVAL_END + 1.2);
      hero.style.setProperty("--galaxy-footer", footerReveal.toFixed(3));
      if (footer) {
        footer.inert = footerReveal < .9;
        footer.setAttribute("aria-hidden", footerReveal < .02 ? "true" : "false");
      }
      if (!compact || progress > 18) finale.prepare();
      finale.update(time, finaleAge, Math.max(0, progress - 3));
      // Ease into forward travel while the tunnel dissolves into the galaxy.
      const travel = Math.max(0, progress - PLANET_JOURNEY_START) * PLANET_TRAVEL_PER_SCREEN
        * THREE.MathUtils.smoothstep(progress, PLANET_JOURNEY_START, PLANET_JOURNEY_START + 1);
      const delta = Math.min(.05, Math.max(0, time - lastTime)); lastTime = time;
      hero.style.setProperty("--planet-reveal", reveal.toFixed(3));
      nav.inert = reveal < .9 || departing > .95;
      nav.setAttribute("aria-hidden", nav.inert ? "true" : "false");
      if (reveal <= 0) {
        hero.style.setProperty("--idea-shake-x", "0px");
        hero.style.setProperty("--idea-shake-y", "0px");
        hero.style.setProperty("--idea-shake-roll", "0deg");
        hero.style.setProperty("--idea-shake-scale", "1");
        return;
      }
      // Give the opening worlds breathing room, then rejoin the existing route
      // before About so later planet stops and return links keep their framing.
      const openingDistance = 5 * (1 - THREE.MathUtils.smoothstep(progress, 3.3, 7));
      camera.position.set(Math.sin(travel * .012) * .12, Math.sin(travel * .02) * .08, PLANET_CAMERA_Z + openingDistance);
      camera.rotation.z = Math.sin(travel * .01) * .004;
      if (selected < 0) {
        planets.forEach(planet => {
          const depth = planet.depth + travel;
          planet.group.position.z = depth;
        });
      }
      // On a page return, ease out from near that world into its familiar orbit.
      // The overlay starts this only once the first destination frame is ready.
      if (selected < 0 && hero.dataset.returnWorld && document.documentElement.dataset.worldReturning && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const returning = ["work", "about", "contact", "why", "threads"].indexOf(hero.dataset.returnWorld);
        const planet = planets[returning];
        if (planet) {
          const age = hero.dataset.returnArrival ? Math.min(1, (performance.now() - Number(hero.dataset.returnArrival)) / WORLD_RETURN_DURATION_MS) : 0;
          const remaining = Math.pow(1 - age, 3);
          const distance = camera.position.z - planet.group.position.z;
          camera.position.x += (planet.group.position.x * .35 - camera.position.x) * remaining;
          camera.position.y += (planet.group.position.y * .35 - camera.position.y) * remaining;
          camera.position.z -= Math.max(0, distance - Math.max(planet.radius * 4.4, distance * .62)) * remaining;
        }
      }
      const enterProgress = selected < 0 ? 0 : Math.min(1, (performance.now() - enteredAt) / 1900);
      if (selected >= 0) {
        const planet = planets[selected];
        destination.copy(planet.group.position); destination.z += planet.radius * .2;
        camera.rotation.z *= 1 - enterProgress;
        const flight = enterProgress * enterProgress * (3 - 2 * enterProgress);
        camera.position.copy(startCamera).lerp(destination, flight);
        hero.style.setProperty("--planet-entry", THREE.MathUtils.smoothstep(enterProgress, .74, .96).toFixed(3));
      }
      life.update(time, travel, reveal * (1 - THREE.MathUtils.smoothstep(enterProgress, .05, .7)) * (1 - departing));
      const impact = selected < 0 && finaleAge < 0 ? life.getImpact() : 0;
      hero.style.setProperty("--idea-shake-x", `${((Math.sin(time * 71) + Math.sin(time * 113) * .4) * impact * 13).toFixed(2)}px`);
      hero.style.setProperty("--idea-shake-y", `${((Math.cos(time * 83) + Math.sin(time * 127) * .3) * impact * 9).toFixed(2)}px`);
      hero.style.setProperty("--idea-shake-roll", `${(Math.sin(time * 59) * impact * .3).toFixed(3)}deg`);
      hero.style.setProperty("--idea-shake-scale", (1 + impact * .025).toFixed(4));
      if (finaleAge >= 0) { camera.position.set(0,0,PLANET_CAMERA_Z);camera.rotation.set(0,0,0); }
      camera.updateMatrixWorld();
      const candidates: { index: number; depth: number }[] = [];
      planets.forEach((planet, i) => {
        if (dragging !== i) {
          planet.turnY += delta * (.023 + planet.velocity);
          planet.velocity *= Math.exp(-delta * 2.6);
        }
        planet.group.visible = finaleAge < 0;
        planet.globe.rotation.set(planet.turnX, planet.turnY, 0);
        const depth = camera.position.z - planet.group.position.z;
        const visibility = 1 - THREE.MathUtils.smoothstep(depth, 82, 120);
        if (compact) planet.group.visible = finaleAge < 0 && depth > -planet.radius * 2 && visibility > .001;
        planet.surface.opacity = reveal * visibility;
        if (planet.group.visible) {
          planet.digital?.update(reveal * visibility, time);
          planet.personal?.update(time, reveal * visibility);
        }
        planet.air.uniforms.alpha.value = i === 3 ? 0 : reveal * visibility * (hovered === i ? 1.3 : 1) * (i === 1 ? .5 : 1);
        projected.copy(planet.group.position).project(camera);
        const radiusPx = planet.radius / (Math.max(.1, depth) * Math.tan(THREE.MathUtils.degToRad(19))) * height / 2;
        const link = links[i];
        const onScreen = depth > planet.radius * 1.4 && depth < 72 && Math.abs(projected.x) < .88 && Math.abs(projected.y) < .76 && radiusPx < height * .34;
        if (onScreen) candidates.push({ index: i, depth });
        link.style.visibility = onScreen ? "visible" : "hidden";
        link.inert = !onScreen;
        link.setAttribute("aria-hidden", onScreen ? "false" : "true");
        link.style.left = `${(projected.x * .5 + .5) * width}px`;
        link.style.top = `${(-projected.y * .5 + .5) * height}px`;
        link.style.width = `${Math.max(54, radiusPx * (i === 1 ? 3 : 2))}px`;
        link.style.height = `${radiusPx * (i === 1 ? 2.5 : 2)}px`;
        link.style.setProperty("--planet-label-top", `${radiusPx * (i === 1 ? 2.5 : 2) + 14}px`);
      });
      // Only the approaching world gets a caption. Distant destinations are
      // discoveries ahead, not a second row of navigation competing for attention.
      const focus = candidates.find(item => item.index === hovered)
        ?? candidates.filter(item => item.depth < 44).reduce<{ index: number; depth: number } | undefined>((nearest, item) => !nearest || item.depth < nearest.depth ? item : nearest, undefined);
      links.forEach((link, i) => { link.dataset.caption = focus?.index === i ? "true" : "false"; });
      starMaterial.uniforms.alpha.value = reveal * .42 * (1 - THREE.MathUtils.smoothstep(progress, 5, 21) * .94) * (1 - departing);
      starMaterial.uniforms.travel.value = travel;
      renderer.autoClear = false; renderer.clearDepth(); renderer.render(scene, camera); renderer.autoClear = true;
    },
    dispose() {
      window.clearTimeout(routeTimer);
      planets.forEach(planet=>{planet.personal?.dispose();planet.digital?.dispose();});
      life.dispose();
      finale.dispose();
      links.forEach(link => {
        link.removeEventListener("click", onClick);
        link.removeEventListener("pointerdown", onDown);
        link.removeEventListener("pointermove", onMove);
        link.removeEventListener("pointerup", onUp);
        link.removeEventListener("pointercancel", onUp);
        link.removeEventListener("keydown", onKey);
        link.removeEventListener("pointerenter", onHover);
        link.removeEventListener("focus", onHover);
        link.removeEventListener("pointerleave", onLeave);
        link.removeEventListener("blur", onLeave);
      });
      materials.forEach(material => material.dispose());
      geometries.forEach(geometry => geometry.dispose());
    },
  };
}
