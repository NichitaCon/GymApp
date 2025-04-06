import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import AuthProvider from "~/contexts/AuthProvider";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

export default function RootLayout() {
    return (
        <AuthProvider>
                  <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    tabBarActiveTintColor: "black",
                    headerShown: false, // Hides the header for all screens
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                />
            </Stack>
        </AuthProvider>
    );
}
