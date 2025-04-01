import {
    View,
    Text,
    ActivityIndicator,
    Pressable,
    TextInput,
    Alert,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import { useAuth } from "~/contexts/AuthProvider";

export default function ExerciseScreen() {
    const { setLogId, exercise_name } = useLocalSearchParams(); // Get exercise ID

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

    // useEffect(() => {
    //     if (setLog && setLog.exercise_id) {
    //         fetchExercise();
    //     }
    // }, [setLog]); // Only fetch exercise when setLog is valid

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

    const updateSetLog = async () => {
        console.log("updateSetLog Called");
        if (!reps || !weight) {
            // Optionally, handle validation if reps or weight is empty
            console.warn("Reps or weight cannot be empty");
            return;
        }

        setLoading(true);

        // Update the set log in the "set_logs" table
        const { data, error } = await supabase
            .from("set_logs")
            .update({
                reps: reps,
                weight: weight,
            })
            .eq("set_log_id", setLogId); // Ensure you're updating the correct set log by its ID

        setLoading(false);

        if (error) {
            console.error("Error updating set log: ", error.message);
            // Optionally, show an error message to the user
        } else {
            if (data.length === 0) {
                console.warn(
                    "No rows were updated. This could be because the set_log_id doesn't exist.",
                );
            } else if (data.length > 1) {
                console.warn(
                    "Multiple rows were updated. This should not happen. Check for duplicate set_log_ids.",
                );
            } else {
                console.log("Set log updated successfully: ", data);
                // Optionally, navigate back or show a success message
            }
        }
    };

    const deleteSetLog = async () => {
        const { error } = await supabase
            .from("set_logs")
            .delete()
            .eq("set_log_id", setLogId);

        if (error) {
            console.error("Error deleting set log:", error);
            Alert.alert("Error", "Failed to delete the set log.");
            setLoading(false);
        } else {
            // Successfully deleted
            Alert.alert("Success", "Set log deleted successfully.");
            setLoading(false);
            // Optionally, navigate back or refresh the screen after deletion
            router.back(); // Go back to the previous screen (e.g., [id].tsx)
        }
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
            <Text className="text-5xl mb-4">{exercise_name}</Text>
            <View className="mb-2">
                <Text className="text-2xl mb-1">Reps</Text>
                <TextInput
                    onChangeText={(text) => setReps(text)}
                    value={reps}
                    placeholder="reps"
                    keyboardType="number-pad"
                    autoCapitalize={"none"}
                    className="p-4 bg-gray-200 rounded-md"
                />
            </View>
            <View className="mb-8">
                <Text className="text-2xl mb-1">Weight</Text>
                <TextInput
                    onChangeText={(text) => setWeight(text)}
                    value={weight}
                    placeholder="weight"
                    keyboardType="decimal-pad"
                    autoCapitalize={"none"}
                    className="p-4 bg-gray-200 rounded-md"
                />
            </View>
            <View className="flex-row gap-4">
                <Pressable
                    onPress={() => {
                        deleteSetLog();
                        console.log("delete pressed")
                    }}
                    className="flex-1"
                >
                    <Text className="border-2 border-red-300 p-3 text-red-500 rounded-md text-center font-semibold text-xl">
                        Delete
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => {
                        updateSetLog();
                        router.back();
                        console.log("Save pressed");
                    }}
                    className="flex-1"
                >
                    <Text className="bg-blue-400 p-3 rounded-md text-center font-semibold text-xl">
                        Save
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
