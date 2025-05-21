import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import RestTimer from "~/components/RestTimer";
import Header from "~/components/Header";

import AuthProvider from "~/contexts/AuthProvider";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

export default function RootLayout() {
    return (
        <AuthProvider>
            {/* <Header header="My Header" back={() => console.log("Back button pressed")} /> */}
            {/* <RestTimer></RestTimer> */}
            <StatusBar style="dark" />
            {/* <Text className="p-10 bg-white">HELOOOOOOOOOOOOOOOO</Text> */}
            <Stack
                screenOptions={{
                    header: ({ options }) => (
                        <Header header={options.title} back={true} />
                    ),
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
