"use client";

import type { PasswordFormMock, PasswordOption, SceneId } from "@/lib/types";
import { useMessages } from "@/lib/i18n/use-locale";
import type { Messages } from "@/lib/i18n/types";

/**
 * Password-change form. Presented like a real corporate password
 * reset screen (top system banner, list of options with strength
 * bars). Each option is a button that advances the scenario to its
 * `nextId`, so clicking "use this password" IS the decision.
 */
export function PasswordForm({
    form,
    onPick,
}: {
    form: PasswordFormMock;
    onPick: (id: SceneId) => void;
}) {
    const m = useMessages();
    const pf = m.passwordForm;
    return (
        <div className="border border-[color:var(--gmail-border)] bg-[color:var(--gmail-bg)] rounded-lg overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]">
            {/* System banner, mock Windows/Outlook style. */}
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
                        {pf.title}
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
                            charsLabel={pf.charsLabel}
                            onPick={() => onPick(opt.nextId)}
                        />
                    ))}
                </div>

                <p className="text-[11px] text-[color:var(--gmail-text-dim)] italic">
                    {pf.hoverHint}
                </p>
            </div>
        </div>
    );
}

/**
 * Single option row. Deliberately hides strength/trade-off cues, the
 * player should evaluate the password as they see it, not be told
 * which one is strong. Feedback comes after the pick, in the outcome
 * narrative.
 */
function OptionRow({
    index,
    option,
    charsLabel,
    onPick,
}: {
    index: number;
    option: PasswordOption;
    charsLabel: Messages["passwordForm"]["charsLabel"];
    onPick: () => void;
}) {
    const masked = "•".repeat(Math.min(option.value.length, 18));
    return (
        <button
            type="button"
            onClick={onPick}
            className="group text-start border border-[color:var(--gmail-border)] hover:border-[color:var(--color-amber)] bg-[color:var(--gmail-panel)] hover:bg-[color:var(--gmail-hover)] transition-colors px-4 py-4 flex items-center gap-4"
            style={{ fontFamily: "var(--font-gmail)" }}
        >
            <span className="text-sm text-[color:var(--gmail-text-dim)] group-hover:text-[color:var(--color-amber)] transition-colors w-6 shrink-0">
                {String.fromCharCode(65 + index)}
            </span>
            <span className="font-mono text-[15px] text-[color:var(--gmail-text)] truncate flex-1">
                <span className="group-hover:hidden">{masked}</span>
                <span className="hidden group-hover:inline">
                    {option.value}
                </span>
            </span>
            <span className="text-xs text-[color:var(--gmail-text-dim)] shrink-0">
                {charsLabel(option.value.length)}
            </span>
        </button>
    );
}
