/**
 * Split a paragraph into beats at sentence boundaries. Keeps the
 * terminating punctuation on each beat. Used by TypedNarrative at
 * runtime AND by the audio-generation script so that one mp3 is
 * produced per beat and they stay in sync by construction.
 */
export function splitBeats(paragraph: string): string[] {
    return paragraph
        .split(/(?<=\.|\?|\!) +/)
        .map((s) => s.trim())
        .filter(Boolean);
}
