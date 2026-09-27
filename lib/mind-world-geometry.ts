import * as THREE from "three";

// Familiar celestial silhouettes with restrained, original asymmetry.
// Surface detail carries the character; no knots, cutouts or floating fragments.
export function createMindWorldGeometry(index: number) {
  const geometry = new THREE.SphereGeometry(1, 96, 64);
  const positions = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    const { x, y, z } = v;
    if (index === 0) {
      const terrain = 1 + .012 * Math.sin(y * 6 + z * 3) + .008 * Math.cos(x * 7 - z * 5);
      v.set(x * terrain, y * terrain * .97, z * terrain);
    } else if (index === 1) {
      const terrain = 1 + .052 * Math.sin(y * 4 + x * 3) * Math.cos(z * 4);
      v.set(x * terrain * .94, y * terrain * 1.08, z * terrain * .90);
    } else if (index === 2) {
      const swell = 1 + .008 * Math.sin(y * 5 + z * 2);
      v.set(x * swell * 1.025, y * .94, z * swell);
    } else {
      const terrain = 1 + .032 * Math.sin(y * 5 + x * 2) + .018 * Math.cos(z * 6 - y);
      v.set(x * terrain * 1.015, y * terrain * .96, z * terrain);
    }
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
