import { useMemo, useState, useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { withMemo } from "@gaddario98/react-core/utiles";
import { QueriesArray } from "@gaddario98/react-core/queries";
import { FieldValues } from "@gaddario98/react-core/form";
import { DefaultContainerProps } from "@gaddario98/react-core/pages";

const DEFAULT_PADDING = 16;

const DefaultView = withMemo(
  <F extends FieldValues, Q extends QueriesArray, V extends Record<string, unknown>>({
    viewSettings,
    handleRefresh,
    children,
  }: DefaultContainerProps<F, Q, V>) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleQueryRefresh = useCallback(async () => {
      if (!viewSettings?.disableRefreshing && handleRefresh) {
        setRefreshing(true);
        try {
          await handleRefresh();
        } finally {
          setRefreshing(false);
        }
      }
    }, [handleRefresh, viewSettings?.disableRefreshing]);

    const refreshControl = useMemo(
      () =>
        !viewSettings?.disableRefreshing ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleQueryRefresh}
          />
        ) : undefined,
      [handleQueryRefresh, refreshing, viewSettings?.disableRefreshing],
    );

    return (
      <ScrollView
        contentContainerStyle={{ flex: 1, padding: DEFAULT_PADDING }}
        refreshControl={refreshControl}
        id="default-view"
      >
        {children}
      </ScrollView>
    );
  },
);
export default DefaultView;
