import type { Messages } from "./types";
import { en } from "./messages/en";
import { ar } from "./messages/ar";
import { stripHarakatDeep } from "@/lib/strip-harakat";

export type Locale = "en" | "ar";

export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";

const BUNDLES: Record<Locale, Messages> = { en, ar };

// AR strings carry full ḥarakāt for the TTS pipeline. On screen the
// vocalisation reads as visual noise, so we serve a stripped clone for
// display. The raw bundle is reachable via `getMessagesRaw` for the
// audio-gen script.
const DISPLAY_BUNDLES: Record<Locale, Messages> = {
    en,
    ar: stripHarakatDeep(ar),
};

export function isLocale(value: string): value is Locale {
    return (LOCALES as string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
    return DISPLAY_BUNDLES[locale];
}

export function getMessagesRaw(locale: Locale): Messages {
    return BUNDLES[locale];
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
    return locale === "ar" ? "rtl" : "ltr";
}

export type { Messages } from "./types";
