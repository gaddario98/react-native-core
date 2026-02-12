import { useCoreConfig, type CoreConfig } from "@gaddario98/react-core";
import { useMemo } from "react";
import { useAuthValue } from "../auth";
import { useTranslation } from "../localization";
import { useNotification } from "../notifications";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { storage } from "../state";
import { DefaultView, Element } from "../pages";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: storage,
});
const DEFAULT_PADDING = 16;
export const useReactNativeCoreConfig = (props: Partial<CoreConfig>) => {
  const auth = useAuthValue();
  const { t: translateText } = useTranslation();
  const { showNotification } = useNotification();

  useCoreConfig({
    apiConfig: useMemo(
      () => ({
        validateAuthFn: () => true,
        showNotification,
        ...(props.apiConfig ?? {}),
        defaultHeaders: {
          Authorization: auth?.token ? `Bearer ${auth.token}` : "",
          ...(props.apiConfig?.defaultHeaders ?? {}),
        },
        persistOptions: {
          persister: asyncStoragePersister,
          maxAge: Infinity,
          buster: "persister-v1",
          ...(props.apiConfig?.persistOptions ?? {}),
        },
      }),
      [auth?.token, props.apiConfig, showNotification],
    ),
    localization: useMemo(() => props.localization, [props.localization]),
    pages: useMemo(
      () => ({
        ...(props.pages ?? {}),
        authValues: auth,
        FooterContainer: Element,
        HeaderContainer: Element,
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
        BodyContainer: DefaultView,
        PageContainer: ({ children, id }) => (
          <View style={{ flex: 1 }} id={id} key={id}>
            {children as React.JSX.Element}
          </View>
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
      }),
      [auth, props.pages],
    ),
    form: useMemo(
      () => ({
        translateText,
        showNotification,
        formFieldContainer: ({ children }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {children as React.JSX.Element}
          </KeyboardAvoidingView>
        ),
      }),
      [showNotification, translateText],
    ),
  });
};
