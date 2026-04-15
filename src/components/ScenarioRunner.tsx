"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { Scenario, Scene, SceneId, SceneVisuals } from "@/lib/types";
import { EmailMockup } from "./EmailMockup";
import { StatusBar } from "./StatusBar";
import { Stage } from "./Stage";
import { Portrait } from "./Portrait";
import { DialogueBox } from "./DialogueBox";

const DEFAULT_BACKGROUND = "/art/backgrounds/office-desk.svg";

export function ScenarioRunner({ scenario }: { scenario: Scenario }) {
    const [started, setStarted] = useState(false);
    const [sceneId, setSceneId] = useState<SceneId>(scenario.startSceneId);
    const [trust, setTrust] = useState(100);

    const scene = scenario.scenes[sceneId];

    const goTo = (next: SceneId) => {
        const target = scenario.scenes[next];
        if (target?.type === "outcome") {
            setTrust((t) =>
                Math.max(0, Math.min(100, t + (target.attackerWon ? -35 : +5))),
            );
        }
        setSceneId(next);
    };

    if (!started) {
        return (
            <>
                <StatusBar score={trust} completed={0} total={1} />
                <SetupScreen
                    scenario={scenario}
                    onStart={() => setStarted(true)}
                />
            </>
        );
    }

    if (!scene) {
        return (
            <>
                <StatusBar score={trust} completed={0} total={1} />
                <div className="max-w-xl mx-auto p-8 mt-10 border-l-2 border-[color:var(--color-signal-red)] bg-[color:var(--color-ink-raised)]">
                    <p className="type-mono text-[color:var(--color-signal-red)] mb-2">error</p>
                    <p className="type-body">Scene &quot;{sceneId}&quot; not found.</p>
                </div>
            </>
        );
    }

    const visuals: SceneVisuals = scene;
    const background = visuals.background ?? DEFAULT_BACKGROUND;
    const portraitNode = visuals.portrait ? (
        <Portrait
            role={visuals.portrait.role}
            expression={visuals.portrait.expression}
        />
    ) : undefined;

    const tone: "default" | "breach" | "contained" =
        scene.type === "outcome"
            ? scene.attackerWon
                ? "breach"
                : "contained"
            : "default";

    return (
        <>
            <StatusBar score={trust} completed={0} total={1} />
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Stage
                        sceneKey={scene.id}
                        background={background}
                        portrait={portraitNode}
                        tone={tone}
                    >
                        <SceneDialogue scene={scene} onAdvance={goTo} />
                    </Stage>
                </motion.div>
            </AnimatePresence>
        </>
    );
}

/**
 * Scenario setup screen — acts as the "cold open" before the scenario
 * begins. Big pull-quote style from the case brief.
 */
function SetupScreen({
    scenario,
    onStart,
}: {
    scenario: Scenario;
    onStart: () => void;
}) {
    return (
        <main className="max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-28">
            <Link
                href="/"
                className="type-mono hover-sweep inline-block mb-16 hover:text-[color:var(--color-amber)] transition-colors"
            >
                ← back to queue
            </Link>

            <motion.div
                className="flex flex-col gap-10"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.15 } },
                }}
            >
                <motion.div
                    className="flex items-center gap-3"
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <span className="h-px w-10 bg-[color:var(--color-amber)]"></span>
                    <span className="type-mono text-[color:var(--color-amber)]">
                        Case · 001 · Briefing
                    </span>
                </motion.div>

                <motion.h1
                    className="type-display text-[52px] sm:text-[84px] lg:text-[104px] text-[color:var(--color-bone)] leading-[0.96]"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                    }}
                >
                    {scenario.title}
                </motion.h1>

                <motion.blockquote
                    className="type-body text-xl sm:text-2xl text-[color:var(--color-bone-dim)] leading-[1.55] max-w-3xl border-l-2 border-[color:var(--color-amber)] pl-6"
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                    }}
                >
                    <span className="type-display-italic text-[color:var(--color-amber)] text-3xl sm:text-4xl mr-2 align-top">
                        &ldquo;
                    </span>
                    {scenario.setup}
                </motion.blockquote>

                <motion.div
                    className="flex flex-col sm:flex-row items-start gap-4 pt-6"
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <button
                        type="button"
                        onClick={onStart}
                        className="group inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-7 py-4 type-display text-xl sm:text-2xl hover:brightness-110 transition-all shadow-[0_0_48px_var(--amber-glow)]"
                    >
                        Begin shift
                        <span
                            aria-hidden
                            className="transition-transform group-hover:translate-x-1 text-2xl"
                        >
                            →
                        </span>
                    </button>
                    <span className="type-mono self-center sm:self-end ml-2">
                        ≈ 5 min · 3 choices
                    </span>
                </motion.div>
            </motion.div>
        </main>
    );
}

