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
        console.log("data/routine = ", data);
        console.log("id = ", id);
    };

    const fetchRoutineExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("*")
            .eq("routine_id", id);
        // .single();
        setRoutineExercise(data);
        setLoading(false);
        console.log("id = ", id);
    };

    const fetchExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("exercises")
            .select("*")
            // .eq("exercise_id", id);
        // .single();
        setExercise(data);
        setLoading(false);
        console.log("exercise = ", data);
    };
    console.log("routineExercises = ", routineExercise);

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

            {/* <Link href={`/${routine.routine_id}`} asChild>
                <Pressable className="p-4 mb-3 border rounded-xl border-gray-200 bg-gray-100">
                    <View className="flex-row">
                        <View className="flex-1 gap-1">
                            <Text className="text-2xl" numberOfLines={2}>
                                {routine.name}, {routine.routine_id}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Link> 
            */} 

            <FlatList
                data={routineExercise}
                renderItem={({ item }) => (
                    <View className="p-2">
                        <Text>Routine ID: {item.routine_id}</Text>
                        <Text>Exercise ID: {item.exercise_id}</Text>
                    </View>
                )}
            />
        </View>
    );
}
