
import { Stack } from "expo-router";
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
            <Stack.Screen options={{ title: "Profile settings" }} />

            <TextInput
            editable={false}
            value={session.user.email}
            placeholder="email"
            autoCapitalize={"none"}
            className="border p-3 border-gray-400 rounded-md text-gray-500"
            />
            
            <TextInput
            onChangeText={(text) => setFullName(text)}
            value={fullName}
            placeholder="full name"
            autoCapitalize={"none"}
            className="border p-3 border-gray-400 rounded-md"
            />
            
            <TextInput
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="username"
            autoCapitalize={"none"}
            className="border p-3 border-gray-400 rounded-md"
            />
            
            <Pressable
            onPress={() =>
                updateProfile({
                    username,
                    avatar_url: avatarUrl,
                    full_name: fullName,
                })
            }
            disabled={loading}
            className="p-4  bg-blue-400 rounded-md items-center"
            >
            <Text className="font-bold text-white text-lg">Save</Text>
            </Pressable>
            
            <Button
            title="sign out"
            onPress={() => supabase.auth.signOut()}
            ></Button>
        </View>
    );
}
