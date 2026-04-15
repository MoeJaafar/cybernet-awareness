import Link from "next/link";
import { listScenarios } from "@/lib/scenarios";
import { StatusBar } from "@/components/StatusBar";

export default function Home() {
    const scenarios = listScenarios();

    return (
        <>
            <StatusBar score={100} completed={0} total={scenarios.length} />
            <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
                <section className="flex flex-col gap-6 mb-14">
                    <p className="mono-tag">incident readiness drill · day 1</p>
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[color:var(--color-text-primary)] leading-[1.05] max-w-3xl">
                        Could you spot{" "}
                        <span className="text-[color:var(--color-accent)]">
                            the attack
                        </span>
                        ?
                    </h1>
                    <p className="text-lg text-[color:var(--color-text-muted)] max-w-2xl leading-relaxed">
                        You&apos;ve just joined Riverside University&apos;s SOC.
                        Over the next few minutes, real-world attacks will land
                        in your inbox, on your phone, on the floor outside the
                        elevator. Each choice plays out. An AI narrator
                        explains how an attacker would have used your slip.
                    </p>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                        <p className="mono-tag">scenario queue</p>
                        <p className="mono-tag text-[color:var(--color-text-dim)]">
                            {scenarios.length} ready
                        </p>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-4">
                        {scenarios.map((s, i) => (
                            <li key={s.id}>
                                <Link
                                    href={`/scenario/${s.id}`}
                                    className="group block h-full rounded-xl border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-panel)] hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-bg-panel-2)] transition-all duration-150 p-5"
                                >
                                    <div className="flex items-baseline justify-between mb-3">
                                        <span className="mono-tag text-[color:var(--color-accent)]">
                                            CASE-{String(i + 1).padStart(3, "0")}
                                        </span>
                                        <span className="mono-tag text-[color:var(--color-text-dim)] group-hover:text-[color:var(--color-text-muted)]">
                                            unread
                                        </span>
                                    </div>
                                    <p className="text-base font-semibold text-[color:var(--color-text-primary)] mb-1.5 leading-snug">
                                        {s.title}
                                    </p>
                                    <p className="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                                        {s.concept}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <footer className="mt-20 pt-8 border-t border-[color:var(--color-border-soft)]">
                    <p className="mono-tag">
                        master&apos;s thesis prototype · 2026
                    </p>
                </footer>
            </main>
        </>
    );
}
