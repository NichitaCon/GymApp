import { Stack, useFocusEffect } from "expo-router";
import {
    FlatList,
    View,
    Text,
    Pressable,
    Modal,
    Button,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import RoutineListItem from "~/components/RoutineListItem";
import { supabase } from "~/utils/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";

import Entypo from "@expo/vector-icons/Entypo";
import Tip from "~/components/Tip";
import Header from "~/components/Header";

export default function Events() {
    const [routines, setRoutines] = useState([]);
    const { session, user } = useAuth();
    // console.log("id = ",id);
    // console.log("session user = ", session.user.id)
    // console.log(useAuth())

    const [modalVisible, setModalVisible] = useState(false); // state to control modal visibility

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [workoutSession, setWorkoutSession] = useState([]);

    // useEffect(() => {
    //     // console.log("useEffect Triggered in: index.tsx");
    // }, []);

    useFocusEffect(
        useCallback(() => {
            fetchRoutines();
            fetchWorkoutSession();
            // console.log("usefocus effect called in index.tsx!")
        }, []),
    );

    const fetchRoutines = async () => {
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("user_id", session.user.id);
        setRoutines(data);
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

    const fetchWorkoutSession = async () => {
        const { data, error } = await supabase
            .from("workout_sessions")
            .select("*, set_logs(*)")
            .eq("user_id", user.id);
        setWorkoutSession(data);
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
        } else {
            // console.log("workoutsession table: ", data);
        }
    };

    const finishWorkoutSession = async () => {
        console.log("finishworkoutsession called");
        const { data, error } = await supabase
            .from("workout_sessions")
            .update({ completed: true, end_time: new Date() })
            .eq("user_id", user.id)
            .eq("completed", false); // only update incomplete sessions
        fetchWorkoutSession();
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
        } else {
            console.log("workoutsession table: UPDATE", data);
        }
    };

    return (
        <View className="flex-1 bg-white p-5">
            <Stack.Screen options={{ title: "Home" }} />

            <Header header={"Home"} back={false}/>
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

            {workoutSession.some((session) => !session.completed) && (
                <View className="flex-row justify-between items-center p-3 pb-0">
                    <Text className="text-green-500 text-2xl">
                        Workout session active
                    </Text>
                    <Pressable
                        onPress={() => {
                            finishWorkoutSession();
                        }}
                    >
                        <Text className="bg-blue-400 p-2 px-4 rounded-full text-center font-semibold text-xl">
                            Finish
                        </Text>
                    </Pressable>
                </View>
            )}

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
