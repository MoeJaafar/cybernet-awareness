"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "cybernet_session_id";

/**
 * Redirects to the consent page if no active session exists.
 * Call at the top of any page that requires a session
 * (pretest, play, scenarios, posttest, survey).
 */
export function useRequireSession() {
    const router = useRouter();
    useEffect(() => {
        const sid = localStorage.getItem(STORAGE_KEY);
        if (!sid) {
            router.replace("/");
        }
    }, [router]);
}
