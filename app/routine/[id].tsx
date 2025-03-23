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

export default function RoutinePage() {
    const { id } = useLocalSearchParams();
    const [exerciseId, setExerciseId] = useState(null);

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
    }, [id]);

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



    // console.log("fetchexercise from routinerxercise = ",exercise)

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!routine) {
        return <Text>routine not found</Text>;
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
            <Link
                href={`/exercise/exercises?routineId=${id}`}
                asChild
            >
                <Pressable onPress={() => setModalVisible(true)}>
                    <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl">
                        Add Exercises
                    </Text>
                </Pressable>
            </Link>

        </View>
    );
}
