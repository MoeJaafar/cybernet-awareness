"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { startBgMusic } from "@/components/BgMusic";
import { getMusicVolume } from "@/lib/audio-settings";

/**
 * Entrance, CyberNet splash. First thing every visitor sees.
 * Tap to begin starts background music and routes to consent.
 */
export default function Home() {
    const router = useRouter();

    const handleTap = () => {
        startBgMusic("/audio/bg-music.mp3", getMusicVolume());
        router.push("/consent");
    };

    return (
        <button
            type="button"
            onClick={handleTap}
            className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 relative cursor-pointer group text-center"
            aria-label="Begin"
        >
            <div className="max-w-2xl w-full flex flex-col items-center gap-8">
                <motion.div
                    className="flex items-center gap-3 type-mono text-[color:var(--color-bone-muted)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9 }}
                >
                    <span className="h-px w-10 bg-[color:var(--color-bone-ghost)]"></span>
                    <span>a cybersecurity awareness game</span>
                    <span className="h-px w-10 bg-[color:var(--color-bone-ghost)]"></span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                    className="type-display logo-cycle text-[56px] sm:text-[110px] lg:text-[140px] leading-[0.9] tracking-tight"
                >
                    CyberNet
                </motion.h1>

                <motion.span
                    aria-hidden
                    className="block h-px w-24 bg-[color:var(--color-amber)]/60"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />

                <motion.p
                    className="type-body text-[color:var(--color-bone-dim)] text-[16px] sm:text-[24px] leading-relaxed max-w-xl"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.9 }}
                >
                    Five short scenarios. A phishing email, a suspicious call,
                    a USB on the floor. You make the choices, and each outcome
                    shows you what an attacker would have done with the one you
                    picked.
                </motion.p>

                <motion.div
                    className="flex items-center gap-4 type-mono text-[color:var(--color-bone-muted)] pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 1.2 }}
                >
                    <span>5 scenarios</span>
                    <span aria-hidden>·</span>
                    <span>~20 minutes</span>
                    <span aria-hidden>·</span>
                    <span>audio on</span>
                </motion.div>

                <motion.div
                    className="flex items-center gap-3 pt-10 group-hover:text-[color:var(--color-amber)] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 1.6 }}
                >
                    <span
                        className="type-mono"
                        style={{ animation: "pulse-dot 2.2s ease-in-out infinite" }}
                    >
                        tap to begin
                    </span>
                    <span aria-hidden className="type-mono">↵</span>
                </motion.div>
            </div>
        </button>
    );
}
