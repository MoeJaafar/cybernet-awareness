"use client";

import { motion } from "motion/react";

/**
 * Opening title card. Plays once when the user first lands on the
 * page. Click or key press hands off to the boot sequence.
 */
export function TitleScreen({ onBegin }: { onBegin: () => void }) {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 cursor-pointer select-none"
            onClick={onBegin}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onBegin();
            }}
            role="button"
            tabIndex={0}
        >
            <motion.div
                className="text-center flex flex-col items-center gap-12"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.35 } },
                }}
            >
                <motion.p
                    className="type-mono text-base text-[color:var(--color-bone-muted)]"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.8 } },
                    }}
                >
                    a cybersecurity awareness experience
                </motion.p>

                <motion.h1
                    className="type-display text-[72px] sm:text-[120px] lg:text-[172px] leading-[0.9] text-[color:var(--color-bone)] tracking-tight"
                    variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 1.1, ease: [0.2, 0.7, 0.2, 1] },
                        },
                    }}
                >
                    Cyber<span className="type-display-italic text-[color:var(--color-amber)] amber-flicker">Net</span>
                </motion.h1>

                <motion.p
                    className="type-body text-lg sm:text-2xl text-[color:var(--color-bone-dim)] max-w-2xl leading-relaxed italic"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.9 } },
                    }}
                >
                    five attacks. five decisions. would you have spotted them?
                </motion.p>

                <motion.div
                    className="flex flex-col items-center gap-3 mt-8"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { duration: 0.8, delay: 0.4 },
                        },
                    }}
                >
                    <span
                        aria-hidden
                        className="type-mono text-base text-[color:var(--color-amber)]"
                        style={{ animation: "pulse-dot 1.8s ease-in-out infinite" }}
                    >
                        click anywhere to begin
                    </span>
                    <span className="type-mono text-[color:var(--color-bone-ghost)]">
                        ≈ 5 minutes · headphones recommended
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
}
