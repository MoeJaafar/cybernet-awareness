"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { listScenarios } from "@/lib/scenarios";
import { BootSequence } from "@/components/BootSequence";

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
        <main className="min-h-screen px-6 sm:px-12 lg:px-20 pt-12 pb-24">
            {/* Shift header — slim, mono. */}
            <motion.div
                className="flex items-baseline justify-between border-b border-[color:var(--color-edge-subtle)] pb-4 mb-16"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3">
                    <span className="relative inline-flex">
                        <span className="h-2 w-2 rounded-full bg-[color:var(--color-amber)] dot-live"></span>
                        <span className="absolute inset-0 h-2 w-2 rounded-full bg-[color:var(--color-amber)] blur-[3px] opacity-80"></span>
                    </span>
                    <span className="type-mono text-[color:var(--color-amber)]">
                        on duty · shift 01
                    </span>
                </div>
                <span className="type-mono text-[color:var(--color-bone-ghost)]">
                    09:12 · riverside.edu
                </span>
            </motion.div>

            {/* LIVE CASE — takes the full width, pulses. */}
            <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="h-px w-6 bg-[color:var(--color-signal-red)]"></span>
                    <span className="type-mono text-[color:var(--color-signal-red)]">
                        incoming · priority
                    </span>
                </div>

                <Link
                    href={`/scenario/${first.id}`}
                    className="group block border-l-2 border-[color:var(--color-signal-red)] pl-8 sm:pl-12 py-4 hover:pl-10 sm:hover:pl-14 transition-[padding] duration-500 ease-out"
                >
                    <div className="flex items-baseline gap-5 mb-5">
                        <span className="type-mono text-[color:var(--color-signal-red)]">
                            case · 001
                        </span>
                        <span className="h-px flex-1 bg-[color:var(--color-edge-subtle)] max-w-[160px]"></span>
                        <span className="type-mono text-[color:var(--color-signal-red)] amber-flicker">
                            unread
                        </span>
                    </div>

                    <h2 className="type-display text-[44px] sm:text-[68px] lg:text-[88px] leading-[0.98] text-[color:var(--color-bone)] group-hover:text-[color:var(--color-amber)] transition-colors duration-300 max-w-4xl">
                        {first.title}
                    </h2>

                    <p className="type-body text-base sm:text-lg text-[color:var(--color-bone-dim)] mt-5 max-w-2xl leading-relaxed">
                        {first.concept}
                    </p>

                    <div className="mt-8 flex items-center gap-3 text-[color:var(--color-bone-muted)] group-hover:text-[color:var(--color-amber)] transition-colors">
                        <span className="type-mono">open case file</span>
                        <span
                            aria-hidden
                            className="h-px w-10 bg-current group-hover:w-24 transition-[width] duration-500 ease-out"
                        ></span>
                    </div>
                </Link>
            </motion.section>

            {/* REST OF QUEUE — sealed / locked. */}
            {rest.length > 0 && (
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <span className="type-mono">in the queue</span>
                        <span className="h-px flex-1 bg-[color:var(--color-edge-subtle)]"></span>
                        <span className="type-mono text-[color:var(--color-bone-ghost)]">
                            {rest.length.toString().padStart(2, "0")} sealed
                        </span>
                    </div>

                    <ul>
                        {rest.map((s, i) => (
                            <motion.li
                                key={s.id}
                                className="border-t border-[color:var(--color-edge-subtle)] last:border-b"
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.75 + i * 0.08,
                                }}
                            >
                                <div className="py-5 grid grid-cols-[auto_1fr_auto] items-center gap-6 opacity-55">
                                    <span className="type-mono text-[color:var(--color-bone-ghost)] w-16">
                                        · {String(i + 2).padStart(3, "0")}
                                    </span>
                                    <span className="type-display-italic text-[color:var(--color-bone-muted)] text-lg sm:text-xl">
                                        to be briefed
                                    </span>
                                    <span className="type-mono text-[color:var(--color-bone-ghost)]">
                                        sealed
                                    </span>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </motion.section>
            )}

            <motion.footer
                className="mt-24 pt-8 border-t border-[color:var(--color-edge-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
            >
                <span className="type-mono text-[color:var(--color-bone-ghost)]">
                    master&apos;s thesis prototype · 2026
                </span>
                <span className="type-display-italic text-sm text-[color:var(--color-bone-ghost)]">
                    &ldquo;the human is always the last firewall.&rdquo;
                </span>
            </motion.footer>
        </main>
    );
}
