import { Stack, useFocusEffect } from "expo-router";
import {
    FlatList,
    View,
    Text,
    Pressable,
    Modal,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import {
    registerForPushNotificationsAsync,
    configureNotificationChannel,
    scheduleLocalNotification,
} from "~/utils/notifications";

import RoutineListItem from "~/components/RoutineListItem";
import { supabase } from "~/utils/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";

import Entypo from "@expo/vector-icons/Entypo";
import Tip from "~/components/Tip";
import Header from "~/components/Header";
import { FinishButton } from "~/components/FinishSession";
import { Button } from "~/components/Button";

import { useSessionStore } from "~/store/sessionStore";

export default function Events() {
    const [routines, setRoutines] = useState([]);
    const { session, user } = useAuth();

    const [modalVisible, setModalVisible] = useState(false); // state to control modal visibility

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const checkSession = useSessionStore((state) => state.checkSession);
    const sessionId = useSessionStore((state) => state.sessionId);

    useFocusEffect(
        useCallback(() => {
            fetchRoutines();
            // console.log("usefocus effect called in index.tsx!")
        }, []),
    );

    useEffect(() => {
        const fetchSession = async () => {
            await checkSession(user.id);
            // Can't reliably log sessionId here either, because set is async
        };
        fetchSession();
        console.log("check session called in index.tsx!");
        console.log("session id = ", sessionId);
        registerForPushNotificationsAsync();
        configureNotificationChannel();
    }, []);

    const fetchRoutines = async () => {
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("user_id", session.user.id);
        setRoutines(data);

        console.log("session id in fetchRoutines: ", sessionId);
    };

    const createRoutine = async () => {
        console.log("Createroutine data before backend: ", name, description);
        const { data, error } = await supabase
            .from("routines")
            .insert([
                {
                    user_id: user.id,
                    name: name,
                    description: description,
                },
            ])
            .select();

        if (error) {
            console.warn("create error = ", error);
        } else {
            console.log("routine insert: ", data);
        }
        fetchRoutines();
    };

    return (
        <View className="flex-1 bg-white p-5">
            <Stack.Screen options={{ title: "Home" }} />
            {/* <Header header={"Home"} back={false} /> */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-4xl">Workouts</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Entypo
                        name="plus"
                        size={24}
                        color="black"
                        className="bg-blue-400 p-3 rounded-full"
                    />
                </Pressable>
            </View>
            {/* tips */}
            {routines.length === 0 && (
                <Tip
                    title={"Welcome to the Home Page!"}
                    text1={
                        "If you're an experienced gym-goer with your own routine, feel free to create a workout plan for the day with the blue plus icon, just add the exercises you're doing."
                    }
                    text2={
                        "If you're new to the gym and unsure where to start, don’t worry! Simply tap the 'Search' button in the bottom bar to explore routines that fit your needs."
                    }
                />
            )}
            <FlatList
                className="bg-white"
                data={routines}
                renderItem={({ item }) => (
                    <RoutineListItem
                        routine={item}
                        onRoutineDeleted={fetchRoutines}
                    />
                )}
            />
            <FinishButton />
            <Modal
                animationType="slide"
                transparent={true} // Modal background is transparent
                visible={modalVisible}
            >
                <Pressable
                    onPress={() => {
                        setModalVisible(false);
                    }}
                    className="flex-auto justify-end items-center bg-black/20 backdrop-blur-xl"
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-full"
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Pressable
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                                className="bg-white p-6 rounded-lg w-full"
                            >
                                <Text className="text-4xl mb-5 text-center">
                                    Add a Workout
                                </Text>

                                {routines.length === 0 && (
                                    <View className="mb-3">
                                        <Tip
                                            title={"Creating a new Workout"}
                                            text1={
                                                "Here, you can set up a folder to track the exercises you'll do today. Just give it a name and description, and you’re good to go!"
                                            }
                                            text2={undefined}
                                        />
                                    </View>
                                )}
                                <Text className="text-xl mb-1">Workout</Text>

                                <TextInput
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                    placeholder="Workout Name (e.g. 'Push day' 'Leg day')"
                                    placeholderTextColor="gray"
                                    className="mb-4 p-3 rounded-lg bg-gray-200"
                                />

                                <Text className="text-xl mb-1">
                                    Description
                                </Text>
                                <TextInput
                                    value={description}
                                    onChangeText={(text) =>
                                        setDescription(text)
                                    }
                                    placeholder="Description"
                                    placeholderTextColor="gray"
                                    className="mb-6 p-3 rounded-lg bg-gray-200"
                                />

                                <View className="flex-row justify-between">
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text className="text-xl">cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() => {
                                            createRoutine();
                                            setName("");
                                            setDescription("");
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text className="text-xl">Save</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Pressable>
            </Modal>
        </View>
    );
}
