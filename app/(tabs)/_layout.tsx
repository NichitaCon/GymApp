import { Link, Redirect, Tabs } from "expo-router";

import { HeaderButton } from "../../components/HeaderButton";
import { TabBarIcon } from "../../components/TabBarIcon";

import { useAuth } from "~/contexts/AuthProvider";
import { StatusBar, Text } from "react-native";

export default function TabLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/welcome" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "black",
                headerShown: false, // Hides the header for all screens
            }}
        >
            <StatusBar style="dark" />
            {/* <Text className="p-10">test</Text> */}

            <Tabs.Screen
                name="index"
                options={{
                    title: "Tab One",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <HeaderButton />
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="search" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="user" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
