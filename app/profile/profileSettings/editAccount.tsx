import { router, Stack } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import Header from "~/components/Header";
import { useAuth } from "~/contexts/AuthProvider";

import { supabase } from "~/utils/supabase";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [avatarUrl, setAvatarUrl] = useState("");

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
            if (username.length < 3) {
                console.error("username is too short!, username needs to be above 3 chars");
                Alert.alert("Username is too short!", "minimum 3 characters");
                setLoading(false);
                return;
            }

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
        // Only show success and navigate if no error occurred and username was valid
        Alert.alert("Account updated!");
        router.push({
            pathname: "/(tabs)/profile",
            params: {
                username: username,
                full_name: fullName,
                avatar_url: avatarUrl,
            },
        });
    }

    return (
        <View className="flex-1 bg-white p-5 gap-3">
            <Stack.Screen
                options={{
                    title: "Settings",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                    header: () => (
                        <Header header="Edit Account" back={true} />
                        // Add extra buttons/components here if you want
                    ),
                }}
            />

            <View className="w-full flex-1 gap-2">
                <View>
                    <Text className="text-xl font-semibold mb-1">Email:</Text>
                    <TextInput
                        editable={false}
                        value={session.user.email}
                        placeholder="email"
                        autoCapitalize={"none"}
                        className=" p-4 border-gray-300 border rounded-md"
                    />
                </View>

                <View>
                    <Text className="text-xl font-semibold mb-1">Name:</Text>
                    <TextInput
                        onChangeText={(text) => setFullName(text)}
                        value={fullName}
                        placeholder="full name"
                        autoCapitalize={"none"}
                        className=" p-4 border-gray-300 border rounded-md"
                    />
                </View>

                <View>
                    <Text className="text-xl font-semibold mb-1">
                        User name:
                    </Text>

                    <TextInput
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                        placeholder="user name"
                        autoCapitalize={"none"}
                        className=" p-4 border-gray-300 border rounded-md"
                    />
                </View>

                <Pressable
                    onPress={() => {
                        updateProfile({
                            username,
                            avatar_url: avatarUrl,
                            full_name: fullName,
                        });
                    }}
                >
                    <Text className="text-2xl font-semibold p-3 rounded-md pl-4 mt-2 bg-blue-400 text-white text-center ">
                        Save
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
