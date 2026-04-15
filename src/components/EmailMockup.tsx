import type { EmailMock } from "@/lib/types";

/**
 * Stylised email card that reads like a real email-client preview pane.
 * Sender avatar is generated from the first letter of the display name
 * for a quick visual anchor.
 */
export function EmailMockup({ email }: { email: EmailMock }) {
    const senderName = email.fromName ?? email.from;
    const initial = senderName.charAt(0).toUpperCase();
    const senderHash = simpleHash(email.from);
    const avatarHue = senderHash % 360;

    return (
        <article className="rounded-xl border border-[color:var(--color-border-hard)] bg-[color:var(--color-bg-panel-2)] overflow-hidden shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]">
            {/* Window chrome — three dots like a desktop app. */}
            <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-panel)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bad)]/60"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-warn)]/60"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-good)]/60"></span>
                <span className="ml-3 mono-tag text-[color:var(--color-text-dim)]">
                    inbox · unread
                </span>
            </div>

            {/* Header: sender, recipient, subject. */}
            <header className="px-5 py-4 border-b border-[color:var(--color-border-soft)] flex gap-4 items-start">
                <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                    style={{
                        backgroundImage: `linear-gradient(135deg, hsl(${avatarHue} 70% 45%), hsl(${(avatarHue + 40) % 360} 65% 35%))`,
                    }}
                    aria-hidden
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-[color:var(--color-text-primary)] truncate">
                            {email.fromName ?? email.from}
                        </span>
                        <span className="mono-tag shrink-0">just now</span>
                    </div>
                    {email.fromName && (
                        <span className="text-xs text-[color:var(--color-text-dim)] font-mono truncate">
                            &lt;{email.from}&gt;
                        </span>
                    )}
                    <span className="text-xs text-[color:var(--color-text-muted)]">
                        to{" "}
                        <span className="text-[color:var(--color-text-primary)]">
                            {email.to}
                        </span>
                    </span>
                </div>
            </header>

            {/* Subject and body. */}
            <div className="px-5 py-5 flex flex-col gap-4">
                <h3 className="text-base font-semibold text-[color:var(--color-text-primary)] leading-snug">
                    {email.subject}
                </h3>
                <div className="text-sm leading-relaxed text-[color:var(--color-text-primary)]/90 whitespace-pre-line">
                    {email.body}
                </div>
            </div>
        </article>
    );
}

/** Stable hash for picking an avatar colour from sender address. */
function simpleHash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
}
