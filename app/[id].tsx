import { useLocalSearchParams, Stack, Link } from "expo-router";
import {
    View,
    Text,
    Image,
    Pressable,
    ActivityIndicator,
    FlatList,
} from "react-native";

import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";

export default function RoutinePage() {
    const { id } = useLocalSearchParams();
    const [exerciseId, setExerciseId] = useState(null);

    const [routine, setRoutine] = useState(null);
    const [exercise, setExercise] = useState(null);
    const [routineExercise, setRoutineExercise] = useState(null);
    const [loading, setLoading] = useState(false);

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
    };

    const fetchRoutineExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("*")
            .eq("routine_id", id);
        // .single();
        setRoutineExercise(data);
        setExerciseId(data.exercise_id)
        console.log("fetchroutineLOG = ", data.select("exercise_id"))
        setLoading(false);
        // console.log("id = ", id);
    };

    const fetchExercise = async () => {
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("exercise_id, exercises(name)") // Fetch exercise name
            .eq("routine_id", id);
    
        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        }
        console.log("fetchexercise from routinerxercise = ",data)
    
        setExercise(data);
    };


    console.log("fetchexercise from routinerxercise = ",exercise)
    // console.log("exercise id = ",exerciseId)
    // console.log("routineExercises = ", routineExercise);

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!routine) {
        return <Text>routine not found</Text>;
    }

    console.log(exercise[1].exercises.name)

    return (
        <View className="flex-1 p-3 gap-3 bg-white">
            <Stack.Screen
                options={{
                    title: routine ? routine.name : "Routine",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />

            {/* <Link href={`/${routine.routine_id}`} asChild>
                <Pressable className="p-4 mb-3 border rounded-xl border-gray-200 bg-gray-100">
                    <View className="flex-row">
                        <View className="flex-1 gap-1">
                                <Text className="text-2xl" numberOfLines={2}>
                                Routine name {routine.name}, {routine.routine_id}
                                </Text>
                        </View>
                    </View>
                </Pressable>
            </Link>  */}
            

            <FlatList
                data={exercise}
                renderItem={({ item }) => (
                    <View className="p-2">
                        <Text>Routine ID: {item.routine_id}</Text>
                        <Text>Exercise ID: {item.exercises.name}</Text>
                    </View>
                )}
            />
        </View>
    );
}
