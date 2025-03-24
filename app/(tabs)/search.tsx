import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

import { ScreenContent } from "~/components/ScreenContent";
import TemplateListItem from "~/components/TemplateListItem";
import { supabase } from "~/utils/supabase";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        const { data, error } = await supabase
            .from("templates")
            .select(`*,profiles:profiles (id, full_name, role)`);
        if (error) {
            console.error(
                "Error reading Templates table with creator name: ",
                error,
            );
            return;
        } else if (!data || data.length === 0) {
            console.warn("Templates returned empty.");
        } else {
            setTemplates(data);
        }
        console.log("data, ", data, error);
    };

    console.log(templates);
    return (
        <View className="flex-1 bg-white p-5">
            <Stack.Screen options={{ title: "Search" }} />

            {/* <ScreenContent path="app/(tabs)/two.tsx" title="Search" /> */}
            {/* 
            <FlatList
                data={templates}
                renderItem={({ item }) => (
                    <View className="p-2 border-2 border-gray-50 rounded-xl bg-gray-100">
                        <Text className="text-4xl font-normal">
                            Endurance Routine
                        </Text>
                    </View>
                )}
            /> */}

            <FlatList
                className="bg-white p-1"
                data={templates}
                renderItem={({ item }) => <TemplateListItem template={item} />}
            />
        </View>
    );
}
