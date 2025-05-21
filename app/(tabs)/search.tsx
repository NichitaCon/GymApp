import { Stack, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, TextInput } from "react-native";
import Header from "~/components/Header";

import { ScreenContent } from "~/components/ScreenContent";
import TemplateListItem from "~/components/TemplateListItem";
import { supabase } from "~/utils/supabase";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTemplates();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTemplates();
            console.log("usefocus effect called in id.tsx!");
        }, []),
    );

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
        // console.log(
        //     "templates data: ",
        //     JSON.stringify(data),
        //     "error: ",
        //     JSON.stringify(error),
        // );
    };

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // console.log(templates);
    return (
        <View className="flex-1 bg-white p-5">
            <Stack.Screen options={{ title: "Search" }} />
            {/* <Header header={"Search"} back={false}/> */}
            <TextInput
                className="bg-gray-100 rounded-xl mb-5 p-4 border-2 border-gray-300"
                placeholder="Search"
                placeholderTextColor={"black"}
                onChangeText={(text) => {
                    setSearchQuery(text);
                }}
                value={searchQuery}
            />
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
                data={filteredTemplates}
                renderItem={({ item }) => <TemplateListItem template={item} />}
            />
        </View>
    );
}
