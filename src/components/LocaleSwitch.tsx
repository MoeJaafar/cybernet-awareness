"use client";

import { useRouter } from "next/navigation";
import { useLocale, useMessages, usePathWithoutLocale } from "@/lib/i18n/use-locale";
import { LOCALES, type Locale } from "@/lib/i18n";

/**
 * Tiny EN/عربي toggle pinned to the top-start corner. Switches the
 * URL locale prefix in place so the participant lands on the same
 * page in the other language, and the cookie set by middleware
 * follows automatically on the next navigation.
 */
export function LocaleSwitch() {
    const router = useRouter();
    const locale = useLocale();
    const m = useMessages();
    const pathWithoutLocale = usePathWithoutLocale();

    // Middleware persists the cookie based on the destination URL, so
    // we don't need to set document.cookie ourselves — pushing the new
    // locale-prefixed path is enough.
    const switchTo = (target: Locale) => {
        if (target === locale) return;
        const next = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
        router.push(`/${target}${next}`);
    };

    return (
        <div
            className="fixed top-3 start-3 z-50 flex items-center gap-1 bg-[color:var(--color-ink-raised)]/85 backdrop-blur-sm border border-[color:var(--color-edge-subtle)] rounded-full p-0.5"
            role="group"
            aria-label={m.localeSwitch.ariaLabel}
        >
            {LOCALES.map((code) => {
                const active = code === locale;
                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => switchTo(code)}
                        aria-pressed={active}
                        className={`type-mono text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                            active
                                ? "bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)]"
                                : "text-[color:var(--color-bone-muted)] hover:text-[color:var(--color-amber)]"
                        }`}
                    >
                        {m.localeSwitch.languageNames[code]}
                    </button>
                );
            })}
        </div>
    );
}
