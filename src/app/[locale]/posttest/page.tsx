"use client";

import { KnowledgeTest } from "@/components/KnowledgeTest";
import { useRequireSession } from "@/lib/require-session";
import { useLocale, useMessages } from "@/lib/i18n/use-locale";

export default function PosttestPage() {
    useRequireSession();
    const locale = useLocale();
    const m = useMessages();
    return (
        <KnowledgeTest
            title={m.posttest.title}
            seed="post"
            eventType="posttest"
            nextRoute={`/${locale}/survey`}
            nextLabel={m.posttest.nextLabel}
        />
    );
}
