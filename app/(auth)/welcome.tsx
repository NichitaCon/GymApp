import { Link, Stack, useFocusEffect } from "expo-router";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Pressable } from "react-native";
import Header from "~/components/Header";

import { ScreenContent } from "~/components/ScreenContent";
import TemplateListItem from "~/components/TemplateListItem";
import { supabase } from "~/utils/supabase";

export default function Home() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {}, []);

    // console.log(templates);
    return (
        <View className="flex-1 bg-white p-5 flex-col items-center justify-between">
            <Stack.Screen options={{ title: "SteelSet" }} />

            <View className="">
                {/* <Text className="text-7xl mb-6 mt-12">SteelSet</Text> */}
                <Text className="text-4xl">Welcome to SteelSet!</Text>
                <Text className="text-xl mb-4">
                    your personal strength companion.
                </Text>
                <Text className="text-base">
                    SteelSet is a straightforward workout tracker built for
                    beginners. Log your sets, track your progress, and build
                    lasting gym habits — all in a clean, clutter-free interface
                    designed to keep you focused and motivated.
                </Text>
            </View>

            <View>
                <Text className="mb-1 text-gray-400">FYI: </Text>
                <Text className="mb-3 text-gray-400">
                    This app was developed on iPhone, so some visual styling may
                    appear slightly off on Android. That said, the app is fully
                    functional on both platforms. I had limited access to
                    Android devices for testing, so I appreciate your
                    understanding!
                </Text>
                <View className="flex-col gap-2 mb-safe-offset-1">
                    <Link href={`/(auth)/guestSignUp`} asChild>
                        <Pressable className="p-4 bg-blue-400 rounded-md items-center">
                            <Text className="font-bold text-white text-lg">
                                Get Started
                            </Text>
                        </Pressable>
                    </Link>
                    <Link href={`/(auth)/login`} asChild>
                        <Pressable className="p-4 border-2 bg-gray-200 border-gray-100 rounded-md items-center">
                            <Text className="font-bold text-gray-600 text-lg underline">
                                Log in
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </View>
    );
}
