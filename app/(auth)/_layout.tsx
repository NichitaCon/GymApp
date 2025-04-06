import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/contexts/AuthProvider";

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <Stack
            screenOptions={{
                tabBarActiveTintColor: "black",
                headerShown: false, // Hides the header for all screens
            }}
        />
        
    );
}
