export * from '@gaddario98/react-auth';
import { PageConfigProps } from '@gaddario98/react-native-pages';
export * from '@gaddario98/react-native-pages';
import { setI18nInitializer, setTranslationAdapter } from '@gaddario98/react-localization';
export * from '@gaddario98/react-localization';
import { AppLinks } from '@gaddario98/react-native-utiles';
export * from '@gaddario98/react-native-utiles';
export * from '@gaddario98/expo';
export * from '@gaddario98/react-form';
export * from '@gaddario98/react-native-layouts';
export * from '@gaddario98/react-native-providers';
export * from '@gaddario98/react-queries';
export * from '@gaddario98/react-native-state';
export * from '@gaddario98/react-native-tabs';

interface SetReactNativeConfigProps {
    pages: Partial<PageConfigProps>;
    endpoints: Record<string, string>;
    links: Partial<AppLinks>;
    localization?: {
        i18nInitializer: Parameters<typeof setI18nInitializer>[0];
        translationAdapter: Parameters<typeof setTranslationAdapter>[0];
        localResources?: Record<string, object>;
    };
}
declare const setReactNativeConfig: ({ pages, endpoints, localization, links, }: SetReactNativeConfigProps) => void;

export { setReactNativeConfig };
export type { SetReactNativeConfigProps };
