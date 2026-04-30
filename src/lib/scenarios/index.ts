import type { Scenario, ScenarioId } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { stripHarakatDeep } from "@/lib/strip-harakat";
import { phishing as phishingEn } from "./phishing";
import { passwordFortress as passwordFortressEn } from "./password-fortress";
import { vishing as vishingEn, vishingCallConfig as vishingCallConfigEn } from "./vishing";
import { usbDrop as usbDropEn, usbStickConfig as usbStickConfigEn } from "./usb-drop";
import { publicWiFi as publicWiFiEn, publicWiFiPickerConfig as publicWiFiPickerConfigEn } from "./public-wifi";
import { phishing as phishingAr } from "./ar/phishing";
import { passwordFortress as passwordFortressAr } from "./ar/password-fortress";
import { vishing as vishingAr, vishingCallConfig as vishingCallConfigAr } from "./ar/vishing";
import { usbDrop as usbDropAr, usbStickConfig as usbStickConfigAr } from "./ar/usb-drop";
import { publicWiFi as publicWiFiAr, publicWiFiPickerConfig as publicWiFiPickerConfigAr } from "./ar/public-wifi";

// AR scenarios carry full ḥarakāt for the TTS pipeline. We strip them
// for display so the on-screen Arabic doesn't read like a Quranic
// mushaf. The raw scenarios are reachable via the *_RAW exports for
// the audio-gen script.
const SCENARIOS_BY_LOCALE_RAW: Record<Locale, Scenario[]> = {
    en: [phishingEn, passwordFortressEn, vishingEn, usbDropEn, publicWiFiEn],
    ar: [phishingAr, passwordFortressAr, vishingAr, usbDropAr, publicWiFiAr],
};

const SCENARIOS_BY_LOCALE: Record<Locale, Scenario[]> = {
    en: SCENARIOS_BY_LOCALE_RAW.en,
    ar: stripHarakatDeep(SCENARIOS_BY_LOCALE_RAW.ar),
};

const BY_ID: Record<Locale, Record<ScenarioId, Scenario>> = {
    en: Object.fromEntries(SCENARIOS_BY_LOCALE.en.map((s) => [s.id, s])),
    ar: Object.fromEntries(SCENARIOS_BY_LOCALE.ar.map((s) => [s.id, s])),
};

export function listScenarios(locale: Locale): Scenario[] {
    return SCENARIOS_BY_LOCALE[locale];
}

export function listScenariosRaw(locale: Locale): Scenario[] {
    return SCENARIOS_BY_LOCALE_RAW[locale];
}

export function getScenario(
    locale: Locale,
    id: ScenarioId,
): Scenario | undefined {
    return BY_ID[locale]?.[id];
}

/** Display-stripped configs for the workspace mock-config selectors. */
export const VISHING_CALL_CONFIG: Record<Locale, typeof vishingCallConfigEn> = {
    en: vishingCallConfigEn,
    ar: stripHarakatDeep(vishingCallConfigAr),
};
export const USB_STICK_CONFIG: Record<Locale, typeof usbStickConfigEn> = {
    en: usbStickConfigEn,
    ar: stripHarakatDeep(usbStickConfigAr),
};
export const PUBLIC_WIFI_PICKER_CONFIG: Record<
    Locale,
    typeof publicWiFiPickerConfigEn
> = {
    en: publicWiFiPickerConfigEn,
    ar: stripHarakatDeep(publicWiFiPickerConfigAr),
};

/** Raw configs (full ḥarakāt preserved) for the audio-gen script. */
export const VISHING_CALL_CONFIG_RAW: Record<Locale, typeof vishingCallConfigEn> = {
    en: vishingCallConfigEn,
    ar: vishingCallConfigAr,
};
export const USB_STICK_CONFIG_RAW: Record<Locale, typeof usbStickConfigEn> = {
    en: usbStickConfigEn,
    ar: usbStickConfigAr,
};
export const PUBLIC_WIFI_PICKER_CONFIG_RAW: Record<
    Locale,
    typeof publicWiFiPickerConfigEn
> = {
    en: publicWiFiPickerConfigEn,
    ar: publicWiFiPickerConfigAr,
};
