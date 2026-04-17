"use client";

import { KnowledgeTest } from "@/components/KnowledgeTest";

export default function PosttestPage() {
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
