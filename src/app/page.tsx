import Link from "next/link";
import { listScenarios } from "@/lib/scenarios";
import { StatusBar } from "@/components/StatusBar";

export default function Home() {
    const scenarios = listScenarios();

    return (
        <>
            <StatusBar score={100} completed={0} total={scenarios.length} />

            <main className="max-w-6xl mx-auto px-6 sm:px-10">
                {/* HERO — asymmetric, editorial. Eyebrow, drop, display type. */}
                <section className="pt-20 sm:pt-32 pb-16 sm:pb-28 grid grid-cols-12 gap-6 items-end">
                    <div className="col-span-12 sm:col-span-8 flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-10 bg-[color:var(--color-amber)]"></span>
                            <span className="type-mono text-[color:var(--color-amber)]">
                                Case File · Series 01
                            </span>
                        </div>
                        <h1 className="type-display text-[68px] sm:text-[112px] lg:text-[136px] text-[color:var(--color-bone)] leading-[0.92]">
                            Could you
                            <br />
                            spot the{" "}
                            <span className="type-display-italic text-[color:var(--color-amber)] amber-flicker">
                                attack
                            </span>
                            ?
                        </h1>
                    </div>

                    <div className="col-span-12 sm:col-span-4 flex flex-col gap-4 sm:pb-4">
                        <p className="type-body text-[color:var(--color-bone-dim)] text-base sm:text-[17px] leading-[1.65]">
                            Your first week at Riverside University&apos;s SOC.
                            A phishing email arrives at 09:12. A USB stick
                            waits outside the elevator. A friendly caller
                            claims to be from IT. Five cases. An AI narrator
                            tells you how close you came.
                        </p>
                    </div>
                </section>

                {/* Chapter divider. */}
                <div className="flex items-center gap-6 border-t border-[color:var(--color-edge-subtle)] pt-6 mb-10">
                    <span className="type-mono">
                        The Queue
                    </span>
                    <span className="h-px flex-1 bg-[color:var(--color-edge-subtle)]"></span>
                    <span className="type-mono text-[color:var(--color-bone-ghost)]">
                        {scenarios.length.toString().padStart(2, "0")} waiting
                    </span>
                </div>

                {/* SCENARIO QUEUE — case-file cards. */}
                <section className="mb-24">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[color:var(--color-edge-subtle)] border border-[color:var(--color-edge-subtle)]">
                        {scenarios.map((s, i) => (
                            <li key={s.id} className="bg-[color:var(--color-ink-base)]">
                                <Link
                                    href={`/scenario/${s.id}`}
                                    className="group block h-full p-7 sm:p-9 hover:bg-[color:var(--color-ink-raised)] transition-colors duration-300 relative"
                                >
                                    {/* Amber corner-mark — appears on hover. */}
                                    <span
                                        aria-hidden
                                        className="absolute top-0 right-0 w-[3px] h-0 bg-[color:var(--color-amber)] group-hover:h-full transition-[height] duration-500 ease-out"
                                    />

                                    <div className="flex items-baseline justify-between gap-6 mb-6">
                                        <span className="type-mono text-[color:var(--color-amber)]">
                                            Case · {String(i + 1).padStart(3, "0")}
                                        </span>
                                        <span className="type-mono text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-bone-muted)] transition-colors">
                                            unopened
                                        </span>
                                    </div>

                                    <h3 className="type-display text-[28px] sm:text-[34px] leading-[1.05] text-[color:var(--color-bone)] mb-5 group-hover:text-[color:var(--color-amber-soft)] transition-colors">
                                        {s.title}
                                    </h3>

                                    <p className="type-body text-[15px] text-[color:var(--color-bone-dim)] leading-relaxed">
                                        {s.concept}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-[color:var(--color-bone-muted)] group-hover:text-[color:var(--color-amber)] transition-colors">
                                        <span className="type-mono">
                                            Open case
                                        </span>
                                        <span aria-hidden className="h-px w-6 bg-current group-hover:w-16 transition-[width] duration-500 ease-out"></span>
                                    </div>
                                </Link>
                            </li>
                        ))}

                        {/* Placeholder "coming soon" tiles to fill the grid symmetrically. */}
                        {Array.from({ length: Math.max(0, (scenarios.length % 2 === 0 ? 0 : 1)) }).map((_, i) => (
                            <li
                                key={`empty-${i}`}
                                className="bg-[color:var(--color-ink-base)]/60 p-7 sm:p-9 flex flex-col justify-between min-h-[240px]"
                            >
                                <div className="flex items-baseline justify-between">
                                    <span className="type-mono text-[color:var(--color-bone-ghost)]">
                                        Case · {String(scenarios.length + 1).padStart(3, "0")}
                                    </span>
                                    <span className="type-mono text-[color:var(--color-bone-ghost)]">
                                        sealed
                                    </span>
                                </div>
                                <h3 className="type-display-italic text-[26px] text-[color:var(--color-bone-ghost)] leading-snug">
                                    to be briefed
                                </h3>
                            </li>
                        ))}
                    </ul>
                </section>

                <footer className="border-t border-[color:var(--color-edge-subtle)] py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="type-mono">
                        Master&apos;s thesis prototype · 2026
                    </p>
                    <p className="type-body text-sm text-[color:var(--color-bone-ghost)] italic">
                        <span className="type-display-italic">&ldquo;The human is always the last firewall.&rdquo;</span>
                    </p>
                </footer>
            </main>
        </>
    );
}
