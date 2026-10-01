/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const previousLoader = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { createAdaptiveQuality, qualityScale } = require('../lib/adaptive-quality.ts');
const { renderPixelRatio } = require('../lib/render-budget.ts');
require.extensions['.ts'] = previousLoader;

function simulate(compact = false) {
  const controller = createAdaptiveQuality(compact);
  let time = 1;
  controller.sample(time);
  return {
    controller,
    run(interval, duration) {
      const changes = [];
      const end = time + duration;
      while (time < end) {
        time += interval;
        const changed = controller.sample(time);
        if (changed) changes.push(changed);
      }
      return changes;
    },
    pause() { time += 30_000; controller.reset(time); },
  };
}

test('capable desktops recover original full quality and retain it', () => {
  const sim = simulate();
  assert.equal(sim.controller.quality, 'balanced');
  assert.deepEqual(sim.run(1000 / 60, 15_000), ['high']);
  assert.equal(qualityScale.high, 1);
});
test('sustained slow rendering steps down, with significant pixel savings', () => {
  const sim = simulate();
  assert.deepEqual(sim.run(40, 12_000), ['low']);
  assert(qualityScale.low ** 2 < .5);
});
test('a short hitch or tab suspension does not lower quality', () => {
  const sim = simulate();
  sim.run(1000 / 60, 9000);
  sim.run(120, 480);
  sim.pause();
  assert.deepEqual(sim.run(1000 / 60, 8000), []);
  assert.equal(sim.controller.quality, 'high');
});
test('intentional 30fps on mobile is healthy, while sustained 15fps steps down', () => {
  const sim = simulate(true);
  assert.deepEqual(sim.run(1000 / 30, 12_000), []);
  assert.deepEqual(sim.run(1000 / 15, 12_000), ['balanced', 'low']);
});
test('recovery is slower than decline and repeated upgrades are bounded', () => {
  const sim = simulate();
  sim.run(40, 12_000);
  assert.deepEqual(sim.run(1000 / 60, 3000), []);
  sim.run(1000 / 60, 20_000);
  assert.equal(sim.controller.quality, 'high');
  sim.run(40, 15_000);
  assert.deepEqual(sim.run(1000 / 60, 30_000), []);
  assert.equal(sim.controller.quality, 'low');
});

test('resolution preserves high quality and bounds pixel work on large screens', () => {
  const previousWindow = global.window;
  global.window = { devicePixelRatio: 2 };
  try {
    assert.equal(renderPixelRatio(1920, 1080, false, 'high'), 1.5);
    const low = renderPixelRatio(3840, 2160, false, 'low');
    assert(3840 * 2160 * low ** 2 <= 2_000_001);
    const mobile = renderPixelRatio(390, 844, true, 'high');
    assert.equal(mobile, 1);
  } finally { global.window = previousWindow; }
});
