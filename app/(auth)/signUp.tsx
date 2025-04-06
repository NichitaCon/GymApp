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
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);

        if (!email) {
            setLoading(false);
            return Alert.alert("email required :P");
        } else if (!name) {
            setLoading(false);
            return Alert.alert("name required :P");
        }

        // Step 1: Create a new account
        const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
                email: email,
                password: password,
            });

        if (signUpError) {
            Alert.alert(signUpError.message);
            setLoading(false);
            return;
        }

        // Step 2: Get the user ID from the signed-up session
        const userId = signUpData?.user?.id;
        if (!userId) {
            Alert.alert("User ID not found after sign-up.");
            setLoading(false);
            return;
        }

        // Step 3: Update the existing profile instead of inserting a new one
        const { error: profileError } = await supabase
            .from("profiles")
            .update({ full_name: name })
            .eq("id", userId);

        if (profileError) {
            Alert.alert(profileError.message);
        } else {
            // Alert.alert("Sign-up successful! Check your email for verification.");
        }

        setLoading(false);
    }

    return (
        <View className="flex-1 gap-3 p-5 pt-10 bg-white">
            <Stack.Screen options={{ title: "Sign up" }} />
            <Header header={"Sign up"}/>

            {/* <Text className="text-4xl">Welcome to my app!</Text> */}
            <View className="gap-1">
                <Text className="text-2xl">Email:</Text>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={"none"}
                    className=" p-4 bg-gray-200 rounded-md"
                />
            </View>

            <View className="gap-1">
                <Text className="text-2xl">Name:</Text>
                <TextInput
                    onChangeText={(text) => setName(text)}
                    value={name}
                    placeholder="Name"
                    autoCapitalize={"none"}
                    className="p-4 bg-gray-200 rounded-md"
                />
            </View>

            <View>
                <Text className="text-2xl">Password:</Text>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={"none"}
                    className="p-4 bg-gray-200 rounded-md"
                />
            </View>

            <View className="flex-row gap-3">

                <Pressable
                    onPress={() => signUpWithEmail()}
                    disabled={loading}
                    className="p-4 flex-1 bg-blue-400 rounded-md items-center"
                >
                    <Text className="font-bold text-white text-lg">
                        Sign up
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
