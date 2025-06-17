import { useEffect, useState, useRef, memo } from 'react';

export type CodeHighlighterProps = {
    code: string;
    language?: string;
};

// Cache for storing highlighted code
const highlightCache = new Map<string, string>();

let lastGeneration = '';

export const CodeHighlighter = memo(function Highlight({
    code,
    language = 'javascript',
}: CodeHighlighterProps) {
    const [highlighted, setHighlighted] = useState(lastGeneration);
    const [mounted, setMounted] = useState(false);
    const highlightRequestRef = useRef<number>(0);

    // Create cache key
    const cacheKey = `${language}:${code}`;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Check cache first
        const cachedResult = highlightCache.get(cacheKey);
        if (cachedResult) {
            setHighlighted(cachedResult);
            return;
        }

        // Increment request counter to handle race conditions
        const currentRequest = ++highlightRequestRef.current;

        async function highlight() {
            try {
                // Use the browser-compatible import
                const { codeToHtml } = await import('shiki');

                // Check if this is still the latest request
                if (currentRequest !== highlightRequestRef.current) {
                    return; // Abandon if a newer request has been made
                }

                const html = await codeToHtml(code, {
                    lang: language,
                    theme: 'rose-pine-moon',
                });

                // Double-check we're still the latest request
                if (currentRequest === highlightRequestRef.current) {
                    // Cache the result
                    highlightCache.set(cacheKey, html);
                    lastGeneration = html;
                    // console.log(highlightCache);
                    setHighlighted(html);
                }
            } catch (error) {
                console.error('Failed to highlight code:', error);
                if (currentRequest === highlightRequestRef.current) {
                    const fallback = `<pre><code>${code}</code></pre>`;
                    highlightCache.set(cacheKey, fallback);
                    setHighlighted(fallback);
                }
            }
        }

        highlight();
    }, [code, language, mounted, cacheKey]);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: highlighted }}
            className="text-sm [&>pre]:px-4 [&>pre]:py-3 cursor-text"
        />
    );
});
