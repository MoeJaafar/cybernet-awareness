import type { Scene } from "@/lib/types";
import { splitBeats } from "@/lib/beats";
import type { Locale } from "@/lib/i18n";

/**
 * Derive the audio URL for each typed beat in a scene. Paths match
 * the layout produced by `scripts/generate-audio.ts` so no manual
 * per-file wiring is needed.
 *
 *   outcome beat N   →  /audio/<locale>/<scenarioId>/<sceneId>-<NN>.mp3
 *   debrief takeaway →  /audio/<locale>/<scenarioId>/<sceneId>-takeaway.mp3
 *   debrief lesson N →  /audio/<locale>/<scenarioId>/<sceneId>-lesson-<NN>.mp3
 *   quiz prompt      →  /audio/<locale>/<scenarioId>/<sceneId>-prompt.mp3
 *
 * `undefined` entries render silently (used for scene types we don't
 * narrate, e.g. decision prompts).
 */
export function buildBeatAudioPaths(
    locale: Locale,
    scenarioId: string,
    scene: Scene,
): (string | undefined)[] {
    const base = `/audio/${locale}/${scenarioId}/${scene.id}`;
    switch (scene.type) {
        case "outcome":
            return splitBeats(scene.narration).map(
                (_, i) => `${base}-${pad(i + 1)}.mp3`,
            );
        case "debrief":
            return [
                `${base}-takeaway.mp3`,
                ...splitBeats(scene.lesson).map(
                    (_, i) => `${base}-lesson-${pad(i + 1)}.mp3`,
                ),
            ];
        case "quiz":
            return [`${base}-prompt.mp3`];
        default:
            return [];
    }
}

/** Path for quiz feedback option (0 → a, 1 → b, …). */
export function feedbackAudioPath(
    locale: Locale,
    scenarioId: string,
    sceneId: string,
    optionIndex: number,
): string {
    const letter = String.fromCharCode(97 + optionIndex);
    return `/audio/${locale}/${scenarioId}/${sceneId}-fb-${letter}.mp3`;
}

/** Path for the boot intro lines (one per index, 1-based). */
export function bootAudioPath(locale: Locale, index1Based: number): string {
    return `/audio/${locale}/boot/${pad(index1Based)}.mp3`;
}

/**
 * Path for a vishing caller line. Caller config historically held
 * absolute audio paths; this resolver lets us swap them per locale
 * without rewriting the caller config every time.
 */
export function callerAudioPath(
    locale: Locale,
    scenarioId: string,
    index1Based: number,
): string {
    return `/audio/${locale}/${scenarioId}/caller-${pad(index1Based)}.mp3`;
}

function pad(n: number): string {
    return String(n).padStart(2, "0");
}
