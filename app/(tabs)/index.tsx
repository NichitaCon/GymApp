import { Stack } from "expo-router";
import { FlatList } from "react-native";

import RoutineListItem from "~/components/RoutineListItem";
import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthProvider";

export default function Events() {
    const [routines, setRoutines] = useState([]);
    const {session} = useAuth();
    // console.log("id = ",id);
    // console.log("session user = ", session.user.id)
    // console.log(useAuth())

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        const { data, error } = await supabase
            .from("routines")
            .select("*")
            .eq("user_id", session.user.id);
        setRoutines(data);
    };
    return (
        <>
            <Stack.Screen options={{ title: "Events" }} />

            <FlatList
                className="bg-white p-5"
                data={routines}
                renderItem={({ item }) => <RoutineListItem routine={item} />}
            />
        </>
    );
}
