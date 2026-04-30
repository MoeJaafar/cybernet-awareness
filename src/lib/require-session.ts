"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/use-locale";

const STORAGE_KEY = "cybernet_session_id";

/**
 * Redirects to the splash page (in the current locale) if no active
 * session exists. Call at the top of any page that requires a session
 * (pretest, play, scenarios, posttest, survey).
 */
export function useRequireSession() {
    const router = useRouter();
    const locale = useLocale();
    useEffect(() => {
        const sid = localStorage.getItem(STORAGE_KEY);
        if (!sid) {
            router.replace(`/${locale}`);
        }
    }, [router, locale]);
}
