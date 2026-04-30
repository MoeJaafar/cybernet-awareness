/**
 * Split a paragraph into beats at sentence boundaries. Keeps the
 * terminating punctuation on each beat. Used by TypedNarrative at
 * runtime AND by the audio-generation script so that one mp3 is
 * produced per beat and they stay in sync by construction.
 *
 * Recognises Latin terminators (. ? !) and Arabic terminators
 * (؟ U+061F, ؛ U+061B). Splits only when the terminator is followed
 * by whitespace, so URLs and abbreviations stay intact.
 */
export function splitBeats(paragraph: string): string[] {
    return paragraph
        .split(/(?<=[.?!؟؛]) +/)
        .map((s) => s.trim())
        .filter(Boolean);
}
