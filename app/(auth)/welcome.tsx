import { Link, Stack, useFocusEffect } from "expo-router";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Pressable } from "react-native";

import { ScreenContent } from "~/components/ScreenContent";
import TemplateListItem from "~/components/TemplateListItem";
import { supabase } from "~/utils/supabase";

export default function Home() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {}, []);

    // console.log(templates);
    return (
        <View className="flex-1 bg-white p-5 flex-col items-center justify-between">
            <View>
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

            <View className="flex-row gap-1 mb-safe-offset-1">
                <Link href={`/(auth)/signUp`} asChild>
                    <Pressable className="p-4 flex-1 bg-blue-400 rounded-md items-center">
                        <Text className="font-bold text-white text-lg">
                            Create an account
                        </Text>
                    </Pressable>
                </Link>
                <Link href={`/(auth)/login`} asChild>
                    <Pressable
                        className="p-4 flex-1 bg-blue-400 rounded-md items-center"
                    >
                        <Text className="font-bold text-white text-lg">
                            Login
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
