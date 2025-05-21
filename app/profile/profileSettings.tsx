import { router, Stack } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthProvider";

import { supabase } from "~/utils/supabase";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [role, setRole] = useState("");

    const { session } = useAuth();

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

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
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                    header: () => (
                        <Header
                            header="Settings"
                            back={true}
                        />
                        // Add extra buttons/components here if you want
                    ),
                }}
            />

            <Text className="text-3xl">Edit Account:</Text>

            <View>
                <Text className="text-xl">Email:</Text>
                <TextInput
                    editable={false}
                    value={session.user.email}
                    placeholder="email"
                    autoCapitalize={"none"}
                    className="border p-3 border-gray-400 rounded-md text-gray-500"
                />
            </View>

            <View>
                <Text className="text-xl">Name:</Text>
                <TextInput
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    placeholder="full name"
                    autoCapitalize={"none"}
                    className="border p-3 border-gray-400 rounded-md"
                />
            </View>

            {/* <TextInput
                onChangeText={(text) => setUsername(text)}
                value={username}
                placeholder="username"
                autoCapitalize={"none"}
                className="border p-3 border-gray-400 rounded-md"
            /> */}

            <View className="flex-row justify-between ">
                <Pressable
                    className="p-4  border-2 border-gray-400 rounded-md items-center w-1/3"
                    onPress={() => {
                        supabase.auth.signOut();
                        router.replace("/(auth)/login");
                    }}
                >
                    <Text className="font-bold text-black text-lg">
                        Sign out
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        updateProfile({
                            username,
                            avatar_url: avatarUrl,
                            full_name: fullName,
                        });
                        router.push({
                            pathname: "/(tabs)/profile",
                            params: {
                                username: username,
                                full_name: fullName,
                                avatar_url: avatarUrl,
                            },
                        });
                    }}
                    disabled={loading}
                    className="p-4  bg-blue-400 rounded-md items-center w-1/3"
                >
                    <Text className="font-bold text-white text-lg">Save</Text>
                </Pressable>
            </View>
        </View>
    );
}
