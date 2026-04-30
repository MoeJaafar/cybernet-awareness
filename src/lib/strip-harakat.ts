/**
 * Remove the seven short-vowel ḥarakāt from Arabic text but keep
 * shaddas (gemination), maddah, and superscript alef.
 *
 * Why: scenario / message strings are vocalised so the ElevenLabs TTS
 * pronounces them correctly (otherwise "marḥaban" comes out as
 * "moraḥiban", etc). On screen, the same density looks like a Quranic
 * mushaf — too heavy for cinematic narration. We keep the source
 * strings vocalised (the audio script reads them as-is) and strip at
 * display time only.
 *
 * Stripped (Unicode):
 *   U+064B ً  Fathatan
 *   U+064C ٌ  Dammatan
 *   U+064D ٍ  Kasratan
 *   U+064E َ  Fatha
 *   U+064F ُ  Damma
 *   U+0650 ِ  Kasra
 *   U+0652 ْ  Sukun
 *
 * Kept:
 *   U+0651 ّ  Shadda      (the user asked for these)
 *   U+0653 ٓ  Maddah
 *   U+0670 ٰ  Superscript alef
 */
const HARAKAT = /[ً-ِْ]/g;

export function stripHarakat(text: string): string {
    return text.replace(HARAKAT, "");
}

/**
 * Deep-walk an arbitrary value and return a clone with every string
 * leaf passed through `stripHarakat`. Functions, dates, and other
 * non-plain types are returned by reference (we don't deep-clone them).
 */
export function stripHarakatDeep<T>(value: T): T {
    if (typeof value === "string") {
        return stripHarakat(value) as unknown as T;
    }
    if (Array.isArray(value)) {
        return value.map((v) => stripHarakatDeep(v)) as unknown as T;
    }
    if (value !== null && typeof value === "object") {
        const proto = Object.getPrototypeOf(value);
        if (proto !== Object.prototype && proto !== null) return value;
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            out[k] = stripHarakatDeep(v);
        }
        return out as unknown as T;
    }
    return value;
}
