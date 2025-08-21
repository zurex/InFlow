import 'inflow/common/polyfills';
import { SessionProvider, useSession } from "inflow/ctx";
import "../global.css";
import { Slot, Stack } from "expo-router";
import { SplashScreenController } from "inflow/splash";

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

export default function Layout() {
    return (
        <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
        </SessionProvider>
    );
}

function RootNavigator() {
    const { session } = useSession();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={session!=null}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>

            <Stack.Protected guard={!session}>
                <Stack.Screen name="sign-in" />
            </Stack.Protected>
        </Stack>
    );
}