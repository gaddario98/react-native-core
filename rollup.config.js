import { createRequire } from "module";
import { createMultiEntryConfig } from "../../rollup.common.config.js";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Definizione degli entry points
const entries = [
  { name: "index", input: "index.ts" },
  { name: "auth", input: "auth/index.ts" },
  { name: "config", input: "config/index.tsx" },
  { name: "expo", input: "expo/index.ts" },
  { name: "form", input: "form/index.ts" },
  { name: "layouts", input: "layouts/index.ts" },
  { name: "localization", input: "localization/index.ts" },
  { name: "pages", input: "pages/index.ts" },
  { name: "queries", input: "queries/index.ts" },
  { name: "state", input: "state/index.ts" },
  { name: "tabs", input: "tabs/index.ts" },
  { name: "utiles", input: "utiles/index.ts" },
];

// Mappa: path assoluto di ogni entry -> nome entry
const entryAbsPaths = new Map(
  entries.map((e) => [path.resolve(__dirname, e.input), e.name]),
);

// Subdirectory che sono sub-package (con proprio entry point)
const subPackageDirs = entries
  .filter((e) => e.name !== "index")
  .map((e) => e.name);

// Plugin per risolvere import relativi cross-entry come external
const resolveToEntryPaths = (currentAbsPath) => ({
  name: "resolve-to-entry-paths",
  resolveId(source, importer) {
    // Import relativi che puntano a directory sub-package
    if (importer && source.startsWith(".")) {
      const importerDir = path.dirname(importer);
      const resolved = path.resolve(importerDir, source);
      const relative = path.relative(__dirname, resolved);

      for (const dir of subPackageDirs) {
        if (relative === dir) {
          const absPath = path.resolve(__dirname, dir, "index.ts");
          if (absPath === currentAbsPath) return null;
          return { id: absPath, external: true };
        }
      }
    }

    return null;
  },
});

// Calcola il path relativo di output tra due entry
function getOutputRelativePath(fromEntry, toEntry, format) {
  const ext = format === "esm" ? ".mjs" : ".js";
  const fromDir =
    fromEntry.name === "index" ? "dist" : `dist/${fromEntry.name}`;
  const toFile =
    toEntry.name === "index"
      ? `dist/index${ext}`
      : `dist/${toEntry.name}/index${ext}`;
  let rel = path.relative(fromDir, toFile);
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

const configs = createMultiEntryConfig(pkg, entries, {
  isReactNative: true,
});

// Post-process: ogni entry tratta gli ALTRI entry come external
export default configs.map((config, index) => {
  const currentEntry = entries[index];
  const currentAbsPath = path.resolve(__dirname, currentEntry.input);
  const originalExternal = config.external;

  // Paths mapping per gli output
  const esmPaths = {};
  const cjsPaths = {};
  entries.forEach((entry) => {
    const absPath = path.resolve(__dirname, entry.input);
    if (absPath !== currentAbsPath) {
      esmPaths[absPath] = getOutputRelativePath(currentEntry, entry, "esm");
      cjsPaths[absPath] = getOutputRelativePath(currentEntry, entry, "cjs");
    }
  });

  return {
    ...config,
    output: config.output.map((out) => ({
      ...out,
      paths: out.format === "esm" ? esmPaths : cjsPaths,
    })),
    plugins: [resolveToEntryPaths(currentAbsPath), ...config.plugins],
    external: (id, parentId, isResolved) => {
      // Se l'id è un altro entry point (già risolto), marcalo come external
      if (entryAbsPaths.has(id) && id !== currentAbsPath) {
        return true;
      }
      return originalExternal(id, parentId, isResolved);
    },
  };
});