function SceneDialogue({
    scene,
    onAdvance,
}: {
    scene: Scene;
    onAdvance: (next: SceneId) => void;
}) {
    switch (scene.type) {
        case "stimulus":
            return (
                <DialogueBox speaker={scene.speaker ?? "narrator"} text={scene.content}>
                    {scene.mock && (
                        <div className="max-h-[40vh] overflow-hidden">
                            <EmailMockup email={scene.mock} />
                        </div>
                    )}
                    <PrimaryButton label="Continue" onClick={() => onAdvance(scene.nextId)} />
                </DialogueBox>
            );

        case "decision":
            return (
                <div className="flex flex-col gap-4">
                    {scene.mock && (
                        <div className="max-h-[44vh] overflow-hidden border-l-2 border-[color:var(--color-bone-ghost)]">
                            <EmailMockup email={scene.mock} />
                        </div>
                    )}
                    <DialogueBox
                        speaker={scene.speaker ?? "choose"}
                        text={scene.prompt}
                        instant={true}
                    >
                        <div className="flex flex-col gap-0 border-t border-[color:var(--color-edge-subtle)]">
                            {scene.choices.map((c, i) => (
                                <ChoiceRow
                                    key={c.label}
                                    index={i}
                                    label={c.label}
                                    onClick={() => onAdvance(c.nextId)}
                                />
                            ))}
                        </div>
                    </DialogueBox>
                </div>
            );

        case "outcome":
            return (
                <DialogueBox
                    speaker={scene.speaker ?? (scene.attackerWon ? "breach" : "contained")}
                    text={scene.narration}
                    tone={scene.attackerWon ? "breach" : "contained"}
                >
                    <PrimaryButton
                        label="View debrief"
                        onClick={() => onAdvance(scene.nextId)}
                        variant={scene.attackerWon ? "breach" : "contained"}
                    />
                </DialogueBox>
            );

        case "debrief":
            return (
                <DialogueBox
                    speaker={scene.speaker ?? "debrief · the lesson"}
                    text={scene.takeaway}
                    instant={true}
                >
                    <p className="type-body text-[15px] text-[color:var(--color-bone-dim)] leading-relaxed border-l border-[color:var(--color-edge-subtle)] pl-4">
                        {scene.lesson}
                    </p>
                    <div className="pt-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            Return to queue
                            <span aria-hidden className="text-xl">→</span>
                        </Link>
                    </div>
                </DialogueBox>
            );
    }
}

/**
 * Decision row — letter index, label, sweeping amber underline on
 * hover, and a micro-caption hinting that a consequence follows.
 */
function ChoiceRow({
    index,
    label,
    onClick,
}: {
    index: number;
    label: string;
    onClick: () => void;
}) {
    const letter = String.fromCharCode(65 + index);
    return (
        <button
            type="button"
            onClick={onClick}
            className="group text-left border-b border-[color:var(--color-edge-subtle)] py-5 px-2 flex items-start gap-5 hover:bg-[color:var(--color-amber-wash,rgba(255,153,51,0.05))] transition-colors"
        >
            <span className="type-display text-2xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors w-8 shrink-0 mt-0.5 tabular-nums">
                {letter}
            </span>
            <span className="type-body text-[17px] sm:text-[18px] text-[color:var(--color-bone)] leading-snug flex-1 group-hover:text-[color:var(--color-bone)]">
                {label}
            </span>
            <span
                aria-hidden
                className="type-mono self-center text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] transition-colors translate-x-[-4px] group-hover:translate-x-0 duration-300"
            >
                →
            </span>
        </button>
    );
}

function PrimaryButton({
    label,
    onClick,
    variant = "default",
}: {
    label: string;
    onClick: () => void;
    variant?: "default" | "breach" | "contained";
}) {
    const borderColour =
        variant === "breach"
            ? "border-[color:var(--color-signal-red)] hover:text-[color:var(--color-signal-red)]"
            : variant === "contained"
              ? "border-[color:var(--color-signal-green)] hover:text-[color:var(--color-signal-green)]"
              : "border-[color:var(--color-amber)] hover:text-[color:var(--color-amber)]";
    return (
        <button
            type="button"
            onClick={onClick}
            className={`self-start group inline-flex items-center gap-3 border ${borderColour} bg-transparent hover:bg-[color:var(--color-ink-higher)] text-[color:var(--color-bone)] px-5 py-2.5 type-display text-lg transition-all`}
        >
            {label}
            <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
            >
                →
            </span>
        </button>
    );
}
