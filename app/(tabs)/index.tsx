import { Stack } from "expo-router";
import { FlatList } from "react-native";

import RoutineListItem from "~/components/RoutineListItem";
import { supabase } from "~/utils/supabase";
import { useEffect, useState } from "react";

export default function Events() {
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        const { data, error } = await supabase
            .from("routines")
            .select("*");
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
