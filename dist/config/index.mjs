import { jsx } from 'react/jsx-runtime';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { setI18nInitializer, setTranslationAdapter, initializeI18n } from '@gaddario98/react-localization';
import { setReactNativeStorage } from '@gaddario98/react-native-state';
import { setReactNativePageConfig } from '@gaddario98/react-native-pages';
import { setEndpoints } from '@gaddario98/react-queries';
import { setAppLinks } from '@gaddario98/react-native-utiles';
import { setDefaultFormFieldContainer } from '@gaddario98/react-form';

const setReactNativeConfig = ({ pages, endpoints, localization, links, }) => {
    if (localization === null || localization === void 0 ? void 0 : localization.i18nInitializer) {
        setI18nInitializer(localization.i18nInitializer);
    }
    if (localization === null || localization === void 0 ? void 0 : localization.translationAdapter) {
        setTranslationAdapter(localization.translationAdapter);
    }
    if (localization === null || localization === void 0 ? void 0 : localization.localResources) {
        initializeI18n(localization.localResources);
    }
    setReactNativeStorage();
    setReactNativePageConfig(pages);
    setEndpoints(endpoints);
    setAppLinks(links);
    setDefaultFormFieldContainer(({ children }) => {
        return (jsx(KeyboardAvoidingView, { behavior: Platform.OS === "ios" ? "padding" : undefined, children: children }));
    });
};

export { setReactNativeConfig };
//# sourceMappingURL=index.mjs.map
