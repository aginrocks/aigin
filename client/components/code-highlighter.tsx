import React from 'react';
import { useEffect, useState, useRef } from 'react';
const { codeToHtml } = await import('shiki');

export type CodeHighlighterProps = {
    code: string;
    language?: string;
};

// Cache for storing highlighted code
const highlightCache = new Map<string, string>();

let lastGeneration = '';

export default React.memo(function CodeHighlighter({
    code,
    language = 'javascript',
}: CodeHighlighterProps) {
    const [highlighted, setHighlighted] = useState(lastGeneration);
    const [mounted, setMounted] = useState(false);
    const [isHighlighting, setIsHighlighting] = useState(false);
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
            setIsHighlighting(true);

            try {
                // Use the browser-compatible import

                // Check if this is still the latest request
                if (currentRequest !== highlightRequestRef.current) {
                    return; // Abandon if a newer request has been made
                }

                const html = await codeToHtml(code, {
                    lang: language,
                    theme: 'github-dark',
                });

                // Double-check we're still the latest request
                if (currentRequest === highlightRequestRef.current) {
                    // Cache the result
                    highlightCache.set(cacheKey, html);
                    lastGeneration = html;
                    console.log(highlightCache);
                    setHighlighted(html);
                }
            } catch (error) {
                console.error('Failed to highlight code:', error);
                if (currentRequest === highlightRequestRef.current) {
                    const fallback = `<pre><code>${code}</code></pre>`;
                    highlightCache.set(cacheKey, fallback);
                    setHighlighted(fallback);
                }
            } finally {
                if (currentRequest === highlightRequestRef.current) {
                    setIsHighlighting(false);
                }
            }
        }

        highlight();
    }, [code, language, mounted, cacheKey]);

    // // Prevent hydration mismatch and flashing
    // if (!mounted) {
    //     return (
    //         <pre>
    //             <code>{code}</code>
    //         </pre>
    //     );
    // }

    // // Show previous content while highlighting to prevent flash
    // if (isHighlighting && !highlighted) {
    //     return (
    //         <pre>
    //             <code>{code}</code>
    //         </pre>
    //     );
    // }

    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
});
