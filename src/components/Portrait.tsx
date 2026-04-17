/**
 * Character portrait. Accepts a role + expression and picks the SVG
 * from /public/art/characters. SVGs are plain <img> elements, we
 * want them crisp on any DPI and we don't need to style their
 * internals.
 */
export function Portrait({
    role,
    expression = "neutral",
    size = "md",
}: {
    role: "player" | "attacker" | "maya" | "priya" | "tom";
    expression?:
        | "neutral"
        | "alarmed"
        | "pleased"
        | "concerned"
        | "smug";
    size?: "sm" | "md" | "lg";
}) {
    const src = `/art/characters/${role}-${expression}.svg`;
    return (
        <img
            src={src}
            alt={`${role} ${expression}`}
            className={`select-none ${sizeClass(size)}`}
            draggable={false}
        />
    );
}

function sizeClass(size: "sm" | "md" | "lg") {
    switch (size) {
        case "sm":
            return "w-32";
        case "lg":
            return "w-80";
        default:
            return "w-full";
    }
}
