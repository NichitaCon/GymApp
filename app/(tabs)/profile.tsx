import Entypo from "@expo/vector-icons/Entypo";
import {
    Link,
    Stack,
    useFocusEffect,
    useGlobalSearchParams,
    useLocalSearchParams,
} from "expo-router";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import Header from "~/components/Header";
import TemplateListItem from "~/components/TemplateListItem";
import { useAuth } from "~/contexts/AuthProvider";

import { supabase } from "~/utils/supabase";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [templates, setTemplates] = useState([]);
    const [role, setRole] = useState("");
    const { params } = useGlobalSearchParams();

    console.log("router push params in profile.tsx", params);

    const { session } = useAuth();

    useEffect(() => {
        fetchTemplates();
        if (session) getProfile();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTemplates();
            if (session) getProfile();
            // console.log("usefocus effect called in id.tsx!");
        }, []),
    );

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`username, avatar_url, full_name, role`)
                .eq("id", session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setFullName(data.full_name);
                setRole(data.role);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchTemplates = async () => {
        const { data, error } = await supabase
            .from("templates")
            .select(`*,profiles:profiles (id, full_name, role)`)
            .eq("creator_id", session?.user.id);
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

    return (
        <View className="flex-1 bg-white p-5 gap-3">
            <Stack.Screen options={{ title: "Profile" }} />
            {/* <Header header={"Profile"} back={false} /> */}
            <View className="flex-row justify-between mb-8">
                <View>
                    {fullName ? (
                        <Text className="text-4xl">{fullName}</Text>
                    ) : (
                        <Text className="text-4xl">{username}</Text>
                    )}
                    
                    <Text className=" text-gray-500">Role: {role}</Text>
                </View>
                <Link href={`/profile/profileSettings`} asChild>
                    <Pressable>
                        <Entypo
                            name="cog"
                            size={24}
                            color="black"
                            className="bg-blue-400 p-3 rounded-full"
                        />
                    </Pressable>
                </Link>
            </View>
            <View>
                <Text className="text-4xl">Created Templates:</Text>
                {templates.length === 0 && (
                    <View className="p-3 mt-3 rounded-xl bg-gray-200">
                        <Text className=" text-gray-700">
                            You havent created any templates
                        </Text>
                    </View>
                )}
                <FlatList
                    className="bg-white p-1 h-1/2"
                    data={templates}
                    renderItem={({ item }) => (
                        <TemplateListItem template={item} />
                    )}
                />
            </View>
        </View>
    );
}
