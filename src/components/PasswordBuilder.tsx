"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import type { SceneId } from "@/lib/types";

/**
 * Interactive password fortress — the player types freely into a real
 * input. A fortress wall reacts in real time: it grows with length,
 * shifts color with estimated crack time, and a live "time to crack"
 * counter updates on every keystroke. No "weak / strong" labels — the
 * wall and the number speak for themselves.
 */

export interface PasswordBuilderResult {
    password: string;
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
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const stats = analyzePassword(password);

    return (
        <div
            className="border border-[color:var(--gmail-border)] bg-[color:var(--gmail-bg)] rounded-lg overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
            style={{ fontFamily: "var(--font-gmail)" }}
        >
            {/* System banner. */}
            <div className="px-5 py-3 bg-[color:var(--color-signal-red)]/12 border-b border-[color:var(--color-signal-red)]/40 flex items-center gap-3">
                <svg
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
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
                        Create a new password
                    </h3>
                    {caption && (
                        <p className="text-sm text-[color:var(--gmail-text-dim)]">
                            {caption}
                        </p>
                    )}
                </div>

                {/* Input field. */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center border border-[color:var(--gmail-border)] bg-[color:var(--gmail-panel)] focus-within:border-[color:var(--color-amber)] transition-colors">
                        <input
                            ref={inputRef}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Start typing your password..."
                            className="flex-1 bg-transparent px-4 py-3 font-mono text-[16px] text-[color:var(--gmail-text)] outline-none placeholder:text-[color:var(--gmail-text-dim)]/50"
                            autoComplete="off"
                            spellCheck={false}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-3 text-[color:var(--gmail-text-dim)] hover:text-[color:var(--gmail-text)] transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[color:var(--gmail-text-dim)]">
                        <span>{password.length} characters</span>
                    </div>
                </div>

                {/* Fortress visualization + crack time. */}
                {password.length > 0 && (
                    <motion.div
                        className="flex items-end gap-6"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Fortress wall. */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-32 flex flex-col-reverse border border-[color:var(--gmail-border)] bg-[color:var(--gmail-panel)] overflow-hidden relative">
                                <motion.div
                                    className="w-full"
                                    style={{ backgroundColor: stats.wallColor }}
                                    animate={{ height: `${stats.wallPercent}%` }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                    }}
                                />
                                {/* Crack lines for weak passwords. */}
                                {stats.crackSeconds < 3600 && password.length > 0 && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <svg viewBox="0 0 80 128" className="w-full h-full opacity-60">
                                            <path d="M30 0 L35 30 L25 50 L40 80 L20 128" fill="none" stroke="var(--signal-red)" strokeWidth="2"/>
                                            <path d="M60 0 L55 40 L65 70 L50 128" fill="none" stroke="var(--signal-red)" strokeWidth="1.5"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-[color:var(--gmail-text-dim)]">
                                your wall
                            </span>
                        </div>

                        {/* Time to crack. */}
                        <div className="flex-1 flex flex-col gap-1 pb-8">
                            <span className="text-[10px] uppercase tracking-widest text-[color:var(--gmail-text-dim)]">
                                an attacker would need
                            </span>
                            <motion.span
                                key={stats.crackLabel}
                                className="font-mono text-[28px] sm:text-[36px] leading-tight"
                                style={{ color: stats.wallColor }}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {stats.crackLabel}
                            </motion.span>
                            <span className="text-xs text-[color:var(--gmail-text-dim)]">
                                to crack this password
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Submit. */}
                <button
                    type="button"
                    disabled={password.length === 0}
                    onClick={() => onSubmit({ password })}
                    className="self-start inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3 text-base font-medium hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Set password →
                </button>
            </div>
        </div>
    );
}

/* ============ Password analysis ============ */

interface PasswordStats {
    crackSeconds: number;
    crackLabel: string;
    wallPercent: number;
    wallColor: string;
}

const COMMON_PASSWORDS = new Set([
    "password", "password1", "password1!", "password123",
    "123456", "12345678", "123456789", "1234567890",
    "admin", "admin123", "welcome", "welcome1",
    "letmein", "monkey", "dragon", "master",
    "qwerty", "abc123", "iloveyou", "trustno1",
    "summer", "summer2025", "summer25!", "winter2025",
]);

function analyzePassword(password: string): PasswordStats {
    if (password.length === 0) {
        return { crackSeconds: 0, crackLabel: "—", wallPercent: 0, wallColor: "#3c4043" };
    }

    // Check common passwords first.
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        return {
            crackSeconds: 0.001,
            crackLabel: "instant",
            wallPercent: Math.min(password.length * 3, 15),
            wallColor: "var(--signal-red)",
        };
    }

    // Estimate charset size.
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
    if (charset === 0) charset = 26;

    // Entropy in bits.
    const entropy = password.length * Math.log2(charset);

    // Assume 10 billion guesses/sec (modern GPU rig).
    const guessesPerSec = 1e10;
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSec;

    // Penalize common patterns.
    let adjustedSeconds = seconds;
    if (/^[A-Z][a-z]+\d{1,4}[!@#$%]?$/.test(password)) {
        adjustedSeconds = Math.min(adjustedSeconds, 180);
    }
    if (/^[a-z]+\d{1,4}$/.test(password)) {
        adjustedSeconds = Math.min(adjustedSeconds, 60);
    }

    const crackLabel = formatTime(adjustedSeconds);
    const wallPercent = Math.min(
        5 + Math.log2(Math.max(adjustedSeconds, 1)) * 3,
        100,
    );
    const wallColor =
        adjustedSeconds < 3600
            ? "var(--signal-red)"
            : adjustedSeconds < 86400 * 365
              ? "var(--amber)"
              : "var(--signal-green)";

    return {
        crackSeconds: adjustedSeconds,
        crackLabel,
        wallPercent,
        wallColor,
    };
}

function formatTime(seconds: number): string {
    if (seconds < 0.01) return "instant";
    if (seconds < 1) return "under a second";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 86400 * 365 * 1000)
        return `${Math.round(seconds / (86400 * 365))} years`;
    if (seconds < 86400 * 365 * 1e6)
        return `${Math.round(seconds / (86400 * 365 * 1000))}k years`;
    return "centuries";
}

/**
 * Evaluate the typed password and return a scene ID.
 */
export function evaluatePassword(result: PasswordBuilderResult): SceneId {
    const pw = result.password;
    if (COMMON_PASSWORDS.has(pw.toLowerCase())) return "outcome-common-pattern";
    if (pw.length < 8) return "outcome-too-short";

    // Charset + entropy check.
    let charset = 0;
    if (/[a-z]/.test(pw)) charset += 26;
    if (/[A-Z]/.test(pw)) charset += 26;
    if (/[0-9]/.test(pw)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) charset += 32;
    if (charset === 0) charset = 26;

    const entropy = pw.length * Math.log2(charset);
    const seconds = Math.pow(2, entropy) / 1e10;

    // Common pattern penalty.
    if (/^[A-Z][a-z]+\d{1,4}[!@#$%]?$/.test(pw)) return "outcome-medium";
    if (/^[a-z]+\d{1,4}$/.test(pw)) return "outcome-medium";

    if (seconds < 86400) return "outcome-medium";
    return "outcome-fortress";
}
