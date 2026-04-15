"use client";

import { useState } from "react";
import Link from "next/link";
import type { Scenario, Scene, SceneId } from "@/lib/types";
import { EmailMockup } from "./EmailMockup";

/**
 * Drives the player through a scenario by walking the Scene graph.
 * State is intentionally local to this component for v1 — when we add
 * persistence (per-session logging for the user study), we'll lift this
 * into a context or URL state.
 */
export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
    const [started, setStarted] = useState(false);
    const [sceneId, setSceneId] = useState<SceneId>(scenario.startSceneId);
    const [history, setHistory] = useState<SceneId[]>([scenario.startSceneId]);

    if (!started) {
        return <SetupCard scenario={scenario} onStart={() => setStarted(true)} />;
    }

    const scene = scenario.scenes[sceneId];
    if (!scene) {
        // Defensive: a Scene referenced something that doesn't exist.
        return <ErrorCard message={`Scene "${sceneId}" not found in scenario "${scenario.id}".`} />;
    }

    const goTo = (next: SceneId) => {
        setSceneId(next);
        setHistory((h) => [...h, next]);
    };

    return (
        <article className="flex flex-col gap-6">
            <header className="flex flex-col gap-1">
                <Link
                    href="/"
                    className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 self-start"
                >
                    ← back to scenarios
                </Link>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {scenario.title}
                </h1>
            </header>
            <SceneView scene={scene} onAdvance={goTo} historyLength={history.length} />
        </article>
    );
}

function SetupCard({
    scenario,
    onStart,
}: {
    scenario: Scenario;
    onStart: () => void;
}) {
    return (
        <article className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
                <Link
                    href="/"
                    className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 self-start"
                >
                    ← back
                </Link>
                <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Scenario
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {scenario.title}
                </h1>
            </header>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                {scenario.setup}
            </p>
            <button
                type="button"
                onClick={onStart}
                className="self-start rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
                Begin scenario
            </button>
        </article>
    );
}

function SceneView({
    scene,
    onAdvance,
    historyLength,
}: {
    scene: Scene;
    onAdvance: (next: SceneId) => void;
    historyLength: number;
}) {
    switch (scene.type) {
        case "stimulus":
            return (
                <section className="flex flex-col gap-5">
                    <Markdown text={scene.content} />
                    {scene.mock && <EmailMockup email={scene.mock} />}
                    <div>
                        <button
                            type="button"
                            onClick={() => onAdvance(scene.nextId)}
                            className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </section>
            );
        case "decision":
            return (
                <section className="flex flex-col gap-5">
                    {scene.mock && <EmailMockup email={scene.mock} />}
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                        {scene.prompt}
                    </h2>
                    <div className="flex flex-col gap-2">
                        {scene.choices.map((c) => (
                            <button
                                key={c.label}
                                type="button"
                                onClick={() => onAdvance(c.nextId)}
                                className="text-left rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 transition-colors"
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </section>
            );
        case "outcome":
            return (
                <section className="flex flex-col gap-5">
                    <div
                        className={`rounded-xl border px-5 py-4 ${
                            scene.attackerWon
                                ? "border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30"
                                : "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30"
                        }`}
                    >
                        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                            What happened
                        </p>
                        <p className="text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
                            {scene.narration}
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => onAdvance(scene.nextId)}
                            className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                        >
                            Debrief
                        </button>
                    </div>
                </section>
            );
        case "debrief":
            return (
                <section className="flex flex-col gap-5">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-4">
                        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
                            Takeaway
                        </p>
                        <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                            {scene.takeaway}
                        </p>
                    </div>
                    <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {scene.lesson}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            href="/"
                            className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                        >
                            Back to scenarios
                        </Link>
                        <p className="self-center text-xs text-zinc-500 dark:text-zinc-400">
                            {historyLength} scene{historyLength === 1 ? "" : "s"} played
                        </p>
                    </div>
                </section>
            );
    }
}

function ErrorCard({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-5 py-4">
            <p className="text-sm text-red-900 dark:text-red-100">{message}</p>
        </div>
    );
}

/** Minimal Markdown — bold + paragraph splitting. No XSS risk; static text. */
function Markdown({ text }: { text: string }) {
    const paragraphs = text.split("\n\n");
    return (
        <div className="flex flex-col gap-3">
            {paragraphs.map((p, i) => (
                <p
                    key={i}
                    className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300"
                    dangerouslySetInnerHTML={{
                        __html: p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                    }}
                />
            ))}
        </div>
    );
}
