import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    Instrument_Serif,
    Newsreader,
    JetBrains_Mono,
    Roboto,
    DM_Sans,
    Bebas_Neue,
    Tajawal,
    Amiri,
    IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "../globals.css";
import { AudioSettingsProvider } from "@/lib/audio-settings";
import { SessionProvider } from "@/lib/session";
import { BgMusic } from "@/components/BgMusic";
import { VolumeControl } from "@/components/VolumeControl";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import {
    DEFAULT_LOCALE,
    LOCALES,
    dirOf,
    getMessages,
    isLocale,
    type Locale,
} from "@/lib/i18n";

/* Latin-script type stack (used on EN locale). */
const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-instrument-serif",
    display: "swap",
});
const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-newsreader",
    display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
    display: "swap",
});
const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-dm-sans",
    display: "swap",
});
const bebasNeue = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas-neue",
    display: "swap",
});

/* Arabic-script type stack (used on AR locale). */
const tajawal = Tajawal({
    subsets: ["arabic"],
    weight: ["400", "500", "700"],
    variable: "--font-tajawal",
    display: "swap",
});
const amiri = Amiri({
    subsets: ["arabic"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    variable: "--font-amiri",
    display: "swap",
});
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
    subsets: ["arabic"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-ibm-plex-arabic",
    display: "swap",
});

export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
    const m = getMessages(safe).metadata;
    // Explicit per-locale OG card. The root file convention
    // (src/app/opengraph-image.png) doesn't propagate into [locale]
    // when the app uses parallel route-group root layouts, so we
    // wire the URL ourselves on both locales.
    const ogImageUrl =
        safe === "ar" ? "/og-image-ar.jpg" : "/opengraph-image.png";
    const ogImages = [
        { url: ogImageUrl, width: 1200, height: 630, alt: m.ogTitle },
    ];
    return {
        title: m.title,
        description: m.description,
        openGraph: {
            title: m.ogTitle,
            description: m.ogDescription,
            type: "website",
            siteName: m.title,
            locale: safe === "ar" ? "ar_SA" : "en_US",
            images: ogImages,
        },
        twitter: {
            card: "summary_large_image",
            title: m.ogTitle,
            description: m.ogDescription,
            images: ogImages.map((i) => i.url),
        },
        alternates: {
            languages: {
                en: "/en",
                ar: "/ar",
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!isLocale(locale)) {
        notFound();
    }
    const dir = dirOf(locale);

    // Both EN and AR fonts are loaded so swapping locale at runtime
    // doesn't FOUC, but the CSS variables in globals.css resolve
    // role-based aliases to either the Latin or Arabic family
    // depending on the [data-locale] attribute on <html>.
    const fontVars = `${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${roboto.variable} ${dmSans.variable} ${bebasNeue.variable} ${tajawal.variable} ${amiri.variable} ${ibmPlexSansArabic.variable}`;

    return (
        <html lang={locale} dir={dir} data-locale={locale} className={fontVars}>
            <body className="min-h-screen">
                <SessionProvider>
                    <AudioSettingsProvider>
                        <div aria-hidden className="atmos-grid" />
                        <div aria-hidden className="atmos-sheen" />
                        <div aria-hidden className="atmos-sweep" />
                        <div aria-hidden className="atmos-scanlines" />
                        <div aria-hidden className="atmos-vignette" />
                        <div aria-hidden className="atmos-grain" />

                        <BgMusic src="/audio/bg-music.mp3" />
                        <VolumeControl />
                        <LocaleSwitch />
                        {children}
                    </AudioSettingsProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
