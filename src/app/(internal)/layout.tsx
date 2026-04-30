import "../globals.css";

/**
 * Minimal English root layout for internal pages (/stats). No
 * providers, no atmosphere stack, just html/body so Next.js has a
 * second root layout to satisfy the "every page needs a root" rule.
 */
export default function InternalLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" dir="ltr">
            <body className="min-h-screen">{children}</body>
        </html>
    );
}
