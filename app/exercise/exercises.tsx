import { View, Text, Pressable, FlatList } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";

export default function Exercises({ routineId }) {
    const [allExercises, setAllExercises] = useState([]);

    useEffect(() => {
        fetchAllExercises();
    }, [routineId]);

    const fetchAllExercises = async () => {
        const { data, error } = await supabase.from("exercises").select("*"); // Fetch exercise name

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        }

        setAllExercises(data);
        // console.log("allexercises = ", data, error)
    };
    console.log("Routine id exercises.tsx = ", routineId);
    return (
        <View className="flex-1 p-5 bg-white pb-safe-offset-0">

            <Stack.Screen options={{ title: "Exercises" }} />
            {/* <Text className="text-4xl mb-5 text-center">Exercises</Text> */}

            <FlatList
                data={allExercises}
                renderItem={({ item }) => (
                    <View className="">
                        <Text className="font-semibold text-2xl p-3 mb-3 rounded-lg bg-gray-100">
                            {item.name}
                        </Text>
                    </View>
                )}
            />

            <View className="flex-row justify-between p-3">
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
        </View>
    );
}
