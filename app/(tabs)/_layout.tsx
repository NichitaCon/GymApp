import { Link, Redirect, Tabs } from "expo-router";

import { HeaderButton } from "../../components/HeaderButton";
import { TabBarIcon } from "../../components/TabBarIcon";

export default function TabLayout() {
    return <Redirect href="/(auth)/login"/>

    // return (
    //     <Tabs
    //         screenOptions={{
    //             tabBarActiveTintColor: "black",
    //         }}
    //     >
    //         <Tabs.Screen
    //             name="index"
    //             options={{
    //                 title: "Tab One",
    //                 tabBarIcon: ({ color }) => (
    //                     <TabBarIcon name="home" color={color} />
    //                 ),
    //                 headerRight: () => (
    //                     <Link href="/modal" asChild>
    //                         <HeaderButton />
    //                     </Link>
    //                 ),
    //             }}
    //         />
    //         <Tabs.Screen
    //             name="search"
    //             options={{
    //                 title: "Search",
    //                 tabBarIcon: ({ color }) => (
    //                     <TabBarIcon name="search" color={color} />
    //                 ),
    //             }}
    //         />
    //         <Tabs.Screen
    //             name="profile"
    //             options={{
    //                 title: "Profile",
    //                 tabBarIcon: ({ color }) => (
    //                     <TabBarIcon name="user" color={color} />
    //                 ),
    //             }}
    //         />
    //     </Tabs>
    // );
}
