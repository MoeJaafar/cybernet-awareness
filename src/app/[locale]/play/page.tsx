"use client";

import { useRouter } from "next/navigation";
import { BootSequence } from "@/components/BootSequence";
import { listScenarios } from "@/lib/scenarios";
import { useRequireSession } from "@/lib/require-session";
import { useLocale } from "@/lib/i18n/use-locale";

export default function PlayPage() {
    useRequireSession();
    const router = useRouter();
    const locale = useLocale();
    const first = listScenarios(locale)[0];
    return (
        <BootSequence
            onDone={() => router.push(`/${locale}/scenario/${first.id}`)}
        />
    );
}
