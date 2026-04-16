"use client";

import type { PasswordFormMock, PasswordOption, SceneId } from "@/lib/types";

/**
 * Password-change form. Presented like a real corporate password
 * reset screen (top system banner, list of options with strength
 * bars). Each option is a button that advances the scenario to its
 * `nextId` — so clicking "use this password" IS the decision.
 */
export function PasswordForm({
    form,
    onPick,
}: {
    form: PasswordFormMock;
    onPick: (id: SceneId) => void;
}) {
    return (
        <div className="border border-[color:var(--gmail-border)] bg-[color:var(--gmail-bg)] rounded-lg overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]">
            {/* System banner — mock Windows/Outlook style. */}
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
                <p
                    className="text-sm text-[color:var(--color-signal-red)]"
                    style={{ fontFamily: "var(--font-gmail)" }}
                >
                    {form.header}
                </p>
            </div>

            {/* Form content. */}
            <div
                className="px-5 sm:px-7 py-6 sm:py-7 flex flex-col gap-5"
                style={{ fontFamily: "var(--font-gmail)" }}
            >
                <div>
                    <h3 className="text-[20px] text-[color:var(--gmail-text)] font-medium mb-1">
                        Set a new password
                    </h3>
                    {form.caption && (
                        <p className="text-sm text-[color:var(--gmail-text-dim)]">
                            {form.caption}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {form.options.map((opt, i) => (
                        <OptionRow
                            key={opt.value}
                            index={i}
                            option={opt}
                            onPick={() => onPick(opt.nextId)}
                        />
                    ))}
                </div>

                <p className="text-[11px] text-[color:var(--gmail-text-dim)] italic">
                    Tip: hover an option to see the password in full.
                </p>
            </div>
        </div>
    );
}

function OptionRow({
    index,
    option,
    onPick,
}: {
    index: number;
    option: PasswordOption;
    onPick: () => void;
}) {
    const masked = "•".repeat(Math.min(option.value.length, 18));
    return (
        <button
            type="button"
            onClick={onPick}
            className="group text-left border border-[color:var(--gmail-border)] hover:border-[color:var(--color-amber)] bg-[color:var(--gmail-panel)] hover:bg-[color:var(--gmail-hover)] transition-colors px-4 py-3.5 flex flex-col gap-2"
            style={{ fontFamily: "var(--font-gmail)" }}
        >
            <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3 min-w-0">
                    <span className="text-xs text-[color:var(--gmail-text-dim)] group-hover:text-[color:var(--color-amber)] transition-colors">
                        {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-mono text-[15px] text-[color:var(--gmail-text)] truncate">
                        <span className="group-hover:hidden">{masked}</span>
                        <span className="hidden group-hover:inline">
                            {option.value}
                        </span>
                    </span>
                </div>
                <StrengthBar strength={option.strength} />
            </div>
            <p className="text-xs text-[color:var(--gmail-text-dim)] pl-6">
                {option.label}
            </p>
        </button>
    );
}

function StrengthBar({ strength }: { strength: 1 | 2 | 3 | 4 | 5 }) {
    const segments = [1, 2, 3, 4, 5];
    const colour =
        strength <= 2
            ? "bg-[color:var(--color-signal-red)]"
            : strength === 3
              ? "bg-[color:var(--color-amber)]"
              : "bg-[color:var(--color-signal-green)]";
    const label =
        strength === 1
            ? "very weak"
            : strength === 2
              ? "weak"
              : strength === 3
                ? "ok"
                : strength === 4
                  ? "strong"
                  : "very strong";
    return (
        <div className="flex items-center gap-2 shrink-0">
            <div className="flex gap-0.5">
                {segments.map((s) => (
                    <span
                        key={s}
                        className={`h-1.5 w-3 rounded-sm ${
                            s <= strength
                                ? colour
                                : "bg-[color:var(--gmail-border)]"
                        }`}
                    />
                ))}
            </div>
            <span
                className="text-[10px] uppercase tracking-widest text-[color:var(--gmail-text-dim)] w-[64px]"
                style={{ fontFamily: "var(--font-gmail)" }}
            >
                {label}
            </span>
        </div>
    );
}
