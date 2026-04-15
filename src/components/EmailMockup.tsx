import type { EmailMock } from "@/lib/types";

/** Stylised email card. Looks like an email-client preview pane. */
export function EmailMockup({ email }: { email: EmailMock }) {
    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <header className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
                <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Inbox · 1 unread
                </div>
            </header>
            <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex items-baseline gap-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 w-16 shrink-0">
                        From
                    </span>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">
                        {email.fromName ? (
                            <>
                                {email.fromName}{" "}
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    &lt;{email.from}&gt;
                                </span>
                            </>
                        ) : (
                            email.from
                        )}
                    </span>
                </div>
                <div className="flex items-baseline gap-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 w-16 shrink-0">
                        To
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {email.to}
                    </span>
                </div>
                <div className="flex items-baseline gap-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 w-16 shrink-0">
                        Subject
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {email.subject}
                    </span>
                </div>
            </div>
            <div className="px-5 py-5 border-t border-zinc-200 dark:border-zinc-800 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
                {email.body}
            </div>
        </div>
    );
}
