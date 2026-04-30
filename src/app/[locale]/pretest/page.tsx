"use client";

import { KnowledgeTest } from "@/components/KnowledgeTest";
import { useRequireSession } from "@/lib/require-session";
import { useLocale, useMessages } from "@/lib/i18n/use-locale";

export default function PretestPage() {
    useRequireSession();
    const locale = useLocale();
    const m = useMessages();
    return (
        <KnowledgeTest
            title={m.pretest.title}
            seed="pre"
            eventType="pretest"
            nextRoute={`/${locale}/play`}
            nextLabel={m.pretest.nextLabel}
        />
    );
}
