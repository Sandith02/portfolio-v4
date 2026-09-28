import * as THREE from "three";

// Sandith's chosen words and phrases, preserved verbatim.
export const thoughtWords = [
  "SANDITH", "SITHMAKA", "UNSAID", "UNREAD", "QUIET", "STILL", "WITHIN", "RESTLESS",
  "WATCHFUL", "UNFINISHED", "BECOMING", "WONDER", "IMAGINE", "FREEDOM", "EXPRESSION", "POSSIBILITY",
  "WHAT IF", "LOOK CLOSER", "MORE THAN I SHOW", "THINKING IN PIXELS", "ROOM TO CREATE",
  "LET ME MAKE IT MY WAY", "THINGS I NEVER SAID", "WHAT I COULDN’T SAY, I MADE",
  "SOMEWHERE BETWEEN ART AND CODE", "STILL FINDING MY OWN FORM",
  "THIS IS WHERE THE QUIET GOES", "SANDITH WAS HERE", "MY MIND"
];

export const THOUGHT_WORD_COUNT = 128 * 80;
const singleWords = thoughtWords.filter(word => !word.includes(" "));

export function wordTexture(size: number, uniformSize = false) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#000";
  context.fillRect(0, 0, size, size);
  context.textBaseline = "middle";
  const cellWidth = size / 80;
  const cellHeight = size / 128;
  if (uniformSize) {
    const fontSize = cellHeight * .66;
    context.font = `400 ${fontSize}px "IBM Plex Mono", monospace`;
    context.fillStyle = "#bfc4c4";
    let index = 0;
    for (let row = 0; row < 128; row++) {
      let x = 0;
      while (x < size) {
        const word = thoughtWords[index++ % thoughtWords.length];
        // Flow phrases at their natural width: no accent layer or shrinking
        // longer entries into fixed cells, so every glyph has the same size.
        context.fillText(word, x, (row + .5) * cellHeight);
        x += context.measureText(word).width + fontSize * 1.4;
      }
    }
  } else {
  // Keep the dense 10,240-word layer; phrases get wider spaces in the accent layer.
  for (let row = 0; row < 128; row++) {
    for (let column = 0; column < 80; column++) {
      const word = singleWords[(row * 7 + column * 3 + (row % 4 === 0 ? 0 : column)) % singleWords.length];
      context.font = `400 ${cellHeight * (.58 + ((row + column) % 4) * .06)}px "IBM Plex Mono", monospace`;
      context.fillStyle = `rgb(${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130},${120 + (row * 23 + column * 17) % 130})`;
      context.fillText(word, column * cellWidth + cellWidth * .06, (row + .5) * cellHeight + Math.sin(column * 4 + row) * cellHeight * .08, cellWidth * .89);
    }
  }
  // Every entry appears here. Separate cells keep long phrases intact and prevent overlaps.
  for (let index = 0; index < 80; index++) {
    const word = thoughtWords[index % thoughtWords.length];
    const fontSize = size * (word.includes(" ") ? .01 : .012);
    context.font = `400 ${fontSize}px "IBM Plex Mono", monospace`;
    const width = Math.min(context.measureText(word).width, size * .184);
    const column = index % 5;
    const row = Math.floor(index / 5);
    const spareWidth = size * .184 - width;
    const x = size * (column * .2 + .008) + spareWidth * ((index * 7 % 11) / 10);
    const y = size * ((row + .3 + (index * 3 % 7) * .06) / 16);
    context.fillStyle = "#080909";
    context.fillRect(x - size * .002, y - size * .007, width + size * .004, size * .014);
    context.fillStyle = "#eeeeee";
    context.fillText(word, x, y, width);
  }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

