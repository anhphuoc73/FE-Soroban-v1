export function getDarkerColor(hex, factor = 0.7) {
    if (!/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
        throw new Error("Invalid hex color format");
    }

    // Normalize to 6-digit hex if it's a short hex (e.g., #FFF → #FFFFFF)
    let color = hex.replace(/^#/, "");
    if (color.length === 3) {
        color = color.split("").map((char) => char + char).join("");
    }

    // Convert hex to RGB
    const r = Math.round(parseInt(color.substring(0, 2), 16) * factor);
    const g = Math.round(parseInt(color.substring(2, 4), 16) * factor);
    const b = Math.round(parseInt(color.substring(4, 6), 16) * factor);

    // Ensure values are within 0-255 and return as a hex string
    const toHex = (value) => value.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getContrastingTextColor(bgColor) {
    if (!bgColor) return 'white'; // default to white if no background color provided
    // Get a darker version of the background color
    return getDarkerColor(bgColor, 0.7);
};
