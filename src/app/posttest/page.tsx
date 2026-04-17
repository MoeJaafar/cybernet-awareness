"use client";

import { KnowledgeTest } from "@/components/KnowledgeTest";
import { useRequireSession } from "@/lib/require-session";

export default function PosttestPage() {
    useRequireSession();
    return (
        <KnowledgeTest
            title="post-test"
            seed="post"
            eventType="posttest"
            nextRoute="/survey"
            nextLabel="One last thing"
        />
    );
}
