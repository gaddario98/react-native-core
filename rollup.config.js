import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// Plugin to remove 'use client' and 'use server' directives
const removeDirectives = () => ({
  name: 'remove-directives',
  transform(code, id) {
    if (id.includes('node_modules')) {
      const newCode = code.replace(/['"]use (client|server)['"];?\s*/g, '');
      if (newCode !== code) {
        return { code: newCode, map: null };
      }
    }
    return null;
  }
});

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
const extraExternal = ["react", "react/jsx-runtime", "react-native"];

const dependencyNames = [
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const isPackageExternal = (id) => {
  // External: peer dependencies
  if (dependencyNames.some(
    (depName) => id === depName || id.startsWith(`${depName}/`)
  )) {
    return true;
  }
  
  // External: react-native specific modules
  if (id.startsWith('react-native/') || 
      id.startsWith('@react-native/') || 
   //   id.startsWith('expo/') || 
      id.startsWith('expo-')) {
    return true;
  }
  
  // External: react internals
  if (id.startsWith('react/') || id === 'react') {
    return true;
  }
  
  // External: internal @gaddario98 packages (sono dependencies)
  if (id.startsWith('@gaddario98/')) {
    return true;
  }
  
  return false;
};

const isExtraExternal = (id) =>
  extraExternal.some(
    (depName) => id === depName || id.startsWith(`${depName}/`)
  );

const extensions = [".mjs", ".js", ".json", ".ts", ".tsx"];

// Produce one config per entry (tree-shaking friendly, small output bundles)
/** @type {import('rollup').RollupOptions[]} */
const config = entries.map(({ name, input }) => {
  return {
    input,
    output: [
      // ESM build
      {
        file: name === "index" ? `dist/index.mjs` : `dist/${name}/index.mjs`,
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
      // CommonJS build
      {
        file: name === "index" ? `dist/index.js` : `dist/${name}/index.js`,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    external: (id) => isPackageExternal(id) || isExtraExternal(id),
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      removeDirectives(),
      peerDepsExternal(), // auto-mark peer deps as external
      resolve({ 
        extensions, 
        preferBuiltins: false,
        browser: false, // React Native non è browser
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        // Faster builds for libraries; declarations handled in separate dts config
        noForceEmit: true,
      }),
      json(),
      babel({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        plugins: ["babel-plugin-react-compiler"],
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
    ],
    onwarn(warning, warn) {
      // Reduce noise for common benign warnings; forward others.
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
  };
});

export default config;
