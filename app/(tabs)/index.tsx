import { Stack } from "expo-router";
import {
    FlatList,
    View,
    Text,
    Pressable,
    Modal,
    Button,
    TextInput,
} from "react-native";

import RoutineListItem from "~/components/RoutineListItem";
import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";

import Entypo from "@expo/vector-icons/Entypo";

export default function Events() {
    const [routines, setRoutines] = useState([]);
    const { session, user } = useAuth();
    // console.log("id = ",id);
    // console.log("session user = ", session.user.id)
    // console.log(useAuth())

    const [modalVisible, setModalVisible] = useState(false); // state to control modal visibility

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [workoutSession, setWorkoutSession] = useState([]);

    useEffect(() => {
        fetchRoutines();
        fetchWorkoutSession();
        console.log("useEffect Triggered in: index.tsx");
    }, []);

    const fetchRoutines = async () => {
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("user_id", session.user.id);
        setRoutines(data);
    };

    const createRoutine = async () => {
        console.log(name, description);
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

        console.log(data);
        console.log(error);
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
            console.log("workoutsession table: ", data);
        }
    };

    const finishWorkoutSession = async () => {
        console.log("finishworkoutsession called")
        const { data, error } = await supabase
            .from("workout_sessions")
            .update({ completed: true })
            
            .eq("session_id", 19);
        fetchWorkoutSession();
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
        } else {
            console.log("workoutsession table: UPDATE", data);
        }
    };

    console.log(workoutSession)
    return (
        <View className="flex-1 bg-white p-5">
            <Stack.Screen options={{ title: "Home" }} />

            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-5xl">Workouts</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Entypo
                        name="plus"
                        size={24}
                        color="black"
                        className="bg-blue-400 p-3 rounded-full"
                    />
                </Pressable>
            </View>

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

                {workoutSession.some(session => !session.completed) && (
                    <View className="flex-row justify-between items-center">
                        <Text className="text-green-500 text-2xl">
                            Workout session active
                        </Text>
                        <Pressable onPress={() => {
                            finishWorkoutSession()
                        }}>
                            <Text className="bg-blue-400 p-2 px-4 rounded-full text-center font-semibold text-xl w-1">
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
                    <Pressable
                        onPress={() => {
                            setModalVisible(true);
                        }}
                        className="bg-white p-6 rounded-lg w-full h-5/6"
                    >
                        <Text className="text-4xl mb-5 text-center">
                            Add a Workout
                        </Text>

                        <Text className="text-xl mb-1">Workout</Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholder="Workout Name"
                            placeholderTextColor="gray"
                            className="mb-4 p-3 rounded-lg bg-gray-200"
                        />

                        <Text className="text-xl mb-1">Description</Text>
                        <TextInput
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            placeholder="Description"
                            placeholderTextColor="gray"
                            className="mb-4 p-3 rounded-lg bg-gray-200"
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
                                    setModalVisible(false);
                                }}
                            >
                                <Text className="text-xl">Save</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
