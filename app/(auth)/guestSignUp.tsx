import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    View,
    AppState,
    TextInput,
    Button,
    Pressable,
    Text,
} from "react-native";
import { Stack } from "expo-router";

import { supabase } from "../../utils/supabase";
import Header from "~/components/Header";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function Auth() {
    const [userName, setUserName] = useState<string>("");
    const [loading, setLoading] = useState(false);

    async function signInAnonymously(userName: string) {
        // Sign in anonymously
        const { data: authData, error: authError } =
            await supabase.auth.signInAnonymously();

        if (authError) {
            console.error("Anonymous sign-in failed:", authError.message);
            return;
        }

        const user = authData.user;


        console.log("Anonymous user signed in:", user);

        // Store the username in the profiles table
        const { error: dbError } = await supabase
            .from("profiles")
            .upsert([{ id: user.id, username: userName, role: "Guest user" }]);

        if (dbError) {
            console.error("Failed to insert profile:", dbError.message);
            return;
        }

        console.log("Anonymous user signed in and profile created:", user.id);
    }

    return (
        <View className="flex-1 gap-3 p-5 bg-white">
            <Stack.Screen options={{ title: "Get Started" }} />

            {/* <Header header={"Get Started"} /> */}

            <Text className="text-2xl mb-5">Fill in your name to get started</Text>
            <View className="gap-1">
                {/* <Text className="text-2xl">User Name:</Text> */}
                <TextInput
                    onChangeText={(text) => setUserName(text)}
                    value={userName}
                    placeholder="Your name"
                    placeholderTextColor="#c4c4c4" // Change this to your desired color
                    autoCapitalize={"none"}
                    className=" p-4 border-gray-300 border-2 rounded-md"
                />
            </View>
            <View className="flex-row gap-3">
                {userName.length < 3 ? (
                    <View className="p-4 flex-1 bg-gray-200 rounded-md items-center justify-center">
                        <Text className="text-gray-500 text-lg">Enter at least 3 characters</Text>
                    </View>
                ) : userName.length > 15 ? (
                    <View className="p-4 flex-1 bg-yellow-200 rounded-md items-center justify-center">
                        <Text className="text-yellow-700 text-lg">Name must be 15 characters or less</Text>
                    </View>
                ) : (
                    <Pressable
                        onPress={() => signInAnonymously(userName)}
                        disabled={loading}
                        className="p-4 flex-1 bg-blue-300 rounded-md items-center"
                    >
                        <Text className="font-bold text-gray-700 text-lg">
                            Continue
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
