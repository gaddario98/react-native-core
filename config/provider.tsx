import { CoreConfig } from "@gaddario98/react-core";
import { useReactNativeCoreConfig } from "./useReactNativeCoreConfig";
import { setReactNativeStorage } from "../state";

setReactNativeStorage();

export const ReactNativeCoreProvider = ({
  children,
  coreConfig,
}: {
  children: React.ReactNode;
  coreConfig?: Partial<CoreConfig>;
}) => {
  useReactNativeCoreConfig(coreConfig ?? {});
  return children;
};
