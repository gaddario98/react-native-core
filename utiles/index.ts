import { Linking } from "react-native";

export const openLink = (url: string) => {
  Linking.openURL(url);
};

export * from "@gaddario98/react-core/utiles";
