import Link from "next/link";
import { listScenarios } from "@/lib/scenarios";

export default function Home() {
    const scenarios = listScenarios();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
            <main className="max-w-2xl w-full text-left flex flex-col gap-10">
                <header className="flex flex-col gap-3">
                    <p className="text-sm uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        CyberNet · Awareness Edition
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Could you spot the attack?
                    </h1>
                </header>

                <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                    You play a member of staff at a small university. Over the
                    next few minutes, you&apos;ll face a series of realistic
                    cyberattacks — a phishing email, a USB stick on the floor,
                    a help-desk call asking for your password. Each decision
                    plays out, an AI narrator explains what just happened, and
                    you find out how an attacker would have used your slip.
                </p>

                <section className="flex flex-col gap-4">
                    <h2 className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        Scenarios
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {scenarios.map((s) => (
                            <li key={s.id}>
                                <Link
                                    href={`/scenario/${s.id}`}
                                    className="block rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-white dark:hover:bg-zinc-900 px-5 py-4 transition-colors"
                                >
                                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                        {s.title}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                        {s.concept}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Master&apos;s thesis prototype. More scenarios coming.
                </p>
            </main>
        </div>
    );
}
