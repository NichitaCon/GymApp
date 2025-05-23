import { Redirect, Stack } from "expo-router";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthProvider";

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/" />;
    }

    return (
        <Stack
            screenOptions={{
                header: ({ options, route }) => (
                    <Header
                        header={options.title}
                        back={route.name !== "welcome"}
                    />
                ),
            }}
        />
    );
}
