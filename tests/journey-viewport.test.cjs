/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const loader = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { journeyViewportHeight } = require('../lib/journey-viewport.ts');
require.extensions['.ts'] = loader;

function withViewport(mobile, run) {
  const previousWindow = global.window, previousStyle = global.getComputedStyle;
  global.window = { innerHeight: 844, matchMedia: () => ({ matches: mobile }) };
  global.getComputedStyle = () => ({ getPropertyValue: name => name === '--journey-screens' ? '31' : '1' });
  const stage = { clientHeight: 700 };
  const hero = { clientHeight: 21700, dataset: {}, querySelector: () => stage };
  try { run(hero, stage); }
  finally { global.window = previousWindow; global.getComputedStyle = previousStyle; }
}

test('mobile toolbar resizing changes the rendered height, not the journey position', () => {
  withViewport(true, (hero, stage) => {
    const scrollY = 5320;
    const before = scrollY / journeyViewportHeight(hero);
    stage.clientHeight = 844;
    assert.equal(scrollY / journeyViewportHeight(hero), before);
    assert.equal(journeyViewportHeight(hero) * 7.6, scrollY);
  });
});
test('rotating the phone remeasures the stable scroll track', () => {
  withViewport(true, (hero, stage) => {
    stage.clientHeight = 390; hero.clientHeight = 31 * 320;
    assert.equal(journeyViewportHeight(hero), 320);
  });
});
test('desktop keeps its actual stage height', () => {
  withViewport(false, (hero, stage) => {
    stage.clientHeight = 640;
    assert.equal(journeyViewportHeight(hero), 640);
  });
});
test('loading, fallback and reduced-motion pages use their visible height', () => {
  withViewport(true, (hero, stage) => {
    stage.clientHeight = 844;
    hero.dataset.renderLoading = 'true';
    assert.equal(journeyViewportHeight(hero), 844);
    delete hero.dataset.renderLoading; hero.dataset.fallback = 'true';
    assert.equal(journeyViewportHeight(hero), 844);
    delete hero.dataset.fallback; hero.clientHeight = 844;
    assert.equal(journeyViewportHeight(hero), 844);
  });
});

test('shorter mobile track preserves every destination and the complete ending', () => {
  withViewport(true, (hero, stage) => {
    global.getComputedStyle = () => ({ getPropertyValue: name => name === '--journey-screens' ? '31' : '.55' });
    hero.clientHeight = 700 * 17.5;
    const unit = journeyViewportHeight(hero);
    assert.equal(unit, 700 * .55);
    assert(Math.abs((hero.clientHeight - stage.clientHeight) / unit - 30) < 1e-10);
    for (const progress of [3.3, 7.6, 13.1, 19.35, 24.35, 28.5]) {
      const destination = progress * unit;
      assert(Math.abs(destination / unit - progress) < 1e-10);
      assert(destination < hero.clientHeight - stage.clientHeight);
    }
    stage.clientHeight = 844;
    assert.equal(journeyViewportHeight(hero), unit);
    assert((hero.clientHeight - stage.clientHeight) / unit > 28.5);
  });
});
