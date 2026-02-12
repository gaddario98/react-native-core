import { ViewSettings } from "@gaddario98/react-core/pages";
import { memo } from "react";
import { View, ViewStyle } from "react-native";

const DEFAULT_PADDING = 16;

const Element = ({
  style,
  children,
}: {
  style?: ViewStyle;
  children: React.JSX.Element[];
} & (ViewSettings["header"] | ViewSettings["footer"])) => {
  if (!children?.length) return null;

  return (
    <View style={[{ paddingHorizontal: DEFAULT_PADDING }, { height: "auto" }, style]}>{children}</View>
  );
};

export default memo(Element);
