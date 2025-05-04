// store/sessionStore.ts
import { create } from "zustand";
import { supabase } from "~/utils/supabase";

interface SessionState {
    sessionId: string | null;
    startSession: (userId: string, routineId: string) => Promise<string>;
    endSession: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,

    startSession: async (userId: string, routineId: string) => {
        // check for existing incomplete session
        const { data: existingSessions, error: fetchError } = await supabase
            .from("workout_sessions")
            .select("session_id")
            .eq("user_id", userId)
            .eq("completed", false)
            .limit(1);

        if (fetchError) {
            console.error("Error fetching workout sessions:", fetchError);
            return "";
        }

        if (existingSessions.length > 0) {
            set({ sessionId: existingSessions[0].session_id });
            console.log(
                "using old session, session id =",
                existingSessions[0].session_id,
            );
            return existingSessions[0].session_id;
        }

        // create a new one
        const { data: newSession, error: insertError } = await supabase
            .from("workout_sessions")
            .insert([
                {
                    user_id: userId,
                    routine_id: routineId,
                    end_time: null,
                    notes: null,
                    completed: false,
                },
            ])
            .select("session_id")
            .single();

        if (insertError) {
            console.error("Error creating workout session:", insertError);
            return "";
        }

        console.log(
            "creating new session, session id - ",
            newSession.session_id,
        );
        set({ sessionId: newSession.session_id });
        return newSession.session_id;
    },

    endSession: async () => {
        const { data: finishSessionData, error: finishSessionErr } =
        await supabase
        .from("workout_sessions")
        .update({ completed: true, end_time: new Date() })
        .eq("user_id", user.id)
        .eq("completed", false); // only update incomplete sessions
        console.log("finishworkoutsession called");
        console.log(finishSessionData);
        console.log("workoutsession table: UPDATE", finishSessionData);

        if (finishSessionErr) {
            console.warn("setLog error = ", finishSessionErr);
            return;
        } else {
        }
        set({ sessionId: null });
    },
}));
