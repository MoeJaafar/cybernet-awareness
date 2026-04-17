"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import type { SceneId } from "@/lib/types";

/**
 * Interactive password fortress, the player types freely into a real
 * input. A fortress wall reacts in real time: it grows with length,
 * shifts color with estimated crack time, and a live "time to crack"
 * counter updates on every keystroke. No "weak / strong" labels, the
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
                            className="flex-1 bg-transparent px-4 py-3 font-mono text-[20px] text-[color:var(--gmail-text)] outline-none placeholder:text-[color:var(--gmail-text-dim)]/50"
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
                            <span className="text-[13px] uppercase tracking-widest text-[color:var(--gmail-text-dim)]">
                                your wall
                            </span>
                        </div>

                        {/* Time to crack. */}
                        <div className="flex-1 flex flex-col gap-1 pb-8">
                            <span className="text-[13px] uppercase tracking-widest text-[color:var(--gmail-text-dim)]">
                                an attacker would need
                            </span>
                            <motion.span
                                key={stats.crackLabel}
                                className="font-mono text-[35px] sm:text-[45px] leading-tight"
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

                {/* Why — context-aware explanation that updates as the
                 *  user types. Turns the counter into a teaching moment. */}
                {password.length > 0 && stats.reason && (
                    <motion.div
                        key={stats.reason}
                        className="border-l-2 pl-4 py-1"
                        style={{ borderColor: stats.wallColor }}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p
                            className="text-[11px] uppercase tracking-widest mb-1"
                            style={{ color: stats.wallColor }}
                        >
                            why
                        </p>
                        <p className="text-sm text-[color:var(--gmail-text)] leading-relaxed">
                            {stats.reason}
                        </p>
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
    reason: string;
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
        return {
            crackSeconds: 0,
            crackLabel: ",",
            wallPercent: 0,
            wallColor: "#3c4043",
            reason: "",
        };
    }

    // Check common passwords first.
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        return {
            crackSeconds: 0.001,
            crackLabel: "instant",
            wallPercent: Math.min(password.length * 3, 15),
            wallColor: "var(--signal-red)",
            reason:
                "This is one of the most-used passwords online. Attackers try leaked-password lists first, so they don't have to guess anything at all.",
        };
    }

    // Estimate charset size.
    let charset = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    if (hasLower) charset += 26;
    if (hasUpper) charset += 26;
    if (hasDigit) charset += 10;
    if (hasSymbol) charset += 32;
    if (charset === 0) charset = 26;

    const entropy = password.length * Math.log2(charset);
    const guessesPerSec = 1e10;
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSec;

    // Penalise common patterns. Case-insensitive + optional trailing
    // symbol so "summer2026!", "Summer2026", "password1!" all match.
    let adjustedSeconds = seconds;
    const isSeasonOrMonth =
        /^(spring|summer|autumn|fall|winter|january|february|march|april|may|june|july|august|september|october|november|december)\d{2,4}[!@#$%*]?$/i.test(
            password,
        );
    const isNamePlusYear = /^[A-Z][a-z]+\d{1,4}[!@#$%*]?$/.test(password);
    const isWordPlusDigits = /^[a-zA-Z]+\d{1,4}[!@#$%*]?$/.test(password);
    if (isSeasonOrMonth) adjustedSeconds = Math.min(adjustedSeconds, 30);
    if (isNamePlusYear) adjustedSeconds = Math.min(adjustedSeconds, 180);
    if (isWordPlusDigits) adjustedSeconds = Math.min(adjustedSeconds, 120);

    // Pick a reason based on the dominant weakness or strength.
    let reason: string;
    if (isSeasonOrMonth) {
        reason =
            "Season or month names followed by a year and optional symbol are the single most-common corporate password pattern. Cracking tools try every combination of these in the first few seconds.";
    } else if (isNamePlusYear) {
        reason =
            "Patterns like a capitalised word followed by digits and a symbol are among the first things cracking tools try. Even with a symbol, the structure is predictable.";
    } else if (isWordPlusDigits) {
        reason =
            "Dictionary word plus a short number (and maybe a symbol) is a classic pattern. Attackers try these combinations before anything else.";
    } else if (password.length < 8) {
        reason =
            "Short passwords have a tiny search space. A modern GPU can try every possible combination of this length in seconds.";
    } else if (password.length < 12 && !hasSymbol && !hasUpper) {
        reason =
            "All-lowercase passwords only use 26 possible characters per position. Mixing cases, numbers, or symbols multiplies the search space.";
    } else if (adjustedSeconds < 60) {
        reason =
            "The combination of length and character variety gives attackers too small a space to search through. Longer always helps more than special-character tricks.";
    } else if (adjustedSeconds < 86400 * 365) {
        reason =
            "Decent strength, but length is still the weakest link. Every extra character roughly multiplies the attacker's work.";
    } else if (password.length >= 16) {
        reason =
            "Length is doing the heavy lifting. Each extra character multiplies the search space, so a long passphrase can outperform a short random string.";
    } else {
        reason =
            "Strong mix of length and unpredictability. Brute force on this scale would need years of dedicated GPU time.";
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
        reason,
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

    // Case-insensitive common-pattern checks. Seasons/months + year
    // and dictionary-word + digits (with or without a trailing
    // symbol) all route to the dictionary-pattern outcome.
    if (
        /^(spring|summer|autumn|fall|winter|january|february|march|april|may|june|july|august|september|october|november|december)\d{2,4}[!@#$%*]?$/i.test(
            pw,
        )
    ) {
        return "outcome-common-pattern";
    }
    if (/^[a-zA-Z]+\d{1,4}[!@#$%*]?$/.test(pw)) {
        return "outcome-common-pattern";
    }

    // Charset + entropy check.
    let charset = 0;
    if (/[a-z]/.test(pw)) charset += 26;
    if (/[A-Z]/.test(pw)) charset += 26;
    if (/[0-9]/.test(pw)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) charset += 32;
    if (charset === 0) charset = 26;

    const entropy = pw.length * Math.log2(charset);
    const seconds = Math.pow(2, entropy) / 1e10;

    if (seconds < 86400 * 365) return "outcome-medium";
    return "outcome-fortress";
}
