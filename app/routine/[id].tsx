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
    const { id, updated } = useLocalSearchParams();
    const [exerciseId, setExerciseId] = useState(null);
    // const [updateExerciseList, setUpdateExerciseList] = useState(() => {
    //     console.log('Exercise list updated');
    // });

    useEffect(() => {
        console.log("updated = ", updated); // Logs the updated value when it changes
    }, [updated]);
    const [routine, setRoutine] = useState(null);
    const [exercise, setExercise] = useState(null);

    const [routineExercise, setRoutineExercise] = useState(null);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        fetchRoutine();
        fetchRoutineExercise();
        fetchExercise();
        console.log("useEffect Triggered in: [id]1.tsx");
    }, [id]);

    console.log(exercise);

    const updateExerciseList = () => {
        fetchRoutineExercise(); // Re-fetch the exercises
    };

    // useEffect(() => {
    //     fetchExercise();
    //     console.log("useEffect Triggered in: [id]2.tsx");
    // }, []);

    const fetchRoutine = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("routine_id", id)
            .single();
        setRoutine(data);
        setLoading(false);
        // console.log("data/routine = ", data);
        // console.log("id = ", id);
        setLoading(false);
    };

    const fetchRoutineExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("*")
            .eq("routine_id", id);
        // .single();
        setRoutineExercise(data);
        setExerciseId(data);
        setLoading(false);
        // console.log("id = ", data, error);
    };

    const fetchExercise = async () => {
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("exercise_id, exercises(*)") // Fetch exercise name
            .eq("routine_id", id);

        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        }
        // console.log("fetchexercise from routinerxercise = ",data)

        setExercise(data);
    };

    // useEffect(() => {
    //     console.log("all exercises in routine id ", id, ": ", exercise);
    // }, [exercise]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         console.log("Screen is focused")
    //         // console.log("exercise before call = ", JSON.stringify(exercise, null, 2))
    //         fetchExercise();
    //         // console.log("exercise after call = ", JSON.stringify(exercise, null, 2))
    //         console.log("fetchRoutine Called")
    //     }, []),
    // );

    // console.log("fetchexercise from routinerxercise = ",exercise)

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!routine) {
        return <Text>routine not found</Text>;
    }

    return (
        <View className="flex-1 p-5 gap-3 bg-white">
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
            <View>
                <FlatList
                    className="bg-white rounded-xl"
                    data={exercise}
                    renderItem={({ item }) => (
                        <ExerciseListItem exercise={item} routineId={id} />
                    )}
                />
            </View>
            <Link href={`/exercise/exercises?routineId=${id}`} asChild>
                <Pressable>
                    <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl">
                        Add Exercises
                    </Text>
                </Pressable>
                {/* <Exercises updateExerciseList={updateExerciseList} /> */}
            </Link>
        </View>
    );
}
