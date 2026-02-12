import { useMemo, useState, useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { withMemo } from "@gaddario98/react-core/utiles";
import { QueriesArray } from "@gaddario98/react-core/queries";
import {
  FieldValues,
  FormManagerConfig,
  Submit,
} from "@gaddario98/react-core/form";
import { ContentItem, ViewSettings } from "@gaddario98/react-core/pages";

const DEFAULT_PADDING = 16;

export interface CustomScrollViewProps<
  F extends FieldValues,
  Q extends QueriesArray,
> {
  viewSettings?: ViewSettings;
  allContents: (ContentItem<F, Q> | FormManagerConfig<F> | Submit<F>)[];
  children: React.JSX.Element[];
  handleRefresh?: () => Promise<void>;
  hasQueries: boolean;
}

const DefaultView = withMemo(
  <F extends FieldValues, Q extends QueriesArray>({
    viewSettings,
    handleRefresh,
    hasQueries,
    children,
  }: CustomScrollViewProps<F, Q>) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleQueryRefresh = useCallback(async () => {
      if (!viewSettings?.disableRefreshing && handleRefresh) {
        setRefreshing(true);
        try {
          handleRefresh();
        } finally {
          setRefreshing(false);
        }
      }
    }, [handleRefresh, viewSettings?.disableRefreshing]);

    const refreshControl = useMemo(
      () =>
        hasQueries && !viewSettings?.disableRefreshing ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleQueryRefresh}
          />
        ) : undefined,
      [
        handleQueryRefresh,
        hasQueries,
        refreshing,
        viewSettings?.disableRefreshing,
      ],
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
