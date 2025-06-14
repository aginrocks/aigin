export function parseAppMentions(text: string): { mentions: string[]; cleanedText: string } {
    const mentionRegex = /@\{app:([^}]+)\}/g;
    const mentions: string[] = [];

    // Collect mentions while avoiding escaped ones
    const matches = Array.from(text.matchAll(mentionRegex));

    for (const match of matches) {
        // Check if escaped
        if (match.index! > 0 && text[match.index! - 1] === '\\') {
            continue;
        }
        mentions.push(match[1]);
    }

    // Remove non-escaped mentions and normalize whitespace
    const cleanedText = text
        .replace(/(^|[^\\])@\{app:[^}]+\}/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

    return { mentions, cleanedText };
}
