import { LayoutGeneratorConfig } from "./types";

let layoutGeneratorConfig: LayoutGeneratorConfig;

const setLayoutGeneratorConfig = (config: LayoutGeneratorConfig) => {
  layoutGeneratorConfig = config;
};

export { layoutGeneratorConfig, setLayoutGeneratorConfig };
