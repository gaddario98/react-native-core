import { setReactNativeStorage } from "../state";
import { setEndpoints } from "../queries";
import { PageConfigProps, setReactNativePageConfig } from "../pages";
import {
  initializeI18n,
  setI18nInitializer,
  setTranslationAdapter,
} from "../localization";
import { AppLinks, setAppLinks } from "../utiles";
import { KeyboardAvoidingView, Platform } from "react-native";
import { setDefaultFormFieldContainer } from "../form";

export interface SetReactNativeConfigProps {
  pages: Partial<PageConfigProps>;
  endpoints: Record<string, string>;
  links: Partial<AppLinks>;
  localization?: {
    i18nInitializer: Parameters<typeof setI18nInitializer>[0];
    translationAdapter: Parameters<typeof setTranslationAdapter>[0];
    localResources?: Record<string, object>;
  };
}

export const setReactNativeConfig = ({
  pages,
  endpoints,
  localization,
  links,
}: SetReactNativeConfigProps) => {
  if (localization?.i18nInitializer) {
    setI18nInitializer(localization.i18nInitializer);
  }
  if (localization?.translationAdapter) {
    setTranslationAdapter(localization.translationAdapter);
  }
  if (localization?.localResources) {
    initializeI18n(localization.localResources);
  }
  setReactNativeStorage();
  setReactNativePageConfig(pages);
  setEndpoints(endpoints);
  setAppLinks(links);
  setDefaultFormFieldContainer(({ children }) => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    );
  });
};
