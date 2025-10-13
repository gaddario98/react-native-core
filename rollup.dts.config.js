import dts from "rollup-plugin-dts";

const entries = [
  { name: "index", input: "index.ts" },
  { name: "auth", input: "auth/index.ts" },
  { name: "config", input: "config/index.tsx" },
  { name: "expo", input: "expo/index.ts" },
  { name: "form", input: "form/index.ts" },
  { name: "layouts", input: "layouts/index.ts" },
  { name: "localization", input: "localization/index.ts" },
  { name: "pages", input: "pages/index.ts" },
  { name: "providers", input: "providers/index.ts" },
  { name: "queries", input: "queries/index.ts" },
  { name: "state", input: "state/index.ts" },
  { name: "tabs", input: "tabs/index.ts" },
  { name: "utiles", input: "utiles/index.ts" },
];

export default entries.map(({ name, input }) => ({
  input,
  output: {
    file: name === "index" ? `dist/index.d.ts` : `dist/${name}/index.d.ts`,
    format: "es",
  },
  plugins: [dts()],
}));
