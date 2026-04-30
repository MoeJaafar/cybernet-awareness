"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { type Locale, isLocale, DEFAULT_LOCALE, getMessages } from "./index";

/**
 * Reads the current locale out of the URL segment exposed by the
 * [locale] dynamic route. Falls back to the default locale outside a
 * [locale] subtree.
 */
export function useLocale(): Locale {
    const params = useParams<{ locale?: string }>();
    const candidate = params?.locale;
    if (typeof candidate === "string" && isLocale(candidate)) {
        return candidate;
    }
    return DEFAULT_LOCALE;
}

/** Hook that returns the messages bundle for the current locale. */
export function useMessages() {
    const locale = useLocale();
    return useMemo(() => getMessages(locale), [locale]);
}

/**
 * Re-prefix a path with the current locale. Pass an unprefixed path
 * like "/consent" and get "/en/consent" back. Idempotent if the path
 * already starts with /<locale>/.
 */
export function useLocalePath(): (path: string) => string {
    const locale = useLocale();
    return useMemo(() => {
        return (path: string) => withLocale(path, locale);
    }, [locale]);
}

export function withLocale(path: string, locale: Locale): string {
    if (!path.startsWith("/")) path = `/${path}`;
    const segs = path.split("/").filter(Boolean);
    if (segs[0] && isLocale(segs[0])) {
        // Replace the existing locale prefix.
        segs[0] = locale;
        return "/" + segs.join("/");
    }
    return `/${locale}${path === "/" ? "" : path}`;
}

/** Strips the leading /<locale> from a path, used by the locale switcher. */
export function stripLocale(path: string): string {
    const segs = path.split("/").filter(Boolean);
    if (segs[0] && isLocale(segs[0])) {
        return "/" + segs.slice(1).join("/");
    }
    return path;
}

/** Convenience for components/pages that want to read the path without locale. */
export function usePathWithoutLocale(): string {
    const pathname = usePathname() ?? "/";
    return stripLocale(pathname);
}
