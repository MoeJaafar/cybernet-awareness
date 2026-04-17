"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/session";

export default function ConsentPage() {
    const router = useRouter();
    const { startSession, logEvent } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAgree = async () => {
        if (submitting) return;
        setSubmitting(true);
        setError(null);
        try {
            await startSession();
            logEvent("consent");
            router.push("/briefing");
        } catch (err) {
            setSubmitting(false);
            setError(
                "Something went wrong starting the session. Check your internet and try again.",
            );
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full flex flex-col gap-8"
            >
                <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[color:var(--color-amber)]" />
                    <span className="type-mono text-[color:var(--color-amber)]">
                        informed consent
                    </span>
                </div>

                <h1 className="type-display text-[color:var(--color-bone)] text-[36px] sm:text-[48px] leading-tight">
                    Before we begin
                </h1>

                <div className="type-body text-[color:var(--color-bone-dim)] text-[18px] leading-relaxed flex flex-col gap-4">
                    <p>
                        You are about to play a short cybersecurity awareness
                        game as part of a bachelor&rsquo;s thesis study. The
                        session takes approximately 20 minutes.
                    </p>
                    <p>
                        You will answer a brief knowledge quiz, play through
                        five interactive scenarios, answer the same quiz again,
                        and complete a short feedback survey. No directly
                        identifying information (name, email, IP address) is
                        collected. Each session is linked only by a random
                        identifier so pre- and post-test answers can be paired
                        for analysis.
                    </p>
                    <p>
                        Participation is voluntary. You may stop at any time by
                        closing the browser tab; partial data collected up to
                        that point may be retained for analysis. Because
                        sessions are anonymous, data cannot be retrieved or
                        deleted after submission. Data will be stored for up to
                        two years after thesis submission, used for academic
                        analysis only, and not shared with third parties.
                    </p>
                    <p>
                        Questions about the study can be sent to&nbsp;
                        <a
                            href="mailto:m.jaafar@innopolis.university"
                            className="text-[color:var(--color-amber)] underline underline-offset-2 hover:brightness-110"
                        >
                            m.jaafar@innopolis.university
                        </a>
                        .
                    </p>
                </div>

                <div className="border-t border-[color:var(--color-edge-subtle)] pt-6 flex flex-col gap-4">
                    <p className="type-body text-[color:var(--color-bone)] text-[18px]">
                        By clicking below, you confirm that you have read the
                        above and agree to participate.
                    </p>
                    <button
                        type="button"
                        onClick={handleAgree}
                        disabled={submitting}
                        aria-busy={submitting}
                        className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-60 disabled:cursor-wait"
                    >
                        {submitting ? "Starting…" : "I agree, begin"}
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                    {error && (
                        <p className="type-mono text-[color:var(--color-signal-red)] text-sm">
                            {error}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
