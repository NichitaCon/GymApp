import Entypo from "@expo/vector-icons/Entypo";
import { Link, Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "~/contexts/AuthProvider";

import { supabase } from "~/utils/supabase";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [role, setRole] = useState("");
    const { params } = useGlobalSearchParams();

    console.log("router push params in profile.tsx", params)

    const { session } = useAuth();

    useEffect(() => {
        if (session) getProfile();
    }, [params]);

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
                setAvatarUrl(data.avatar_url);
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

    async function updateProfile({
        username,
        avatar_url,
        full_name,
    }: {
        username: string;
        avatar_url: string;
    }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const updates = {
                id: session?.user.id,
                username,
                avatar_url,
                full_name,
                updated_at: new Date(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);

            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <View className="flex-1 bg-white p-5 gap-3">
            <Stack.Screen options={{ title: "Profile" }} />
            <View className="flex-row justify-between">

            <View>
                <Text className="text-5xl">{fullName}</Text>
                <Text className="text-xl text-gray-500">{username}</Text>
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
        </View>
    );
}
