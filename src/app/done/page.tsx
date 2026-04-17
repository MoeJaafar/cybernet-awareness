"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useSession } from "@/lib/session";

const STORAGE_KEY = "cybernet_session_id";

export default function DonePage() {
    const { logEvent } = useSession();

    useEffect(() => {
        logEvent("session_end");
        localStorage.removeItem(STORAGE_KEY);
    }, [logEvent]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl flex flex-col items-center gap-8"
            >
                <span className="type-mono text-[color:var(--color-amber)]">
                    session complete
                </span>

                <h1 className="type-display text-[color:var(--color-bone)] text-[48px] sm:text-[64px] leading-tight">
                    Thank you.
                </h1>

                <p className="type-body text-[color:var(--color-bone-dim)] text-[20px] leading-relaxed max-w-md">
                    Your responses have been recorded anonymously and will be
                    used for academic analysis only. You may now close this tab.
                </p>

                <span
                    className="h-px w-24 bg-[color:var(--color-amber)]/60"
                    aria-hidden
                />

                <p className="type-mono text-[color:var(--color-bone-muted)]">
                    CyberNet — a cybersecurity awareness game
                </p>
            </motion.div>
        </div>
    );
}
