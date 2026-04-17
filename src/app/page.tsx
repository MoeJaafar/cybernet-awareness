"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSession } from "@/lib/session";
import { startBgMusic } from "@/components/BgMusic";
import { getMusicVolume } from "@/lib/audio-settings";

/**
 * Landing page = informed consent. Every participant starts here.
 * Agreeing creates a Supabase session and advances to the pre-test.
 */
export default function Home() {
    const router = useRouter();
    const { startSession, logEvent } = useSession();

    const handleAgree = async () => {
        startBgMusic("/audio/bg-music.mp3", getMusicVolume());
        await startSession();
        logEvent("consent");
        router.push("/pretest");
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
                        game as part of a bachelor&rsquo;s thesis research
                        study. The session takes approximately 20 minutes.
                    </p>
                    <p>
                        You will answer a brief knowledge quiz, play through
                        five interactive scenarios, answer the same quiz again,
                        and complete a short feedback survey. Your responses are
                        recorded anonymously — no names, emails, or identifying
                        information are collected.
                    </p>
                    <p>
                        Participation is voluntary. You may stop at any time by
                        closing the browser tab. Your data will only be used for
                        academic analysis in the thesis and will not be shared
                        with third parties.
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
                        className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        I agree — begin
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
