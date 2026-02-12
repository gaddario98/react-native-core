import { Stack } from "expo-router";
import { ComponentProps, useCallback, useMemo } from "react";
import "react-native-reanimated";
import { LayoutGeneratorProps, Screen } from "./types";
import { useAuthValue } from "@gaddario98/react-core/auth";
import { layoutGeneratorConfig } from "./config";
import { usePageConfigValue } from "../pages";

const LayoutGenerator = ({
  screens,
  userType,
  initialRouteName,
}: LayoutGeneratorProps) => {
  const user = useAuthValue();
  const { isLogged } = usePageConfigValue();

  const isAuthenticated = useMemo(() => isLogged(user), [isLogged, user]);

  const isRedirect = useCallback(
    (screen: Screen) => {
      let val = false;
      if (!screen) return false;
      if (screen.requireAuth) val = !isAuthenticated;
      if (screen.hideIfAuth) val = isAuthenticated;
      if (screen.userType && userType !== screen.userType) val = true;
      return val;
    },
    [isAuthenticated, userType],
  );

  const screenOptions = useMemo(
    (): ComponentProps<typeof Stack>["screenOptions"] => ({
      headerShown: false,
      keyboardHandlingEnabled: true,
    }),
    [],
  );

  return (
    <Stack screenOptions={screenOptions} initialRouteName={initialRouteName}>
      {screens.map((screen) => {
        return (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            options={{
              headerShown: Boolean(
                screen.header || layoutGeneratorConfig?.header,
              ),
              header: screen.header || layoutGeneratorConfig?.header,
              ...(screen?.options ?? {}),
            }}
            redirect={isRedirect(screen)}
          />
        );
      })}
    </Stack>
  );
};

export default LayoutGenerator;
