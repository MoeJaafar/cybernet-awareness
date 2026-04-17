"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { getSupabase } from "./supabase";

const STORAGE_KEY = "cybernet_session_id";

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

    // Restore session from localStorage on mount.
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            idRef.current = stored;
            setSessionId(stored);
        }
    }, []);

    const startSession = useCallback(async (): Promise<string> => {
        if (idRef.current) return idRef.current;
        const sb = getSupabase();
        if (!sb) throw new Error("Supabase not configured");
        const { data, error } = await sb
            .from("sessions")
            .insert({})
            .select("id")
            .single();
        if (error || !data)
            throw new Error(error?.message ?? "session insert failed");
        idRef.current = data.id;
        setSessionId(data.id);
        localStorage.setItem(STORAGE_KEY, data.id);
        return data.id;
    }, []);

    const logEvent = useCallback(
        (type: string, payload?: Record<string, unknown>) => {
            const sid = idRef.current;
            if (!sid) {
                console.warn(
                    `[session] logEvent("${type}") called without an active session; event dropped`,
                );
                return;
            }
            fetch("/api/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: sid, type, payload }),
            })
                .then((r) => {
                    if (!r.ok) {
                        console.warn(
                            `[session] event "${type}" failed: ${r.status}`,
                        );
                    }
                })
                .catch((err) => {
                    console.warn(`[session] event "${type}" network error`, err);
                });
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
