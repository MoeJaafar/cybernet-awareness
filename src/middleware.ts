import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "en";
const COOKIE_NAME = "cybernet_locale";

function pickLocale(req: NextRequest): string {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (cookie && (LOCALES as readonly string[]).includes(cookie)) {
        return cookie;
    }
    const accept = req.headers.get("accept-language") ?? "";
    if (accept.toLowerCase().includes("ar")) return "ar";
    return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/stats") ||
        pathname.startsWith("/audio") ||
        pathname.startsWith("/art") ||
        pathname === "/favicon.ico" ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // `/` is the language picker (its own route group). Show it on
    // every visit — never auto-redirect via cookie/Accept-Language.
    if (pathname === "/") {
        return NextResponse.next();
    }

    const first = pathname.split("/")[1] ?? "";
    if ((LOCALES as readonly string[]).includes(first)) {
        const res = NextResponse.next();
        res.cookies.set(COOKIE_NAME, first, {
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
        });
        return res;
    }

    // Bare path like `/consent` — fall back to the user's last locale
    // (cookie / Accept-Language / default) and redirect into it.
    const locale = pickLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Skip Next internals and any file with an extension.
        "/((?!_next|api|stats|audio|art|favicon\\.ico|.*\\..*).*)",
    ],
};
