"use client";

import { motion } from "motion/react";
import type { SceneId } from "@/lib/types";

/**
 * Password picker. Shows four candidate passwords representing common
 * misconceptions (leet substitution, short random, name+year) vs the
 * correct pick (long passphrase). Each tap submits the choice and
 * maps it to a specific outcome, so every participant encounters
 * every lesson regardless of what they would personally choose.
 */

export interface PasswordBuilderResult {
    password: string;
}

interface Choice {
    password: string;
    caption: string;
    hint: string;
}

const CHOICES: Choice[] = [
    {
        password: "Tr0ub4d0r&3",
        caption: "11 characters, symbol substitutions",
        hint: "mix of letters, digits, and a symbol",
    },
    {
        password: "sunset-piano-bicycle",
        caption: "20 characters, three plain words",
        hint: "a passphrase separated by hyphens",
    },
    {
        password: "aX9$kL2!",
        caption: "8 characters, fully random",
        hint: "short but unpredictable",
    },
    {
        password: "Jessica1987!",
        caption: "12 characters, name + year + symbol",
        hint: "personal detail plus a year",
    },
];

export function PasswordBuilder({
    header,
    caption,
    onSubmit,
}: {
    header: string;
    caption?: string;
    onSubmit: (result: PasswordBuilderResult) => void;
}) {
    return (
        <div
            className="border border-[color:var(--gmail-border)] bg-[color:var(--gmail-bg)] rounded-lg overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
            style={{ fontFamily: "var(--font-gmail)" }}
        >
            {/* System banner. */}
            <div className="px-5 py-3 bg-[color:var(--color-signal-red)]/12 border-b border-[color:var(--color-signal-red)]/40 flex items-center gap-3">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[color:var(--color-signal-red)] shrink-0"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-[color:var(--color-signal-red)]">
                    {header}
                </p>
            </div>

            <div className="px-5 sm:px-7 py-6 sm:py-8 flex flex-col gap-6">
                <div>
                    <h3 className="text-xl text-[color:var(--gmail-text)] font-medium mb-1">
                        Which password would you use?
                    </h3>
                    {caption && (
                        <p className="text-sm text-[color:var(--gmail-text-dim)]">
                            {caption}
                        </p>
                    )}
                </div>

                <div
                    role="group"
                    aria-label="Password options"
                    className="flex flex-col gap-2"
                >
                    {CHOICES.map((c, i) => (
                        <motion.button
                            key={c.password}
                            type="button"
                            onClick={() => onSubmit({ password: c.password })}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.07 }}
                            className="group text-left border border-[color:var(--gmail-border)] hover:border-[color:var(--color-amber)] bg-[color:var(--gmail-panel)] hover:bg-[color:var(--color-ink-higher)] px-4 py-3 sm:px-5 sm:py-4 transition-all flex items-center gap-4"
                        >
                            <span className="type-display text-lg sm:text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors w-5 shrink-0">
                                {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1 flex flex-col gap-1">
                                <code
                                    className="font-mono text-[16px] sm:text-[18px] text-[color:var(--gmail-text)] leading-tight break-all"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {c.password}
                                </code>
                                <span className="text-[12px] text-[color:var(--gmail-text-dim)]">
                                    {c.caption}
                                </span>
                            </span>
                            <span
                                aria-hidden
                                className="type-mono text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors translate-x-[-4px] group-hover:translate-x-0 duration-300 hidden sm:inline"
                            >
                                →
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Route the picked password to its outcome scene. Deterministic
 * lookup based on the four known candidates so every session maps
 * cleanly onto the scenario's outcome set.
 */
export function evaluatePassword(
    result: PasswordBuilderResult,
): SceneId {
    switch (result.password) {
        case "Tr0ub4d0r&3":
            return "outcome-common-pattern";
        case "sunset-piano-bicycle":
            return "outcome-fortress";
        case "aX9$kL2!":
            return "outcome-medium";
        case "Jessica1987!":
            return "outcome-common-pattern";
        default:
            return "outcome-medium";
    }
}
