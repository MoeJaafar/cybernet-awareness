"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { listScenarios } from "@/lib/scenarios";
import { BootSequence } from "@/components/BootSequence";
// (StatusBar deliberately omitted from the landing — the page IS the
//  day, so a header bar would just be duplicate chrome.)

export default function Home() {
    const scenarios = listScenarios();
    const [booted, setBooted] = useState(false);

    if (!booted) {
        return <BootSequence onDone={() => setBooted(true)} />;
    }

    return <Queue scenarios={scenarios} />;
}

function Queue({
    scenarios,
}: {
    scenarios: ReturnType<typeof listScenarios>;
}) {
    const first = scenarios[0];
    const rest = scenarios.slice(1);

    return (
        <main className="min-h-screen px-6 pt-10 pb-24 flex flex-col items-center">
            {/* Day header. */}
            <motion.div
                className="w-full max-w-5xl flex items-baseline justify-between border-b border-[color:var(--color-edge-subtle)] pb-4 mb-20 sm:mb-28"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3">
                    <span className="relative inline-flex">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--color-amber)] dot-live"></span>
                        <span className="absolute inset-0 h-2 w-2 rounded-full bg-[color:var(--color-amber)] blur-[3px] opacity-80"></span>
                    </span>
                    <span className="type-mono text-base text-[color:var(--color-amber)]">
                        tuesday · today
                    </span>
                </div>
                <span className="type-mono text-base text-[color:var(--color-bone-ghost)]">
                    09:12 · riverside.edu
                </span>
            </motion.div>

            {/* FIRST THING WAITING FOR YOU — centered, huge. */}
            <motion.section
                className="w-full max-w-5xl text-center mb-24"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            >
                <div className="flex items-center justify-center gap-4 mb-10">
                    <span className="h-px w-10 bg-[color:var(--color-amber)]"></span>
                    <span className="type-mono text-base text-[color:var(--color-amber)] amber-flicker">
                        first thing in your inbox
                    </span>
                    <span className="h-px w-10 bg-[color:var(--color-amber)]"></span>
                </div>

                <Link
                    href={`/scenario/${first.id}`}
                    className="group block"
                >
                    <h2 className="type-display text-[56px] sm:text-[96px] lg:text-[128px] xl:text-[148px] leading-[0.95] text-[color:var(--color-bone)] group-hover:text-[color:var(--color-amber)] transition-colors duration-500">
                        {first.title}
                    </h2>

                    <p className="type-body text-lg sm:text-xl lg:text-2xl text-[color:var(--color-bone-dim)] mt-10 max-w-3xl mx-auto leading-relaxed">
                        {first.concept}
                    </p>

                    <div className="mt-14 flex items-center justify-center gap-4 text-[color:var(--color-bone-muted)] group-hover:text-[color:var(--color-amber)] transition-colors">
                        <span className="type-mono text-base">open it</span>
                        <span
                            aria-hidden
                            className="h-px w-12 bg-current group-hover:w-32 transition-[width] duration-500 ease-out"
                        ></span>
                    </div>
                </Link>
            </motion.section>

            {/* REST OF QUEUE — sealed / locked. Centered too. */}
            {rest.length > 0 && (
                <motion.section
                    className="w-full max-w-3xl text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <span className="h-px w-10 bg-[color:var(--color-edge-subtle)]"></span>
                        <span className="type-mono text-base">
                            still to come
                        </span>
                        <span className="h-px w-10 bg-[color:var(--color-edge-subtle)]"></span>
                    </div>

                    <ul className="flex flex-col gap-0">
                        {rest.map((s, i) => (
                            <motion.li
                                key={s.id}
                                className="border-t border-[color:var(--color-edge-subtle)] last:border-b py-6 opacity-55"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.55 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.75 + i * 0.08,
                                }}
                            >
                                <div className="flex items-center justify-center gap-6">
                                    <span className="type-mono text-base text-[color:var(--color-bone-ghost)]">
                                        · later today
                                    </span>
                                    <span className="type-display-italic text-xl sm:text-2xl text-[color:var(--color-bone-muted)]">
                                        {["a phone call", "a stranger's kindness", "the password form", "a friendly post"][i] ?? "to be written"}
                                    </span>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </motion.section>
            )}

            <motion.footer
                className="w-full max-w-5xl mt-28 pt-8 border-t border-[color:var(--color-edge-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
            >
                <span className="type-mono text-base text-[color:var(--color-bone-ghost)]">
                    master&apos;s thesis prototype · 2026
                </span>
                <span className="type-display-italic text-base text-[color:var(--color-bone-ghost)]">
                    &ldquo;the human is always the last firewall.&rdquo;
                </span>
            </motion.footer>
        </main>
    );
}
