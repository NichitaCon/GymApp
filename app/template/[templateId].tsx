import { useLocalSearchParams, Stack, Link } from "expo-router";
import {
    View,
    Text,
    Image,
    Pressable,
    ActivityIndicator,
    FlatList,
    Modal,
    TextInput,
} from "react-native";

import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";
import RoutineListItem from "~/components/RoutineListItem";
import ExerciseListItem from "~/components/ExerciseListItem";
import Entypo from "@expo/vector-icons/Entypo";
import Exercises from "../exercise/exercises";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export default function RoutinePage() {
    const { template } = useLocalSearchParams();
    const [templateExercises, setTemplateExercises] = useState([]);


    console.log(template)
    useEffect(() => {
        fetchTemplateExercises()
    }, []);

    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const fetchTemplateExercises = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("templates")
            .select("*")
            .eq("template_id", template.template_id)
            .single();
        setTemplateExercises(data);
        setLoading(false);

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        } else {
            console.log("fetchexercise from routinerxercise = ", data)
        }

        setLoading(false);
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!template) {
        return <Text>id not found</Text>;
    }

    return (
        <View className="flex-1 p-3 gap-3 bg-white">
            <Stack.Screen
                options={{
                    title: routine ? routine.name : "Routine",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />

            {/* <FlatList
                data={exercise}
                renderItem={({ item }) => (
                    <View className="p-2">
                        <Text>Routine ID: {item.routine_id}</Text>
                        <Text>Exercise ID: {item.exercises.name}</Text>
                    </View>
                )}
            /> */}

            <FlatList
                className="bg-white p-1"
                data={exercise}
                renderItem={({ item }) => (
                    <ExerciseListItem exercise={item} routineId={id} />
                )}
            />
            {/* <Link href={`/exercise/exercises?routineId=${id}`} asChild>
                <Pressable>
                    <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl">
                        Add Exercises
                    </Text>
                </Pressable>
                <Exercises updateExerciseList={updateExerciseList} />
            </Link> */}
        </View>
    );
}
