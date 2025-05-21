import { Link, Redirect, Tabs } from "expo-router";
import Header from "~/components/Header";
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
                header: ({ options }) => <Header header={options.title} back={false} />,
            }}
        >
            {/* <StatusBar style="dark" /> */}
            {/* <Text className="p-10">test</Text> */}

            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                    header: () => (
                        <Header header="Home" back={false} />
                        // Add extra buttons/components here if you want
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
