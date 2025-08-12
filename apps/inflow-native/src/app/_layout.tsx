import { SessionProvider } from "inflow/ctx";
import "../global.css";
import { Slot } from "expo-router";
import { SplashScreenController } from "inflow/splash";

export default function Layout() {
    return (
        <SessionProvider>
            <SplashScreenController />
            <Slot />
        </SessionProvider>
    );
}
