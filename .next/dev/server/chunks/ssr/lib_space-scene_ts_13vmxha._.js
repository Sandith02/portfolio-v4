module.exports = [
"[project]/lib/space-scene.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_three_build_three_core_1f-_0ke.js",
  "server/chunks/ssr/node_modules_three_build_three_module_1e1-6l6.js",
  "server/chunks/ssr/node_modules_three_examples_jsm_1qv4787._.js",
  "server/chunks/ssr/lib_space-scene_ts_1np2j2x._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/space-scene.ts [app-ssr] (ecmascript)");
    });
});
}),
];