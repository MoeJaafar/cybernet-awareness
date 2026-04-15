import type { EmailMock } from "@/lib/types";

/**
 * Email preview card — reads like evidence-in-a-file, not like a
 * polished Gmail clone. Mono header, serif body, amber divider.
 */
export function EmailMockup({ email }: { email: EmailMock }) {
    const senderName = email.fromName ?? email.from;
    const initial = senderName.charAt(0).toUpperCase();

    return (
        <article className="border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deeper)]/90 backdrop-blur-md">
            {/* Header strip — evidence-tag style. */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-deep)]">
                <span className="type-mono text-[color:var(--color-amber)]">
                    EVIDENCE · inbox.eml
                </span>
                <span className="type-mono text-[color:var(--color-bone-ghost)]">
                    09:12 · today
                </span>
            </div>

            {/* Meta block. */}
            <header className="px-5 py-4 flex items-start gap-4 border-b border-[color:var(--color-edge-subtle)]">
                <div
                    aria-hidden
                    className="h-10 w-10 flex items-center justify-center type-display text-xl text-[color:var(--color-ink-deep)] bg-[color:var(--color-bone-dim)] shrink-0"
                >
                    {initial}
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <div className="flex items-baseline flex-wrap gap-x-3 gap-y-0.5">
                        <span className="type-display text-[17px] text-[color:var(--color-bone)] truncate">
                            {email.fromName ?? email.from}
                        </span>
                        {email.fromName && (
                            <span className="type-mono text-[color:var(--color-bone-ghost)]">
                                &lt;{email.from}&gt;
                            </span>
                        )}
                    </div>
                    <span className="type-mono text-[color:var(--color-bone-muted)]">
                        to {email.to}
                    </span>
                </div>
            </header>

            {/* Subject + body. */}
            <div className="px-5 py-5 flex flex-col gap-4">
                <h3 className="type-display text-[color:var(--color-bone)] text-xl leading-snug">
                    {email.subject}
                </h3>
                <div className="type-body text-[15px] leading-[1.7] text-[color:var(--color-bone-dim)] whitespace-pre-line">
                    {email.body}
                </div>
            </div>
        </article>
    );
}
