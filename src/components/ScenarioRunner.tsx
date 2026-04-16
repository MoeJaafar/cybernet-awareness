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
import { Workspace } from "./Workspace";
import { TypedNarrative, splitBeats } from "./TypedNarrative";
import { PasswordForm } from "./PasswordForm";
import { PasswordBuilder, evaluatePassword } from "./PasswordBuilder";
import { PhoneCall } from "./PhoneCall";
import { vishingCallConfig } from "@/lib/scenarios/vishing";

const DEFAULT_BACKGROUND = "/art/backgrounds/office-desk.svg";

export function ScenarioRunner({
    scenario,
    nextScenarioId,
}: {
    scenario: Scenario;
    nextScenarioId?: string;
}) {
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

    if (!scene) {
        return (
            <>
                <StatusBar survived={0} total={1} closeCalls={trust < 100 ? 1 : 0} />
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

    // Pick the right surface per scene type:
    //   - decision / stimulus WITH mock (email / password form) -> Workspace
    //   - outcome / debrief / quiz       -> TypedNarrative (centered prose)
    //   - stimulus without mock          -> TypedNarrative (simple beat)
    //   - decision without mock          -> TypedNarrative + choices
    const sceneWithMock = scene as {
        mock?: unknown;
        passwordForm?: unknown;
    };
    const hasMock =
        sceneWithMock.mock !== undefined ||
        sceneWithMock.passwordForm !== undefined;
    // Special interactive scenes that use Workspace even without
    // a mock or passwordForm — the custom component IS the surface.
    const isBuilderScene = scene.type === "decision" && scene.id === "build";
    const isPhoneScene = scene.type === "decision" && scene.id === "phone-ring";
    const usesWorkspace =
        ((scene.type === "decision" || scene.type === "stimulus") && hasMock) ||
        isBuilderScene ||
        isPhoneScene;
    const usesNarrative =
        !usesWorkspace &&
        (scene.type === "stimulus" ||
            scene.type === "outcome" ||
            scene.type === "debrief" ||
            scene.type === "quiz" ||
            scene.type === "decision");

    return (
        <>
            <StatusBar survived={0} total={1} closeCalls={trust < 100 ? 1 : 0} />
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {usesWorkspace ? (
                        <WorkspaceScene scene={scene} onAdvance={goTo} />
                    ) : usesNarrative ? (
                        <NarrativeScene scene={scene} onAdvance={goTo} nextScenarioId={nextScenarioId} />
                    ) : (
                        <Stage
                            sceneKey={scene.id}
                            background={background}
                            portrait={portraitNode}
                            tone={tone}
                        >
                            <SceneDialogue scene={scene} onAdvance={goTo} />
                        </Stage>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

/**
 * Centered typed-narrative renderer. Handles outcome / debrief /
 * quiz / portrait-less stimulus+decision scenes.
 */
function NarrativeScene({
    scene,
    onAdvance,
    nextScenarioId,
}: {
    scene: Scene;
    onAdvance: (next: SceneId) => void;
    nextScenarioId?: string;
}) {
    switch (scene.type) {
        case "stimulus":
            return (
                <TypedNarrative
                    speaker={scene.speaker ?? "narrator"}
                    lines={splitBeats(scene.content)}
                >
                    <PrimaryButton
                        label="Continue"
                        onClick={() => onAdvance(scene.nextId)}
                    />
                </TypedNarrative>
            );

        case "decision":
            return (
                <TypedNarrative
                    speaker={scene.speaker ?? "your move"}
                    lines={splitBeats(scene.prompt)}
                >
                    <div className="flex flex-col gap-0 border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-raised)] overflow-hidden w-full max-w-2xl">
                        {scene.choices.map((c, i) => (
                            <ChoiceRow
                                key={c.label}
                                index={i}
                                label={c.label}
                                onClick={() => onAdvance(c.nextId)}
                            />
                        ))}
                    </div>
                </TypedNarrative>
            );

        case "outcome": {
            const tone = scene.attackerWon ? "breach" : "contained";
            return (
                <TypedNarrative
                    tone={tone}
                    speaker={scene.speaker ?? (scene.attackerWon ? "breach" : "contained")}
                    lines={splitBeats(scene.narration)}
                >
                    <PrimaryButton
                        label="View the takeaway"
                        onClick={() => onAdvance(scene.nextId)}
                        variant={scene.attackerWon ? "breach" : "contained"}
                    />
                </TypedNarrative>
            );
        }

        case "debrief": {
            const lessonBeats = splitBeats(scene.lesson);
            return (
                <TypedNarrative
                    tone="takeaway"
                    speaker={scene.speaker ?? "the takeaway"}
                    lines={[scene.takeaway, ...lessonBeats]}
                    finalEmphasis={false}
                >
                    {scene.nextId ? (
                        <PrimaryButton
                            label="Continue"
                            onClick={() => onAdvance(scene.nextId!)}
                        />
                    ) : (
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                        >
                            Return to queue
                            <span aria-hidden className="text-xl">→</span>
                        </Link>
                    )}
                </TypedNarrative>
            );
        }

        case "quiz":
            return (
                <TypedNarrative
                    speaker={scene.speaker ?? "one last check"}
                    lines={[scene.prompt]}
                >
                    <QuizOptions scene={scene} nextScenarioId={nextScenarioId} />
                </TypedNarrative>
            );
    }
    return null;
}

/**
 * Quiz options — renders beneath the typed prompt. Try-again cycle
 * on wrong answers; on correct, shows continue.
 */
function QuizOptions({
    scene,
    nextScenarioId,
}: {
    scene: import("@/lib/types").QuizScene;
    nextScenarioId?: string;
}) {
    const [pickedIdx, setPickedIdx] = useState<number | null>(null);
    const picked = pickedIdx === null ? null : scene.options[pickedIdx];

    return (
        <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                {scene.options.map((opt, i) => {
                    const isPicked = pickedIdx === i;
                    const colourClass = !isPicked
                        ? "border-[color:var(--color-edge-subtle)] hover:border-[color:var(--color-amber)]"
                        : opt.correct
                          ? "border-[color:var(--color-signal-green)]"
                          : "border-[color:var(--color-signal-red)]";
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => setPickedIdx(i)}
                            disabled={picked?.correct}
                            className={`group text-left border ${colourClass} bg-[color:var(--color-ink-raised)] hover:bg-[color:var(--color-ink-higher)] px-4 py-3 transition-colors disabled:opacity-70 disabled:cursor-default`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="type-display text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] w-6 shrink-0">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="type-body text-[16px] text-[color:var(--color-bone)] flex-1">
                                    {opt.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {picked && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-l-2 pl-4 py-1 text-left ${
                        picked.correct
                            ? "border-[color:var(--color-signal-green)]"
                            : "border-[color:var(--color-signal-red)]"
                    }`}
                >
                    <p
                        className={`type-mono mb-1 ${
                            picked.correct
                                ? "text-[color:var(--color-signal-green)]"
                                : "text-[color:var(--color-signal-red)]"
                        }`}
                    >
                        {picked.correct ? "right" : "not quite — try again"}
                    </p>
                    <p className="type-body text-[14px] text-[color:var(--color-bone-dim)] leading-relaxed">
                        {picked.feedback}
                    </p>
                </motion.div>
            )}
            {picked?.correct && (
                <div className="pt-2">
                    <Link
                        href={nextScenarioId ? `/scenario/${nextScenarioId}` : "/"}
                        className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        {nextScenarioId ? "Next" : "Done"}
                        <span aria-hidden className="text-xl">→</span>
                    </Link>
                </div>
            )}
        </div>
    );
}

/**
 * Workspace-style scene — the email mock takes centre stage, with a
 * slim narrator ribbon above it and no portrait/dialogue chrome.
 * Used for stimulus and decision scenes where the player's focus is
 * on an interactive on-screen surface.
 */
function WorkspaceScene({
    scene,
    onAdvance,
}: {
    scene: Scene;
    onAdvance: (next: SceneId) => void;
}) {
    if (scene.type === "stimulus" && scene.mock) {
        return (
            <Workspace narrator={scene.speaker ?? "incoming"} prompt={scene.content}>
                <EmailMockup email={scene.mock} onTrap={onAdvance} />
                <div className="pt-2">
                    <PrimaryButton label="Continue" onClick={() => onAdvance(scene.nextId)} />
                </div>
            </Workspace>
        );
    }
    if (scene.type === "decision") {
        if (scene.mock) {
            const toolbarChoices = scene.choices.filter((c) =>
                c.location && c.location.startsWith("toolbar-"),
            );
            const buttonChoices = scene.choices.filter(
                (c) => !c.location || c.location === "button",
            );
            return (
                <Workspace
                    narrator={scene.speaker ?? "your move"}
                    prompt={scene.prompt}
                >
                    <EmailMockup
                        email={scene.mock}
                        toolbarChoices={toolbarChoices}
                        onTrap={onAdvance}
                        onChoice={(c) => onAdvance(c.nextId)}
                    />
                    {buttonChoices.length > 0 && (
                        <div className="flex flex-col gap-0 border border-[color:var(--color-edge-subtle)] bg-[color:var(--color-ink-raised)] overflow-hidden mt-4">
                            {buttonChoices.map((c, i) => (
                                <ChoiceRow
                                    key={c.label}
                                    index={i}
                                    label={c.label}
                                    onClick={() => onAdvance(c.nextId)}
                                />
                            ))}
                        </div>
                    )}
                </Workspace>
            );
        }
        if (scene.passwordForm) {
            return (
                <Workspace
                    narrator={scene.speaker ?? "your move"}
                    prompt={scene.prompt}
                >
                    <PasswordForm form={scene.passwordForm} onPick={onAdvance} />
                </Workspace>
            );
        }
        // Phone call scene: vishing.
        if (scene.id === "phone-ring") {
            return (
                <Workspace narrator={scene.speaker} prompt={scene.prompt}>
                    <PhoneCall
                        callerName={vishingCallConfig.callerName}
                        callerNumber={vishingCallConfig.callerNumber}
                        lines={vishingCallConfig.lines}
                        choices={vishingCallConfig.choices}
                        onChoice={(nextId) => onAdvance(nextId)}
                        onDecline={(nextId) => onAdvance(nextId)}
                        declineNextId={vishingCallConfig.declineNextId}
                    />
                </Workspace>
            );
        }
        // Password-fortress builder.
        if (scene.id === "build" && !scene.mock && !scene.passwordForm) {
            return (
                <Workspace
                    narrator={scene.speaker ?? "your move"}
                    prompt={scene.prompt}
                >
                    <PasswordBuilder
                        header="Your password will expire in 2 hours. Build a new one to continue working."
                        caption="Pick bricks from the categories below. Each brick adds to your password."
                        onSubmit={(result) => {
                            const outcomeId = evaluatePassword(result);
                            onAdvance(outcomeId);
                        }}
                    />
                </Workspace>
            );
        }
    }
    return null;
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
                            <EmailMockup email={scene.mock} onTrap={onAdvance} />
                        </div>
                    )}
                    <PrimaryButton label="Continue" onClick={() => onAdvance(scene.nextId)} />
                </DialogueBox>
            );

        case "decision": {
            const toolbarChoices = scene.choices.filter((c) =>
                c.location && c.location.startsWith("toolbar-"),
            );
            const buttonChoices = scene.choices.filter(
                (c) => !c.location || c.location === "button",
            );
            const allInToolbar =
                toolbarChoices.length > 0 && buttonChoices.length === 0;
            return (
                <div className="flex flex-col gap-4">
                    {scene.mock && (
                        <div className="max-h-[72vh] overflow-auto">
                            <EmailMockup
                                email={scene.mock}
                                toolbarChoices={toolbarChoices}
                                onTrap={onAdvance}
                                onChoice={(c) => onAdvance(c.nextId)}
                            />
                        </div>
                    )}
                    {!allInToolbar && (
                        <DialogueBox
                            speaker={scene.speaker ?? "choose"}
                            text={scene.prompt}
                            instant={true}
                        >
                            {buttonChoices.length > 0 && (
                                <div className="flex flex-col gap-0 border-t border-[color:var(--color-edge-subtle)]">
                                    {buttonChoices.map((c, i) => (
                                        <ChoiceRow
                                            key={c.label}
                                            index={i}
                                            label={c.label}
                                            onClick={() => onAdvance(c.nextId)}
                                        />
                                    ))}
                                </div>
                            )}
                        </DialogueBox>
                    )}
                </div>
            );
        }

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

        case "quiz":
            return (
                <QuizPanel scene={scene} onAdvance={() => onAdvance(scene.nextId)} />
            );
    }
}

function QuizPanel({
    scene,
    onAdvance,
}: {
    scene: import("@/lib/types").QuizScene;
    onAdvance: () => void;
}) {
    const [pickedIdx, setPickedIdx] = useState<number | null>(null);
    const picked = pickedIdx === null ? null : scene.options[pickedIdx];

    return (
        <DialogueBox
            speaker={scene.speaker ?? "check your instincts"}
            text={scene.prompt}
            instant={true}
        >
            <div className="flex flex-col gap-2">
                {scene.options.map((opt, i) => {
                    const isPicked = pickedIdx === i;
                    const correctnessColour = !isPicked
                        ? "border-[color:var(--color-edge-subtle)]"
                        : opt.correct
                          ? "border-[color:var(--color-signal-green)]"
                          : "border-[color:var(--color-signal-red)]";
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => setPickedIdx(i)}
                            disabled={picked?.correct}
                            className={`group text-left border ${correctnessColour} bg-[color:var(--color-ink-deep)] hover:bg-[color:var(--color-ink-raised)] px-4 py-3 transition-colors disabled:opacity-70 disabled:cursor-default`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="type-display text-xl text-[color:var(--color-bone-ghost)] group-hover:text-[color:var(--color-amber)] w-6 shrink-0">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="type-body text-[16px] text-[color:var(--color-bone)] flex-1">
                                    {opt.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
            {picked && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 border-l-2 pl-4 py-1 ${
                        picked.correct
                            ? "border-[color:var(--color-signal-green)]"
                            : "border-[color:var(--color-signal-red)]"
                    }`}
                >
                    <p
                        className={`type-mono mb-1 ${
                            picked.correct
                                ? "text-[color:var(--color-signal-green)]"
                                : "text-[color:var(--color-signal-red)]"
                        }`}
                    >
                        {picked.correct ? "right" : "not quite — try again"}
                    </p>
                    <p className="type-body text-[14px] text-[color:var(--color-bone-dim)] leading-relaxed">
                        {picked.feedback}
                    </p>
                </motion.div>
            )}
            {picked?.correct && (
                <div className="pt-3">
                    <button
                        type="button"
                        onClick={onAdvance}
                        className="inline-flex items-center gap-3 bg-[color:var(--color-amber)] text-[color:var(--color-ink-deep)] px-6 py-3.5 type-display text-lg hover:brightness-110 transition-all shadow-[0_0_32px_var(--amber-glow)]"
                    >
                        continue
                        <span aria-hidden className="text-xl">→</span>
                    </button>
                </div>
            )}
        </DialogueBox>
    );
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
