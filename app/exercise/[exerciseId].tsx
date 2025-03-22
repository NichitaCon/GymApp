import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";

export default function ExerciseScreen() {
    const { exerciseId, routineId } = useLocalSearchParams(); // Get exercise ID

    const [loading, setLoading] = useState(null);

    const [setLog, setSetLog] = useState(null);
    const [workoutSession, setWorkoutSession] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [exercise, setExercise] = useState(false);

    useEffect(() => {
        fetchSetLog();
        fetchWorkoutSession();
        fetchRoutineExercises();
        fetchExercise();
    }, [exerciseId]);

    console.log("routineId = ", routineId);
    // console.log("Workout session = ", JSON.stringify(workoutSession, null, 2));
    console.log("setlog = ", JSON.stringify(setLog, null, 2));
    // console.log("routineExercises = ", JSON.stringify(routineExercises, null, 1));
    // console.log(
    //     "workout session setlogs reps",
    //     workoutSession[0].set_logs[0].reps,
    // );

    const fetchSetLog = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("set_logs")
            .select("*")
            // .eq("session_id", workoutSession.session_id);
            .eq("exercise_id", exerciseId);
        setSetLog(data);
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
        }

        setLoading(false);
    };

    const fetchWorkoutSession = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("workout_sessions")
            .select("*, set_logs(*)")
            .eq("routine_id", routineId);
        setWorkoutSession(data);
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
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
        console.log("fetchexercise from exercise = ", data.name);

        setExercise(data);
        // console.log(data?.name);
        setLoading(false);
    };

    const fetchRoutineExercises = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("*")
            .eq("routine_id", routineId);
        setRoutineExercises(data);
        // console.log(data);

        if (error) {
            console.warn("RoutineExercises error = ", error);
        }

        setLoading(false);
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View>
            <Stack.Screen
                options={{
                    title: exercise ? exercise.name : "Exercise",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />
            <Text>routine id = {routineId}</Text>
            <Text style={{ fontSize: 24 }}>Exercise ID: {exerciseId}</Text>
            <Text style={{ fontSize: 24 }}>Exercise name: {exercise.name}</Text>

            {/* <FlatList
                data={workoutSession}
                renderItem={({ item }) => (
                    <View className="p-2">
                        <Text>session ID: {item.session_id}</Text>
                        <Text>routine ID: {item.routine_id}</Text>
                        <Text>reps: {item.set_logs.reps}</Text>
                    </View>
                )}
            /> */}

            {/* <FlatList
                data={workoutSession.flatMap((session) => session.set_logs)}
                renderItem={({ item }) => (
                    <View className="p-2">
                        <Text>Session ID: {item.session_id}</Text>
                        <Text>Reps: {item.reps}</Text>
                        <Text>Weight: {item.weight} Kg</Text>
                    </View>
                )}
            /> */}

            <FlatList
                data={workoutSession}
                renderItem={({ item }) => (
                    <View className="p-4">
                        <Text className="text-xl font-bold">Session {item.session_id}</Text>
                        <FlatList
                            data={setLog}
                            renderItem={({ item: setLogItem }) => (
                                <View className="p-2 flex-row justify-between border border-gray-300 bg-white mb-2">
                                    <Text> {item.session_id} Reps: {setLogItem.reps}</Text>
                                    <Text>Weight: {setLogItem.weight} Kg</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            />
        </View>
    );
}
