import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Pressable,
    Modal,
    TextInput,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "~/contexts/AuthProvider";

export default function ExerciseScreen() {
    const { exerciseId, routineId } = useLocalSearchParams(); // Get exercise ID

    const [loading, setLoading] = useState(null);

    const [setLog, setSetLog] = useState(null);
    const [workoutSession, setWorkoutSession] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [exercise, setExercise] = useState(false);

    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");

    const { user } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);

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
        } else {
            console.log("workoutsession table: ", data);
        }

        setLoading(false);
    };

    const createWorkoutSession = async () => {
        console.log("create WorkoutSession called");
        const { data, error } = await supabase
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
            .select();

        if (error) {
            console.error(error);
        } else {
            console.log("created workout session: ", data);
        }
        fetchWorkoutSession();
    };

    const createSetLog = async () => {
        const latestSession = workoutSession[workoutSession.length - 1];
        const { data, error } = await supabase
            .from("set_logs")
            .insert([
                {
                    session_id: 19,
                    exercise_id: exerciseId,
                    weight: weight,
                    reps: reps,
                },
            ])
            .select();

        console.log(data);
        console.log(error);
        fetchRoutines();
    };

    console.log("workout session = ", workoutSession);

    if (loading) {
        return <ActivityIndicator />;
    }

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
                                        {/* {item.session_id}  */}
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
            />

            {workoutSession.some(
                (session) => session.session_id === 19 && !session.completed,
            ) && (
                <Text className="text-green-500 text-xl">
                    Workout session active
                </Text>
            )}

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

            <Modal
                animationType="slide"
                transparent={true} // Modal background is transparent
                visible={modalVisible}
            >
                <Pressable
                    onPress={() => {
                        setModalVisible(false);
                    }}
                    className="flex-auto justify-end items-center bg-black/20 backdrop-blur-xl"
                >
                    <Pressable
                        onPress={() => {
                            setModalVisible(true);
                        }}
                        className="bg-white p-6 rounded-lg w-full h-3/6"
                    >
                        {/* <Text className="text-4xl mb-5 text-center">
                            Log a Workout
                        </Text> */}
                        <View className="flex-row justify-between">
                            <View className="w-1/3">
                                <Text className="text-2xl mb-1">Weight</Text>
                                <TextInput
                                    value={weight}
                                    onChangeText={(text) => setWeight(text)}
                                    placeholder="kg"
                                    placeholderTextColor="gray"
                                    className="mb-4 p-3 rounded-lg bg-gray-200 w-full"
                                />
                            </View>
                            <View className="w-1/3 justify-end">
                                <Text className="text-2xl mb-1">Reps</Text>
                                <TextInput
                                    value={reps}
                                    onChangeText={(text) => setReps(text)}
                                    placeholder="Reps"
                                    placeholderTextColor="gray"
                                    className="mb-4 p-3 rounded-lg bg-gray-200"
                                />
                            </View>
                        </View>

                        <View className="flex-row justify-between">
                            <Pressable
                                className="p-3 px-4 rounded-lg bg-gray-200"
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text className="text-xl">cancel</Text>
                            </Pressable>
                            <Pressable
                                className="p-3 px-4 rounded-lg bg-gray-200"
                                onPress={() => {
                                    fetchWorkoutSession();
                                    if (
                                        workoutSession.length === 0 ||
                                        !session.completed
                                    ) {
                                        createWorkoutSession();
                                        // createSetLog();
                                    } else {
                                        createSetLog();
                                        fetchSetLog();
                                    }
                                    setModalVisible(false);
                                }}
                            >
                                <Text className="text-xl">Save</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
