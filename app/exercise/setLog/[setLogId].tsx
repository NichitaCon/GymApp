import {
    View,
    Text,
    ActivityIndicator,
    Pressable,
    TextInput,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import { useAuth } from "~/contexts/AuthProvider";

export default function ExerciseScreen() {
    const { setLogId } = useLocalSearchParams(); // Get exercise ID

    const [loading, setLoading] = useState(true); // Track loading state
    const [setLog, setSetLog] = useState(null); // Store setLog data
    const [exercise, setExercise] = useState({}); // Store exercise data
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (setLogId) {
            fetchSetLog();
        }
    }, [setLogId]);

    useEffect(() => {
        if (setLog && setLog.exercise_id) {
            fetchExercise();
        }
    }, [setLog]); // Only fetch exercise when setLog is valid

    const fetchSetLog = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("set_logs")
            .select("*")
            .eq("set_log_id", setLogId)
            .single();

        if (error) {
            console.warn("setLog error = ", error);
        } else if (!data) {
            console.warn("no data returned in fetchSetLog()");
        } else {
            setSetLog(data);
            setWeight(String(data.weight));
            setReps(String(data.reps));
        }

        setLoading(false);
    };

    const fetchExercise = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("exercises")
            .select("*")
            .eq("exercise_id", setLog?.exercise_id) // Ensure setLog is valid
            .single();

        if (error) {
            console.warn("fetchExercise error = ", error);
        } else if (!data) {
            console.warn("no data returned in fetchExercise()");
        } else {
            setExercise(data);
        }

        setLoading(false);
    };

    // if (loading) {
    //     return <ActivityIndicator size="large" color="#0000ff" />;
    // }

    return (
        <View className="flex-1 bg-white p-4">
            <Stack.Screen
                options={{
                    title: "Edit Log",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />
            {/* Safeguard against missing exercise data */}
            <Text className="text-5xl mb-4">
                {exercise.name}
            </Text>
            <View className="mb-2">
                <Text className="text-2xl mb-1">Reps</Text>
                <TextInput
                    onChangeText={(text) => setReps(text)}
                    value={reps}
                    placeholder="reps"
                    autoCapitalize={"none"}
                    className="p-4 bg-gray-200 rounded-md"
                />
            </View>
            <View>
                <Text className="text-2xl mb-1">Weight</Text>
                <TextInput
                    onChangeText={(text) => setWeight(text)}
                    value={weight}
                    placeholder="weight"
                    autoCapitalize={"none"}
                    className="p-4 bg-gray-200 rounded-md"
                />
            </View>
            <Pressable>
                <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl">
                    Add Exercises
                </Text>
            </Pressable>
        </View>
    );
}
