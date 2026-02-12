import { HrefObject } from "expo-router";
import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";
import React, { useMemo, memo } from "react";
import { Platform, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setActiveTabName } from "./useActiveTab";
import AnimatedTabButton from "./AnimatedTabButton";

export interface TabItemConfig {
  name: string;
  tabBarIcon?: (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialParams?: Record<string, any>;
  href?: string | HrefObject;
  badge?: number | string;
  badgeColor?: string;
  badgeTextColor?: string;
  accessibilityLabel?: string;
}

export type TabBarVariant = "auto" | "top" | "bottom";

type BarShadow = {
  color?: string;
  opacity?: number;
  radius?: number;
  offset?: { height: number; width: number };
  elevation?: number;
};
type BarBorder = { width?: number; color?: string; topOnly?: boolean };

const DEFAULT_COLORS = {
  surface: "#1e1e1e",
  onPrimary: "#ffffff",
  onSurfaceVariant: "#999999",
  outline: "#444444",
  shadow: "#000000",
  primary: "#6200ee",
  secondary: "#03dac6",
  onSecondary: "#000000",
};

export interface TabLayoutProps {
  tabs: Array<TabItemConfig>;
  ns?: string;
  initialRouteName?: string;
  translateTitles?: boolean;
  onTabChange?: (prev: string | undefined, next: string) => void;
  bar?: {
    height?: number;
    position?: "absolute" | "relative";
    margin?: { bottom?: number; horizontal?: number };
    padding?: { top?: number; bottom?: number; horizontal?: number };
    rounded?: boolean | number;
    radius?:
      | number
      | {
          topLeft?: number;
          topRight?: number;
          bottomLeft?: number;
          bottomRight?: number;
        };
    colors?: {
      background?: string;
      activeTint?: string;
      inactiveTint?: string;
      border?: string;
      shadow?: string;
      surface?: string;
      secondary?: string;
      onSecondary?: string;
    };
    shadow?: boolean | BarShadow;
    border?: boolean | BarBorder;
    glass?: boolean | { alpha?: number };
    compact?: boolean;
    useSafeAreaInset?: boolean;
    style?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    glowItemStyle?: StyleProp<ViewStyle>;
  };
}

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || typeof hex !== "string") return hex;
  const cleaned = hex.replace("#", "");
  if (cleaned.length === 8) return hex;
  if (cleaned.length !== 6) return hex;
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  ns = "tabs",
  initialRouteName,
  translateTitles = true,
  onTabChange,
  bar,
}) => {
  const insets = useSafeAreaInsets();

  const cfg = useMemo(() => {
    const barDefaults = {
      height: 64,
      position: "absolute" as const,
      margin: { bottom: 12, horizontal: 16 },
      padding: { top: 8, bottom: 0, horizontal: 20 },
      rounded: true as boolean | number,
      radius: undefined as TabLayoutProps["bar"] extends { radius: infer R }
        ? R
        : undefined,
      colors: {
        background: bar?.colors?.background ?? DEFAULT_COLORS.surface,
        activeTint: bar?.colors?.activeTint ?? DEFAULT_COLORS.onPrimary,
        inactiveTint: bar?.colors?.inactiveTint ?? DEFAULT_COLORS.onSurfaceVariant,
        border: bar?.colors?.border ?? (DEFAULT_COLORS.outline + "30"),
        shadow: bar?.colors?.shadow ?? DEFAULT_COLORS.shadow,
        surface: bar?.colors?.surface ?? DEFAULT_COLORS.surface,
        secondary: bar?.colors?.secondary ?? DEFAULT_COLORS.secondary,
        onSecondary: bar?.colors?.onSecondary ?? DEFAULT_COLORS.onSecondary,
      },
      shadow: true as boolean | object,
      border: true as boolean | object,
      glass: false as boolean | object,
      compact: false,
      useSafeAreaInset: true,
      style: undefined as StyleProp<ViewStyle>,
      itemStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      } as StyleProp<ViewStyle>,
      glowItemStyle: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 22,
        backgroundColor: bar?.colors?.activeTint ?? DEFAULT_COLORS.onPrimary,
      } as StyleProp<ViewStyle>,
      labelStyle: undefined as StyleProp<TextStyle>,
    };

    const config = { ...barDefaults, ...(bar || {}) };
    config.margin = { ...barDefaults.margin, ...(bar?.margin || {}) };
    config.padding = { ...barDefaults.padding, ...(bar?.padding || {}) };
    config.colors = { ...barDefaults.colors, ...(bar?.colors || {}) };
    config.itemStyle = [barDefaults.itemStyle, bar?.itemStyle ?? {}];
    config.glowItemStyle = [
      barDefaults.glowItemStyle,
      bar?.glowItemStyle ?? {},
    ];

    if (config.compact) {
      config.height = Math.max(52, (config.height || 64) - 12);
      config.padding = { ...config.padding, top: 4, bottom: 12 };
    }

    return config;
  }, [bar]);

  const getBorderRadiusStyle = useMemo(() => {
    if (cfg.radius) {
      if (typeof cfg.radius === "number") return { borderRadius: cfg.radius };
      return {
        borderTopLeftRadius: cfg.radius.topLeft,
        borderTopRightRadius: cfg.radius.topRight,
        borderBottomLeftRadius: cfg.radius.bottomLeft,
        borderBottomRightRadius: cfg.radius.bottomRight,
      };
    }
    if (typeof cfg.rounded === "number") return { borderRadius: cfg.rounded };
    if (cfg.rounded) return { borderRadius: 18 };
    return {};
  }, [cfg.radius, cfg.rounded]);

  const getShadowStyle = useMemo(() => {
    if (!cfg.shadow) return {};
    const shadowConfig: BarShadow =
      (typeof cfg.shadow === "boolean" ? {} : cfg.shadow) || {};
    return Platform.select({
      ios: {
        shadowColor: shadowConfig.color || cfg.colors.shadow,
        shadowOpacity: shadowConfig.opacity ?? 0.18,
        shadowRadius: shadowConfig.radius ?? 16,
        shadowOffset: shadowConfig.offset ?? { height: 6, width: 0 },
      },
      android: {
        elevation: shadowConfig.elevation ?? 12,
      },
    });
  }, [cfg.shadow, cfg.colors.shadow]);

  const getBorderStyle = useMemo(() => {
    if (!cfg.border) return {};
    const borderConfig: BarBorder =
      (typeof cfg.border === "boolean" ? {} : cfg.border) || {};
    const base = {
      borderWidth: borderConfig.width ?? 0.5,
      borderColor: borderConfig.color || cfg.colors.border,
    };
    if (borderConfig.topOnly) {
      return {
        borderTopWidth: base.borderWidth,
        borderTopColor: base.borderColor,
      };
    }
    return base;
  }, [cfg.border, cfg.colors.border]);

  const safeAreaExtra = useMemo(
    () => (cfg.useSafeAreaInset ? insets.bottom : 0),
    [cfg.useSafeAreaInset, insets.bottom]
  );
  const height = useMemo(
    () => cfg.height + (cfg.padding.bottom || 0) + (cfg.padding.top || 0),
    [cfg.height, cfg.padding.bottom, cfg.padding.top]
  );

  const tabBarStyle: StyleProp<ViewStyle> = useMemo(() => {
    let additionalStyles: ViewStyle = {};

    if (cfg.glass) {
      const alpha =
        typeof cfg.glass === "object" && "alpha" in cfg.glass
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? ((cfg.glass as any).alpha ?? 0.7)
          : 0.7;

      additionalStyles = {
        ...Platform.select({
          web: {
            backdropFilter: "blur(20px)",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          ios: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          android: {
            backgroundColor: hexToRgba(cfg.colors.surface ?? DEFAULT_COLORS.surface, alpha + 0.1),
          },
        }),
      };
    }

    return [
      {
        backgroundColor: cfg.colors.background,
        borderTopWidth: 0,
        height,
        paddingBottom: cfg.padding.bottom || 0,
        paddingTop: cfg.padding.top,
        paddingHorizontal: cfg.padding.horizontal,
        position: cfg.position,
        left: 0,
        right: 0,
        bottom:
          (cfg.position === "absolute" ? (cfg.margin.bottom ?? 0) : 0) +
          safeAreaExtra,
        marginHorizontal: cfg.margin.horizontal,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        overflow: "hidden",
        ...getBorderRadiusStyle,
        ...(cfg.glass ? additionalStyles : getShadowStyle),
        ...getBorderStyle,
      },
      cfg.style,
    ];
  }, [
    cfg,
    getBorderRadiusStyle,
    getShadowStyle,
    getBorderStyle,
    safeAreaExtra,
    height,
  ]);

  React.useEffect(() => {
    if (initialRouteName) {
      setActiveTabName(initialRouteName);
    }
  }, [initialRouteName]);

  const tabItems = useMemo(
    () =>
      tabs.map((tab) => (
        <TabTrigger
          key={tab.name}
          name={tab.name}
          href={tab.href || `/${tab.name}`}
          asChild
          accessibilityLabel={
            tab.accessibilityLabel ||
            (tab.title ? (translateTitles ? tab.title : tab.title) : undefined)
          }
          style={{ flex: 1 }}
        >
          <AnimatedTabButton
            tab={tab}
            cfg={cfg}
            translateTitles={translateTitles}
            ns={ns}
            key={tab.name}
            onTabChange={onTabChange}
          />
        </TabTrigger>
      )),
    [tabs, cfg, translateTitles, ns, onTabChange]
  );
  return (
    <Tabs>
      <TabSlot />
      <TabList style={tabBarStyle}>{tabItems}</TabList>
    </Tabs>
  );
};

export default memo(TabLayout);
