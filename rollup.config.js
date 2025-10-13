import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

// Centralized list of entry points. Each becomes dist/<name>/index.mjs (except root index)
// Keep this list in sync with package.json exports and rollup.dts.config.js entries.

const entries = [
  { name: "pages", input: "pages/index.ts" },
  { name: "index", input: "index.ts" },
  { name: "auth", input: "auth/index.ts" },
  { name: "config", input: "config/index.tsx" },
  { name: "expo", input: "expo/index.ts" },
  { name: "form", input: "form/index.ts" },
  { name: "layouts", input: "layouts/index.ts" },
  { name: "localization", input: "localization/index.ts" },
  { name: "providers", input: "providers/index.ts" },
  { name: "queries", input: "queries/index.ts" },
  { name: "state", input: "state/index.ts" },
  { name: "tabs", input: "tabs/index.ts" },
  { name: "utiles", input: "utiles/index.ts" },
];

// Extra externals that might not be declared as peer deps but should not be bundled.
const extraExternal = [
  "react",
  "react/jsx-runtime",
  "react-native"
];

const extensions = [".mjs", ".js", ".json", ".ts", ".tsx"];

// Produce one config per entry (tree-shaking friendly, small output bundles)
/** @type {import('rollup').RollupOptions[]} */
const config = entries.map(({ name, input }) => {
  return {
    input,
    output: [
      {
  file: name === "index" ? `dist/index.mjs` : `dist/${name}/index.mjs`,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: extraExternal,
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      peerDepsExternal(), // auto-mark peer deps as external
      resolve({ extensions, preferBuiltins: false }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        // Faster builds for libraries; declarations handled in separate dts config
        noForceEmit: true,
      }),
      json(),
    ],
    onwarn(warning, warn) {
      // Reduce noise for common benign warnings; forward others.
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
  };
});

export default config;
