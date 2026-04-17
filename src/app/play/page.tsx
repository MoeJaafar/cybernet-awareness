"use client";

import { useRouter } from "next/navigation";
import { BootSequence } from "@/components/BootSequence";
import { listScenarios } from "@/lib/scenarios";
import { useRequireSession } from "@/lib/require-session";

export default function PlayPage() {
    useRequireSession();
    const router = useRouter();
    const first = listScenarios()[0];
    return <BootSequence onDone={() => router.push(`/scenario/${first.id}`)} />;
}
