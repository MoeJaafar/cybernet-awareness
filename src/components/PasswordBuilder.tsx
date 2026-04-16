"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SceneId } from "@/lib/types";

/**
 * Interactive password fortress builder. The player picks "bricks"
 * from ingredient categories to construct a password. A visual wall
 * grows as the password lengthens. When they're satisfied they hit
 * "set password" and the scenario evaluates what they built.
 *
 * No strength labels or hints are shown BEFORE submission. The
 * fortress visual only shows height / quantity, not quality — the
 * feedback comes in the outcome narrative.
 */

interface Brick {
    label: string;
    value: string;
    category: "common" | "word" | "number" | "symbol" | "modifier";
}

const BRICKS: Brick[] = [
    // Common words (weak bricks — recognizable patterns)
    { label: "password", value: "password", category: "common" },
    { label: "admin", value: "admin", category: "common" },
    { label: "summer", value: "summer", category: "common" },
    { label: "welcome", value: "welcome", category: "common" },
    // Random words (strong bricks — length + memorability)
    { label: "horse", value: "horse", category: "word" },
    { label: "rain", value: "rain", category: "word" },
    { label: "camera", value: "camera", category: "word" },
    { label: "thursday", value: "thursday", category: "word" },
    { label: "blanket", value: "blanket", category: "word" },
    { label: "river", value: "river", category: "word" },
    // Numbers
    { label: "1", value: "1", category: "number" },
    { label: "123", value: "123", category: "number" },
    { label: "2025", value: "2025", category: "number" },
    // Symbols
    { label: "!", value: "!", category: "symbol" },
    { label: "@", value: "@", category: "symbol" },
    { label: "#", value: "#", category: "symbol" },
    // Modifiers
    { label: "Capitalize", value: "CAPITALIZE", category: "modifier" },
];

const CATEGORY_LABELS: Record<Brick["category"], string> = {
    common: "common words",
    word: "random words",
    number: "numbers",
    symbol: "symbols",
    modifier: "modifiers",
};

const CATEGORY_ORDER: Brick["category"][] = [
    "common",
    "word",
    "number",
    "symbol",
    "modifier",
];

export interface PasswordBuilderResult {
    password: string;
    bricksUsed: string[];
}

export function PasswordBuilder({
    header,
    caption,
    onSubmit,
}: {
    header: string;
    caption?: string;
    onSubmit: (result: PasswordBuilderResult) => void;
}) {
    const [parts, setParts] = useState<string[]>([]);
    const password = parts.join("");

    const addBrick = (brick: Brick) => {
        if (brick.value === "CAPITALIZE" && parts.length > 0) {
            setParts((p) => {
                const copy = [...p];
                const last = copy[copy.length - 1];
                copy[copy.length - 1] =
                    last.charAt(0).toUpperCase() + last.slice(1);
                return copy;
            });
            return;
        }
        if (brick.value !== "CAPITALIZE") {
            setParts((p) => [...p, brick.value]);
        }
    };

    const removeLast = () => setParts((p) => p.slice(0, -1));
    const clear = () => setParts([]);

    const wallHeight = Math.min(password.length * 4, 100);

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

            <div className="px-5 sm:px-7 py-6 flex flex-col gap-6">
                <div>
                    <h3 className="text-lg text-[color:var(--gmail-text)] font-medium mb-1">
                        Build your password
                    </h3>
                    {caption && (
                        <p className="text-sm text-[color:var(--gmail-text-dim)]">
                            {caption}
                        </p>
                    )}
                </div>

                {/* Password field + fortress wall. */}
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-[11px] uppercase tracking-widest text-[color:var(--gmail-text-dim)] block mb-2">
                            your password
                        </label>
                        <div className="border border-[color:var(--gmail-border)] bg-[color:var(--gmail-panel)] px-4 py-3 min-h-[48px] font-mono text-[16px] text-[color:var(--gmail-text)] flex items-center gap-1 flex-wrap">
                            <AnimatePresence>
                                {parts.map((part, i) => (
                                    <motion.span
                                        key={`${i}-${part}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-block bg-[color:var(--color-amber)]/10 border border-[color:var(--color-amber)]/30 px-1.5 py-0.5 text-[14px]"
                                    >
                                        {part}
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            {parts.length === 0 && (
                                <span className="text-[color:var(--gmail-text-dim)] text-sm italic">
                                    click bricks below to build...
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-[color:var(--gmail-text-dim)]">
                                {password.length} characters · {parts.length}{" "}
                                {parts.length === 1 ? "brick" : "bricks"}
                            </span>
                            {parts.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={removeLast}
                                        className="text-xs text-[color:var(--gmail-text-dim)] hover:text-[color:var(--color-amber)] transition-colors"
                                    >
                                        undo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clear}
                                        className="text-xs text-[color:var(--gmail-text-dim)] hover:text-[color:var(--color-signal-red)] transition-colors"
                                    >
                                        clear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fortress wall visual — grows with password length. */}
                    <div className="w-16 h-28 flex flex-col-reverse border border-[color:var(--gmail-border)] bg-[color:var(--gmail-panel)] overflow-hidden shrink-0">
                        <motion.div
                            className="w-full bg-[color:var(--color-amber)]/40"
                            animate={{ height: `${wallHeight}%` }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        />
                    </div>
                </div>

                {/* Brick categories. */}
                <div className="flex flex-col gap-3">
                    {CATEGORY_ORDER.map((cat) => {
                        const bricks = BRICKS.filter((b) => b.category === cat);
                        return (
                            <div key={cat}>
                                <p className="text-[10px] uppercase tracking-widest text-[color:var(--gmail-text-dim)] mb-1.5">
                                    {CATEGORY_LABELS[cat]}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {bricks.map((b) => (
                                        <button
                                            key={b.value}
                                            type="button"
                                            onClick={() => addBrick(b)}
                                            className="px-3 py-1.5 text-sm border border-[color:var(--gmail-border)] bg-[color:var(--gmail-panel)] hover:border-[color:var(--color-amber)] hover:bg-[color:var(--gmail-hover)] text-[color:var(--gmail-text)] transition-colors"
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Submit. */}
                <button
                    type="button"
                    disabled={password.length === 0}
                    onClick={() =>
                        onSubmit({
                            password,
                            bricksUsed: parts,
                        })
                    }
                    className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3 text-base font-medium hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Set password →
                </button>
            </div>
        </div>
    );
}

/**
 * Evaluate a built password and return a scene ID for the matching
 * outcome. Called by the scenario runner after submission.
 */
export function evaluatePassword(result: PasswordBuilderResult): SceneId {
    const { password, bricksUsed } = result;
    const commonWords = ["password", "admin", "summer", "welcome", "123", "1", "2025"];
    const allCommon = bricksUsed.every((b) =>
        commonWords.includes(b.toLowerCase()),
    );

    if (password.length < 8) return "outcome-too-short";
    if (allCommon) return "outcome-common-pattern";
    if (password.length < 14) return "outcome-medium";
    return "outcome-fortress";
}
