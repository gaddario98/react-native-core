import { PageConfigProps } from '@gaddario98/react-native-pages';
import { setI18nInitializer, setTranslationAdapter } from '@gaddario98/react-localization';
import { AppLinks } from '@gaddario98/react-native-utiles';

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
