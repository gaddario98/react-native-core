import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { Href } from "expo-router";

export interface Screen {
  name: string;
  requireAuth?: boolean;
  hideIfAuth?: boolean;
  ns?: string;
  userType?: string;
  redirectTo?: Href | "tab";
  header?: (props: NativeStackHeaderProps) => React.ReactNode;
  options?: NativeStackNavigationOptions;
}
export interface LayoutGeneratorProps {
  screens: Screen[];
  userType?: string;
  initialRouteName?: string;
}
export interface LayoutGeneratorConfig {
  header?: (props: NativeStackHeaderProps) => React.ReactNode;
}
