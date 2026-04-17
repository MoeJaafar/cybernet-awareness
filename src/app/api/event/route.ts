import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

export async function POST(req: Request) {
    const supabase = getServiceClient();
    if (!supabase) {
        return NextResponse.json({ error: "supabase not configured" }, { status: 503 });
    }

    const body = await req.json();
    const { sessionId, type, payload } = body;

    if (!sessionId || !type) {
        return NextResponse.json({ error: "missing sessionId or type" }, { status: 400 });
    }

    const { error } = await supabase.from("events").insert({
        session_id: sessionId,
        type,
        payload: payload ?? {},
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
