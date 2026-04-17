"use client";

import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { getSupabase } from "./supabase";

/**
 * Study session context. A session is created on /consent and its ID
 * threads through the entire play-through so every event (pretest
 * answers, in-game choices, posttest answers, survey) links back to
 * one participant.
 */

type SessionCtx = {
    sessionId: string | null;
    startSession: () => Promise<string>;
    logEvent: (type: string, payload?: Record<string, unknown>) => void;
};

const Ctx = createContext<SessionCtx>({
    sessionId: null,
    startSession: async () => "",
    logEvent: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const idRef = useRef<string | null>(null);

    const startSession = useCallback(async (): Promise<string> => {
        if (idRef.current) return idRef.current;
        const sb = getSupabase();
        if (!sb) throw new Error("Supabase not configured");
        const { data, error } = await sb
            .from("sessions")
            .insert({})
            .select("id")
            .single();
        if (error || !data) throw new Error(error?.message ?? "session insert failed");
        idRef.current = data.id;
        setSessionId(data.id);
        return data.id;
    }, []);

    const logEvent = useCallback(
        (type: string, payload?: Record<string, unknown>) => {
            const sid = idRef.current;
            if (!sid) return;
            fetch("/api/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: sid, type, payload }),
            }).catch(() => {});
        },
        [],
    );

    return (
        <Ctx.Provider value={{ sessionId, startSession, logEvent }}>
            {children}
        </Ctx.Provider>
    );
}

export function useSession() {
    return useContext(Ctx);
}
