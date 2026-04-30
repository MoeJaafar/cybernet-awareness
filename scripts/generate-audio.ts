/**
 * Audio generation — ElevenLabs.
 *
 * Walks every narrated beat in the game (boot intro, decision prompts,
 * outcomes, debriefs, quizzes, and the vishing caller lines) for one
 * locale and produces one mp3 per beat under public/audio/<locale>/.
 * Beat-splitting uses the same splitBeats() the game uses at runtime,
 * so the audio and the typed text stay aligned by construction.
 *
 * Usage:
 *   npm run gen:audio:en -- --dry      list what would be generated (EN)
 *   npm run gen:audio:en               generate missing EN mp3s
 *   npm run gen:audio:ar               generate missing AR mp3s
 *   npm run gen:audio -- --locale ar   explicit locale flag
 *   npm run gen:audio -- --force       regenerate everything
 *
 * Env (read from .env.local):
 *   ELEVENLABS_API_KEY
 *   ELEVENLABS_NARRATOR_VOICE_ID            shared default narrator voice
 *   ELEVENLABS_DAVID_VOICE_ID               shared default caller voice
 *   ELEVENLABS_NARRATOR_VOICE_ID_AR         optional override for AR
 *   ELEVENLABS_DAVID_VOICE_ID_AR            optional override for AR
 *   ELEVENLABS_MODEL_ID                     optional, default eleven_multilingual_v2
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { config as loadEnv } from "dotenv";
import { splitBeats } from "../src/lib/beats";
import {
    listScenariosRaw,
    VISHING_CALL_CONFIG_RAW,
} from "../src/lib/scenarios";
import { getMessagesRaw, type Locale } from "../src/lib/i18n";

loadEnv({ path: ".env.local" });

type Voice = "narrator" | "david";

type Job = {
    text: string;
    voice: Voice;
    outputPath: string;
};

const OUT_ROOT = "public/audio";

function pad(n: number, width = 2): string {
    return String(n).padStart(width, "0");
}

function localeFolder(locale: Locale): string {
    return join(OUT_ROOT, locale);
}

function scenarioFolder(locale: Locale, scenarioId: string): string {
    return join(localeFolder(locale), scenarioId);
}

function buildManifest(locale: Locale): Job[] {
    const jobs: Job[] = [];
    const messages = getMessagesRaw(locale);

    // Boot intro (Narrator, one mp3 per typed line). Source of truth
    // is the locale's messages bundle so the audio always matches what
    // BootSequence renders.
    messages.boot.lines.forEach((line, i) => {
        jobs.push({
            text: line.text,
            voice: "narrator",
            outputPath: join(localeFolder(locale), "boot", `${pad(i + 1)}.mp3`),
        });
    });

    // Vishing caller lines (David, one mp3 per caller line).
    const vishingCallConfig = VISHING_CALL_CONFIG_RAW[locale];
    vishingCallConfig.lines.forEach((line, i) => {
        jobs.push({
            text: line.text,
            voice: "david",
            outputPath: join(
                scenarioFolder(locale, "vishing-helpdesk"),
                `caller-${pad(i + 1)}.mp3`,
            ),
        });
    });

    // Every narrated beat in every scene of every scenario for this locale.
    for (const scenario of listScenariosRaw(locale)) {
        const folder = scenarioFolder(locale, scenario.id);
        for (const scene of Object.values(scenario.scenes)) {
            if (scene.type === "outcome") {
                splitBeats(scene.narration).forEach((text, i) => {
                    jobs.push({
                        text,
                        voice: "narrator",
                        outputPath: join(
                            folder,
                            `${scene.id}-${pad(i + 1)}.mp3`,
                        ),
                    });
                });
            }
            if (scene.type === "debrief") {
                jobs.push({
                    text: scene.takeaway,
                    voice: "narrator",
                    outputPath: join(folder, `${scene.id}-takeaway.mp3`),
                });
                splitBeats(scene.lesson).forEach((text, i) => {
                    jobs.push({
                        text,
                        voice: "narrator",
                        outputPath: join(
                            folder,
                            `${scene.id}-lesson-${pad(i + 1)}.mp3`,
                        ),
                    });
                });
            }
            if (scene.type === "quiz") {
                jobs.push({
                    text: scene.prompt,
                    voice: "narrator",
                    outputPath: join(folder, `${scene.id}-prompt.mp3`),
                });
                scene.options.forEach((opt, i) => {
                    jobs.push({
                        text: opt.feedback,
                        voice: "narrator",
                        outputPath: join(
                            folder,
                            `${scene.id}-fb-${String.fromCharCode(97 + i)}.mp3`,
                        ),
                    });
                });
            }
        }
    }

    return jobs;
}

async function generate(
    job: Job,
    locale: Locale,
    voiceIds: Record<Voice, string>,
    apiKey: string,
    modelId: string,
): Promise<void> {
    const voiceId = voiceIds[job.voice];
    const body: Record<string, unknown> = {
        text: job.text,
        model_id: modelId,
        voice_settings:
            job.voice === "david"
                ? {
                      stability: 0.6,
                      similarity_boost: 0.7,
                      style: 0.4,
                      use_speaker_boost: true,
                      speed: 0.95,
                  }
                : {
                      stability: 0.5,
                      similarity_boost: 0.75,
                      style: 0.2,
                      use_speaker_boost: true,
                      speed: 0.85,
                  },
    };
    if (locale === "ar") {
        // eleven_multilingual_v2 supports an explicit language hint.
        // Forces Arabic phoneme handling rather than letting the model
        // guess from the script.
        body.language_code = "ar";
    }
    const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
            },
            body: JSON.stringify(body),
        },
    );
    if (!res.ok) {
        throw new Error(
            `ElevenLabs ${res.status}: ${await res.text().catch(() => "")}`,
        );
    }
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(job.outputPath), { recursive: true });
    writeFileSync(job.outputPath, buf);
}

function pickLocale(argv: string[]): Locale {
    const idx = argv.indexOf("--locale");
    if (idx >= 0 && argv[idx + 1]) {
        const v = argv[idx + 1];
        if (v === "en" || v === "ar") return v;
        console.error(`Unknown locale "${v}". Use en or ar.`);
        process.exit(1);
    }
    return "en";
}

async function main() {
    const argv = process.argv.slice(2);
    const args = new Set(argv);
    const dry = args.has("--dry");
    const force = args.has("--force");
    const locale = pickLocale(argv);
    const limitIdx = argv.indexOf("--limit");
    const limit =
        limitIdx >= 0 && argv[limitIdx + 1]
            ? Math.max(1, Number(argv[limitIdx + 1]))
            : Infinity;

    let jobs = buildManifest(locale);
    if (Number.isFinite(limit)) jobs = jobs.slice(0, limit);

    // --only <substring>  filter the manifest to jobs whose output path
    // contains the substring. Handy for "give me one narrator + one
    // caller line so I can hear what the AR voices sound like" without
    // burning the whole budget.
    const onlyIdx = argv.indexOf("--only");
    if (onlyIdx >= 0 && argv[onlyIdx + 1]) {
        const needles = argv[onlyIdx + 1].split(",");
        const normalise = (s: string) => s.replace(/\\/g, "/");
        jobs = jobs.filter((j) => {
            const haystack = normalise(j.outputPath);
            return needles.some((n) => haystack.includes(normalise(n)));
        });
    }

    if (dry) {
        let existing = 0;
        let toGen = 0;
        let charBudget = 0;
        for (const j of jobs) {
            const ex = existsSync(j.outputPath);
            if (ex) existing++;
            else toGen++;
            if (force || !ex) charBudget += j.text.length;
            const flag = ex ? "skip" : "gen ";
            const voiceTag = j.voice.padEnd(8);
            console.log(
                `${flag}  ${voiceTag}  ${j.outputPath.padEnd(60)}  ${j.text.slice(0, 90)}`,
            );
        }
        console.log();
        console.log(
            `[${locale}] ${jobs.length} beats total   ${existing} existing   ${toGen} to generate`,
        );
        console.log(
            `Character budget for next run: ${charBudget.toLocaleString()} (ElevenLabs free tier ≈ 10,000 /month)`,
        );
        return;
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    // Per-locale voice overrides if present, otherwise the shared
    // default voice IDs are used. Reusing the EN voices on AR text via
    // eleven_multilingual_v2 produces foreign-accented Arabic but works
    // end-to-end without procurement.
    const narratorVoice =
        (locale === "ar" && process.env.ELEVENLABS_NARRATOR_VOICE_ID_AR) ||
        process.env.ELEVENLABS_NARRATOR_VOICE_ID;
    const davidVoice =
        (locale === "ar" && process.env.ELEVENLABS_DAVID_VOICE_ID_AR) ||
        process.env.ELEVENLABS_DAVID_VOICE_ID;
    const modelId =
        process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

    if (!apiKey || !narratorVoice || !davidVoice) {
        console.error(
            "Missing env. Add ELEVENLABS_API_KEY, ELEVENLABS_NARRATOR_VOICE_ID, ELEVENLABS_DAVID_VOICE_ID to .env.local.",
        );
        process.exit(1);
    }

    const voiceIds: Record<Voice, string> = {
        narrator: narratorVoice,
        david: davidVoice,
    };

    let made = 0;
    let skipped = 0;
    for (const job of jobs) {
        if (!force && existsSync(job.outputPath)) {
            skipped++;
            continue;
        }
        process.stdout.write(`… ${job.outputPath}`);
        try {
            await generate(job, locale, voiceIds, apiKey, modelId);
            process.stdout.write("  ✓\n");
            made++;
        } catch (err) {
            process.stdout.write("  ✗\n");
            console.error(err);
            process.exit(1);
        }
        await new Promise((r) => setTimeout(r, 120));
    }
    console.log(
        `\n[${locale}] Done. Generated ${made}, skipped ${skipped}.`,
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
