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
import { Link, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "~/utils/supabase";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "~/contexts/AuthProvider";
import dayjs from "dayjs";
import Tip from "~/components/Tip";
import Header from "~/components/Header";
import { useSessionStore } from "~/store/sessionStore";
import { useRestStore } from "~/store/restStore";

import { FinishButton } from "~/components/FinishSession";
import { EditButton } from "~/components/EditButton";

export default function ExerciseScreen() {
    const { exerciseId, routineId } = useLocalSearchParams(); // Get exercise ID

    const [loading, setLoading] = useState(null);

    const [setLog, setSetLog] = useState(null);
    const [workoutSession, setWorkoutSession] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [exercise, setExercise] = useState(false);

    const startSession = useSessionStore((state) => state.startSession);
    const sessionId = useSessionStore((state) => state.sessionId);

    const isResting = useRestStore((state) => state.isResting);
    const setIsResting = useRestStore((state) => state.restTime);
    const startRest = useRestStore((state) => state.startRest);
    const endRest = useRestStore((state) => state.endRest);

    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [restTime, setRestTime] = useState("");

    const { user } = useAuth();

    const [setLogmodalVisible, setSetLogModalVisible] = useState(false);
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

    useEffect(() => {
        fetchRoutineExercises();
        fetchExercise();
        fetchRestTime();
    }, [setLog]);

    useFocusEffect(
        useCallback(() => {
            fetchWorkoutSession();
            console.log("usefocus effect called in id.tsx!");
        }, []),
    );

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
            .eq("set_logs.exercise_id", exerciseId)
            .order("session_id", { ascending: false })
            .order("set_log_id", {
                ascending: true,
                referencedTable: "set_logs",
            });
        setWorkoutSession(data);
        // console.log(data);

        if (error) {
            console.warn("setLog error = ", error);
        } else {
            // console.log("workoutsession table: ", data);
        }

        setLoading(false);
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

        // console.log("create set log data: ", data);
        console.log(error);

        startRest(Number(restTime));
        fetchSetLog();
    };

    const handleNewSetLogSession = async () => {
        let currentSessionId = sessionId;

        // If no session exists, create one using Zustand's startSession
        if (currentSessionId == null) {
            console.warn(
                "NO session exists, creating new one IN HandleNewSetLogSession, session id =",
                sessionId,
            );
            currentSessionId = await startSession(user.id, routineId); // This also updates Zustand state
        }

        console.log("Session ID inside handle: ", currentSessionId);

        await createSetLog(currentSessionId); // Use the session ID whether it was fetched or newly created
        await fetchWorkoutSession(); // Optional, depending on your app logic
    };

    const updateRestTime = async () => {
        const { data, error } = await supabase
            .from("routine_exercises")
            .update({ rest_duration: restTime })
            .eq("routine_id", routineId)
            .eq("exercise_id", exerciseId);
        // .select("*");

        if (error) {
            console.error("Error in updateRestTime:", error);
        } else if (data.length < 0) {
            console.warn(
                "updateRestTime insertion successful, but no rows inserted:",
                data,
            );
        } else {
            // console.log("updateRestTime Successful:", data);
        }
    };

    const fetchRestTime = async () => {
        const { data, error } = await supabase
            .from("routine_exercises")
            .select("rest_duration")
            .eq("routine_id", routineId)
            .eq("exercise_id", exerciseId)
            .single();
        if (error) {
            console.error("Error in fetchRestTime:", error);
        } else if (data.length < 0) {
            console.warn("No data present in fetchRestTime:", data);
        } else {
            setRestTime(data.rest_duration);
            console.log("routine exercise data = ", data, error);
        }
    };

    const getSessionTotals = (session) => {
        if (!session)
            return {
                totalVolume: 0,
                totalWeight: 0,
                totalReps: 0,
                averageWeight: 0,
                totalSets: 0,
            };

        let totalVolume = 0;
        let totalWeight = 0;
        let totalReps = 0;
        let totalSets = session.set_logs.length;

        session.set_logs.forEach((setLog) => {
            totalReps += setLog.reps;
            totalWeight += setLog.weight;
            totalVolume += setLog.weight * setLog.reps; // Volume = weight × reps
        });

        const averageWeight = totalWeight / totalSets;

        return {
            totalSets,
            totalWeight,
            totalReps,
            averageWeight,
            totalVolume,
        };
    };

    // Define progress with default values
    let progress = {
        totalWeight: 0,
        totalReps: 0,
        totalRepsDiff: 0,
        averageWeight: 0,
        kgPerRep: 0,
        volume: 0,
        repDiff: 0,
        kgPerRepDiff: 0,
        volumeDiff: 0,
    };

    if (workoutSession.length >= 2) {
        const currentSession = getSessionTotals(workoutSession[0]);
        const previousSession = getSessionTotals(workoutSession[1]);

        progress = {
            totalWeight: currentSession.totalWeight,
            totalReps: currentSession.totalReps,
            totalRepsDiff: currentSession.totalReps - previousSession.totalReps,
            averageWeight: currentSession.averageWeight,
            kgPerRep:
                currentSession.totalReps > 0
                    ? +(
                          currentSession.totalVolume / currentSession.totalReps
                      ).toFixed(2)
                    : 0,
            volume: currentSession.totalVolume,
            repDiff: currentSession.totalReps - previousSession.totalReps,
            kgPerRepDiff:
                currentSession.totalReps > 0 && previousSession.totalReps > 0
                    ? Number(
                          (
                              currentSession.totalVolume /
                                  currentSession.totalReps -
                              previousSession.totalVolume /
                                  previousSession.totalReps
                          ).toFixed(1),
                      )
                    : 0,
            volumeDiff:
                currentSession.totalVolume - previousSession.totalVolume,
        };

        console.log("Current session progress:", progress);
    }

    // console.log("first session kg total:", getSessionTotals(workoutSession[0]).totalWeight)

    // console.log("workoutSession:", JSON.stringify(workoutSession, null, 2));
    // console.log("workoutSession[0]:", JSON.stringify(workoutSession[0], null, 2));

    return (
        <View className="flex-1 bg-white p-5">
            <Stack.Screen
                options={{
                    title: exercise ? exercise.name : "Exercise",
                    headerTintColor: "black",
                    headerBackTitle: "Home",
                    header: () => (
                        <Header
                            header={exercise ? exercise.name : "Exercise"}
                            back={true}
                            rightButtons={[
                                {
                                    component: <EditButton />,
                                    onPress: () =>
                                        setExerciseModalVisible(true),
                                },
                            ]}
                        />
                    ),
                }}
            />

            {workoutSession.length === 0 && (
                <View className="mb-3 gap-4">
                    <Tip
                        title={"Logging your sets"}
                        text1={
                            "Here, you log how many reps and the weight you've done for a set. "
                        }
                        text2={
                            "If you need to edit the log, you can click into it and make changes directly from there."
                        }
                    />
                    <Tip
                        title={"Sessions"}
                        text1={
                            "When you log your first exercise of the day, your session begins. To save your workout logs for the day, make sure to finish the session once you're done."
                        }
                        text2={undefined}
                    />
                </View>
            )}

            <FlatList
                ListHeaderComponent={
                    workoutSession.length > 0 ? (
                        <View className="rounded-xl px-5 pb-5 pt-3 bg-gray-100">
                            <Text className="text-center mb-2 text-2xl font-semibold">
                                Compared to Previous
                            </Text>
                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="text-xl font-semibold">
                                        Reps
                                    </Text>
                                    <Text className="text-lg text-gray-800">
                                        {progress.totalReps}
                                    </Text>
                                    {progress.totalRepsDiff > 0 ? (
                                        <Text className="text-green-600">
                                            ▲ {progress.totalRepsDiff}
                                        </Text>
                                    ) : progress.totalRepsDiff < 0 ? (
                                        <Text className="text-red-600">
                                            ▼ {Math.abs(progress.totalRepsDiff)}
                                        </Text>
                                    ) : (
                                        <Text className="text-gray-500">–</Text>
                                    )}
                                </View>

                                <View>
                                    <Text className="text-xl font-semibold">
                                        Volume
                                    </Text>
                                    <Text className="text-lg text-gray-800">
                                        {progress.volume}kg
                                    </Text>
                                    {progress.volumeDiff > 0 ? (
                                        <Text className="text-green-600">
                                            ▲ {progress.volumeDiff}kg
                                        </Text>
                                    ) : progress.volumeDiff < 0 ? (
                                        <Text className="text-red-600">
                                            ▼ {Math.abs(progress.volumeDiff)}kg
                                        </Text>
                                    ) : (
                                        <Text className="text-gray-500">–</Text>
                                    )}
                                </View>

                                <View>
                                    <Text className="text-xl font-semibold">
                                        Kg/Rep
                                    </Text>
                                    <Text className="text-lg text-gray-800">
                                        {progress.kgPerRep}
                                    </Text>
                                    {progress.kgPerRepDiff > 0 ? (
                                        <Text className="text-green-600">
                                            ▲ {progress.kgPerRepDiff}
                                        </Text>
                                    ) : progress.kgPerRepDiff < 0 ? (
                                        <Text className="text-red-600">
                                            ▼ {Math.abs(progress.kgPerRepDiff)}
                                        </Text>
                                    ) : (
                                        <Text className="text-gray-500">–</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ) : null
                }
                data={workoutSession}
                renderItem={({ item }) => (
                    <View className="">
                        <Text className="text-2xl mb-1 mt-4 font-medium">
                            {dayjs(item.start_time).format("D MMM")}
                        </Text>

                        {/* Displaying a fallback message if no set logs */}
                        {item.set_logs.length > 0 ? (
                            <FlatList
                                className="gap-3 rounded-xl p-2 bg-gray-100"
                                data={[...item.set_logs].reverse()}
                                renderItem={({ item: setLogItem }) => (
                                    <Link
                                        href={`/exercise/setLog/${setLogItem.set_log_id}?exercise_name=${encodeURIComponent(exercise.name)}`}
                                        asChild
                                    >
                                        <Pressable className="p-2 flex-row justify-between">
                                            <Text className="text-2xl">
                                                {setLogItem.reps} Reps
                                            </Text>
                                            <Text className="text-2xl">
                                                {setLogItem.weight} Kg
                                            </Text>
                                        </Pressable>
                                    </Link>
                                )}
                            />
                        ) : (
                            <Text>No set logs for this session</Text>
                        )}
                    </View>
                )}
            />

            <View className="gap-3">
                <FinishButton />

                <Pressable
                    onPress={() => {
                        setSetLogModalVisible(true);
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
            </View>

            {/* SetLog modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={setLogmodalVisible}
            >
                <Pressable
                    onPress={() => setSetLogModalVisible(false)}
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
                                onPress={() => setSetLogModalVisible(true)}
                                className="bg-white p-6 rounded-lg w-full"
                            >
                                <View className="flex-row justify-between">
                                    <View className="w-1/3 justify-end">
                                        <Text className="text-2xl mb-1">
                                            Reps
                                        </Text>
                                        <TextInput
                                            value={reps}
                                            onChangeText={(text) =>
                                                setReps(text)
                                            }
                                            placeholder="Reps"
                                            keyboardType="number-pad"
                                            placeholderTextColor="gray"
                                            className="mb-4 p-3 rounded-lg bg-gray-200"
                                        />
                                    </View>
                                    <View className="w-1/3">
                                        <Text className="text-2xl mb-1">
                                            Weight
                                        </Text>
                                        <TextInput
                                            value={weight}
                                            onChangeText={(text) =>
                                                setWeight(text)
                                            }
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
                                        onPress={() =>
                                            setSetLogModalVisible(false)
                                        }
                                    >
                                        <Text className="text-xl">Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() => {
                                            // fetchWorkoutSession();
                                            handleNewSetLogSession();
                                            setSetLogModalVisible(false);
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

            {/* RestTime modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={exerciseModalVisible}
            >
                <Pressable
                    onPress={() => setExerciseModalVisible(false)}
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
                                onPress={() => setExerciseModalVisible(true)}
                                className="bg-white p-6 rounded-lg w-full"
                            >
                                <View className="flex-row justify-between">
                                    <View className="w-1/3 justify-end">
                                        <Text className="text-2xl mb-1">
                                            Rest Time
                                        </Text>
                                        <TextInput
                                            value={restTime?.toString() || ""}
                                            onChangeText={(text) =>
                                                setRestTime(text)
                                            }
                                            placeholder="Rest Time"
                                            keyboardType="number-pad"
                                            placeholderTextColor="gray"
                                            className="mb-4 p-3 rounded-lg bg-gray-200"
                                        />
                                    </View>
                                </View>

                                <View className="flex-row justify-between">
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() =>
                                            setExerciseModalVisible(false)
                                        }
                                    >
                                        <Text className="text-xl">Cancel</Text>
                                    </Pressable>
                                    <Pressable
                                        className="p-3 px-4 rounded-lg bg-gray-200"
                                        onPress={() => {
                                            updateRestTime();
                                            setExerciseModalVisible(false);
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
