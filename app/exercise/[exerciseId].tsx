import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Pressable,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "~/contexts/AuthProvider";
import dayjs from "dayjs";

export default function ExerciseScreen() {
    const { exerciseId, routineId } = useLocalSearchParams(); // Get exercise ID

    const [loading, setLoading] = useState(null);

    const [setLog, setSetLog] = useState(null);
    const [workoutSession, setWorkoutSession] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [exercise, setExercise] = useState(false);
    const [newSessionId, setNewSessionId] = useState("");

    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");

    const { user } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchWorkoutSession();
        fetchRoutineExercises();
        fetchExercise();
    }, [setLog]);

    // console.log("routineId = ", routineId);
    // console.log("Workout session = ", JSON.stringify(workoutSession, null, 2));
    // console.log("setlog = ", JSON.stringify(setLog, null, 2));
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
        // console.log("fetchexercise from exercise = ", data.name);

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
    };

    const fetchWorkoutSession = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("workout_sessions")
            .select("*, set_logs!inner(*)")
            .eq("user_id", user.id)
            .eq("set_logs.exercise_id", exerciseId);
        setWorkoutSession(data);
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
        } else {
            // console.log("workoutsession table: ", data);
        }

        setLoading(false);
    };

    const getOrCreateWorkoutSession = async () => {
        console.log("Checking for existing incomplete workout session...");

        // Step 1: Check if an incomplete workout session exists
        const { data: existingSessions, error: fetchError } = await supabase
            .from("workout_sessions")
            .select("session_id")
            .eq("user_id", user.id)
            .eq("completed", false)
            .limit(1); // Only need the first incomplete session

        if (fetchError) {
            console.error("Error fetching workout sessions:", fetchError);
            return null;
        }

        if (existingSessions.length > 0) {
            console.log(
                "Returning existing session:",
                existingSessions[0].session_id,
            );
            setNewSessionId(existingSessions[0].session_id); // Store in state
            return existingSessions[0].session_id;
        }

        // Step 2: If no incomplete session exists, create a new one
        console.log("No existing session found, creating new session...");
        const { data: newSession, error: insertError } = await supabase
            .from("workout_sessions")
            .insert([
                {
                    user_id: user.id,
                    routine_id: routineId,
                    end_time: null,
                    notes: null,
                    completed: false,
                },
            ])
            .select("session_id")
            .single(); // Ensures we get a single object instead of an array

        if (insertError) {
            console.error("Error creating workout session:", insertError);
            return null;
        }

        console.log("Created new workout session:", newSession.session_id);
        setNewSessionId(newSession.session_id); // Store in state
        return newSession.session_id;
    };

    const createSetLog = async (sessionId) => {
        if (!sessionId) {
            console.log("No session ID available, cannot create set log.");
            return; // If no session ID, exit early
        }

        console.log(
            "create set log before ",
            sessionId,
            exerciseId,
            weight,
            reps,
        );

        const { data, error } = await supabase
            .from("set_logs")
            .insert([
                {
                    session_id: sessionId, // Use the passed sessionId here
                    exercise_id: exerciseId,
                    weight: weight,
                    reps: reps,
                },
            ])
            .select("*");

        console.log("create set log data: ", data);
        console.log(error);
        fetchSetLog();
    };

    // Example function to call both operations sequentially
    const handleNewSetLogSession = async () => {
        let sessionId = "";
        if (newSessionId === "") {
            sessionId = await getOrCreateWorkoutSession(); // Wait for workout session to be created
        }
        console.log("session id inside handle: ", sessionId);
        await createSetLog(sessionId || newSessionId); // Pass sessionId directly to createSetLog
        await fetchSetLog();
    };

    console.log("newSessionId outside: ", newSessionId);

    // if (loading) {
    //     return <ActivityIndicator />;
    // }

    console.log("setlog = ", JSON.stringify(setLog, null, 2));
    return (
        <View className="flex-1 bg-white p-1">
            <Stack.Screen
                options={{
                    title: exercise ? exercise.name : "Exercise",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                }}
            />
            {/* <Text>routine id = {routineId}</Text>
            <Text style={{ fontSize: 24 }}>Exercise ID: {exerciseId}</Text>
            <Text style={{ fontSize: 24 }}>Exercise name: {exercise.name}</Text> */}

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
                className=""
                data={workoutSession}
                renderItem={({ item }) => (
                    <View className="p-4">
                        <Text className="text-2xl mb-1 font-semibold">
                            Session {item.session_id}
                        </Text>
                        <FlatList
                            className="gap-3 rounded-xl p-2 bg-gray-100"
                            data={setLog}
                            renderItem={({ item: setLogItem }) => (
                                <View className="p-2 flex-row justify-between border-b border-gray-300 ">
                                    <Text className="text-2xl">
                                    
                                        {setLogItem.reps} Reps
                                    </Text>
                                    <Text className="text-2xl">
                                        {setLogItem.weight} Kg
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            /> */}

            <FlatList
                data={workoutSession}
                renderItem={({ item }) => (
                    <View className="p-4">
                        <Text className="text-sm text-gray-500">
                            session id: {item.session_id}
                        </Text>
                        <Text className="text-2xl mb-1 font-semibold">
                            {dayjs(item.start_time).format("dddd D")}
                        </Text>

                        {/* Displaying a fallback message if no set logs */}
                        {item.set_logs.length > 0 ? (
                            <FlatList
                                className="gap-3 rounded-xl p-2 bg-gray-100"
                                data={item.set_logs}
                                renderItem={({ item: setLogItem }) => (
                                    <View className="p-2 flex-row justify-between">
                                        <Text className="text-2xl">
                                            {setLogItem.reps} Reps
                                        </Text>
                                        <Text className="text-2xl">
                                            {setLogItem.weight} Kg
                                        </Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text>No set logs for this session</Text>
                        )}
                    </View>
                )}
            />

            {workoutSession.some((session) => !session.completed) && (
                <Text className="text-green-500 text-xl">
                    Workout session active
                </Text>
            )}

            {/* <Pressable
                className="p-3 px-4 rounded-lg bg-gray-200"
                onPress={() => {
                    createWorkoutSession();
                }}
            >
                <Text className="text-xl">CreateWkSession</Text>
            </Pressable> */}

            {/* <Link href={`/exercise/exercises?routineId=`} asChild> */}
            <Pressable
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <Text className="bg-blue-400 p-3 rounded-full text-center font-semibold text-xl mb-5">
                    <Entypo
                        name="plus"
                        size={24}
                        color="black"
                        className="justify-end"
                    />
                </Text>
            </Pressable>
            {/* <Exercises updateExerciseList={updateExerciseList} />
            </Link> */}

<Modal animationType="slide" transparent={true} visible={modalVisible}>
    <Pressable
        onPress={() => setModalVisible(false)}
        className="flex-auto justify-end items-center bg-black/20 backdrop-blur-xl"
    >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            className="w-full"
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                keyboardShouldPersistTaps="handled"
            >
                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="bg-white p-6 rounded-lg w-full"
                >
                    <View className="flex-row justify-between">
                        <View className="w-1/3 justify-end">
                            <Text className="text-2xl mb-1">Reps</Text>
                            <TextInput
                                value={reps}
                                onChangeText={(text) => setReps(text)}
                                placeholder="Reps"
                                keyboardType="number-pad"
                                placeholderTextColor="gray"
                                className="mb-4 p-3 rounded-lg bg-gray-200"
                            />
                        </View>
                        <View className="w-1/3">
                            <Text className="text-2xl mb-1">Weight</Text>
                            <TextInput
                                value={weight}
                                onChangeText={(text) => setWeight(text)}
                                placeholder="kg"
                                keyboardType="decimal-pad"
                                placeholderTextColor="gray"
                                className="mb-4 p-3 rounded-lg bg-gray-200 w-full"
                            />
                        </View>
                    </View>

                    <View className="flex-row justify-between">
                        <Pressable
                            className="p-3 px-4 rounded-lg bg-gray-200"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-xl">Cancel</Text>
                        </Pressable>
                        <Pressable
                            className="p-3 px-4 rounded-lg bg-gray-200"
                            onPress={() => {
                                fetchWorkoutSession();
                                handleNewSetLogSession();
                                setModalVisible(false);
                            }}
                        >
                            <Text className="text-xl">Save</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    </Pressable>
</Modal>

        </View>
    );
}
