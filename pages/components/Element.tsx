import { FieldValues } from "@gaddario98/react-core/form";
import {
  DefaultContainerProps,
  ViewSettings,
} from "@gaddario98/react-core/pages";
import { QueriesArray } from "@gaddario98/react-core/queries";
import { View } from "react-native";

const DEFAULT_PADDING = 16;

const Element = <
  F extends FieldValues = FieldValues,
  Q extends QueriesArray = QueriesArray,
  V extends Record<string, unknown> = Record<string, unknown>,
>({
  children,
  withoutPadding,
}: Omit<DefaultContainerProps<F, Q, V>, "viewSettings"> &
  ViewSettings["header"]) => {
  if (!children?.length) return <></>;

  return (
    <View
      style={[
        { paddingHorizontal: withoutPadding ? 0 : DEFAULT_PADDING },
        { height: "auto" },
      ]}
    >
      {children}
    </View>
  );
};

export default Element;
