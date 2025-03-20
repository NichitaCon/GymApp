import { View, Text, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";

export default function ExerciseScreen() {
    const { exerciseId } = useLocalSearchParams(); // Get exercise ID

    const [loading, setLoading] = useState(null);

    const [exerciseLog, setExerciseLog] = useState(null);
    const [exercise, setExercise] = useState(false);

    useEffect(() => {
        fetchExerciseLog();
        fetchExercise();
    }, [exerciseId]);

    const fetchExerciseLog = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("set_logs")
            .select("*")
            .eq("exercise_id", exerciseId);
        setExerciseLog(data);
        // console.log(data);

        if (error) {
            console.warn("exerciselog error = ", error);
        }

        setLoading(false);
    };

    const fetchExercise = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("exercises")
            .select("*") // Fetch exercise name
            .eq("exercise_id", exerciseId)
            .single();
        if (error) {
            console.error("Error fetching exercises:", error);
            return;
        }
        console.log("fetchexercise from exercise = ",data.name)
    
        setExercise(data);
        // console.log(data?.name);
        setLoading(false);
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    // console.log("exerciseLog = ", exerciseLog);
    // console.log(
    //     "Exercise Name:",
    //     exerciseLog?.[exerciseId - 1]?.exercises?.name || "No exercise found",
    // );

    return (
        <View>
            <Stack.Screen
                options={{
                    title: exercise ? exercise.name : "Exercise",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />
            <Text style={{ fontSize: 24 }}>Exercise ID: {exerciseId}</Text>
            <Text style={{ fontSize: 24 }}>
                Exercise name: {exercise.name}
            </Text>
            {/* Fetch more details from Supabase here */}
        </View>
    );
}
