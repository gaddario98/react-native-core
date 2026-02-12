import { PageConfigProps } from "@gaddario98/react-core/pages";
import Element from "./components/Element";
import { ActivityIndicator, Text, View } from "react-native";
import { DefaultView } from "./components/layout";
import React from "react";

const DEFAULT_PADDING = 16;

export const setReactNativePageConfig = (config: Partial<PageConfigProps>) => {
  setPageConfig({
    FooterContainer: ({ children, withoutPadding, ...props }) => (
      <Element
        {...props}
        withoutPadding={withoutPadding}
        style={{
          paddingHorizontal: withoutPadding ? 0 : DEFAULT_PADDING,
          paddingBottom: withoutPadding ? 0 : DEFAULT_PADDING,
        }}
      >
        {children ?? []}
      </Element>
    ),
    HeaderContainer: ({ children, withoutPadding, ...props }) => (
      <Element
        {...props}
        withoutPadding={withoutPadding}
        style={{
          paddingHorizontal: withoutPadding ? 0 : DEFAULT_PADDING,
          paddingTop: withoutPadding ? 0 : DEFAULT_PADDING,
        }}
      >
        {children ?? []}
      </Element>
    ),
    ItemsContainer: ({ children }) => (
      <View
        style={{
          paddingHorizontal: DEFAULT_PADDING,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {children}
      </View>
    ),
    BodyContainer: ({ children, ...props }) => (
      <DefaultView {...props}>{children ?? []}</DefaultView>
    ),
    LoaderComponent: ({ loading, message }) =>
      loading && (
        <View
          style={{
            position: "relative",
            top: 0,
            marginHorizontal: DEFAULT_PADDING,
            marginTop: DEFAULT_PADDING,
            zIndex: 1000,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            padding: DEFAULT_PADDING,
            backgroundColor: "#e3f2fd",
            borderRadius: 8,
          }}
        >
          <ActivityIndicator size="small" style={{ marginRight: 8 }} />
          <Text>{message ?? "Caricamento in corso..."}</Text>
        </View>
      ),
    PageContainer: ({ children, id }) => (
      <View style={{ flex: 1 }} id={id} key={id}>
        {children as React.JSX.Element}
      </View>
    ),
    ...config,
  });
};
