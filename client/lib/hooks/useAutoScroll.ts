import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoScrollOptions {
    /**
     * The scroll container element
     */
    scrollElement: HTMLElement | null;
    /**
     * Dependencies that trigger auto scroll (e.g., messages array)
     */
    dependencies: any[];
    /**
     * Threshold in pixels from bottom to consider "near bottom"
     * Default: 100
     */
    threshold?: number;
    /**
     * Smooth scrolling behavior
     * Default: true
     */
    smooth?: boolean;
}

export function useAutoScroll({
    scrollElement,
    dependencies,
    threshold = 100,
    smooth = true,
}: UseAutoScrollOptions) {
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastScrollTop = useRef(0);

    // Check if user is near the bottom
    const isNearBottom = useCallback(() => {
        if (!scrollElement) return false;

        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        return scrollHeight - scrollTop - clientHeight <= threshold;
    }, [scrollElement, threshold]);

    // Scroll to bottom function
    const scrollToBottom = useCallback(() => {
        if (!scrollElement) return;

        try {
            scrollElement.scrollTo({
                top: scrollElement.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            });
        } catch (error) {
            // Fallback for browsers that don't support smooth scrolling
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [scrollElement, smooth]);

    // Handle scroll events to detect user scrolling
    const handleScroll = useCallback(() => {
        if (!scrollElement) return;

        const currentScrollTop = scrollElement.scrollTop;

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Check if user scrolled up (manual scroll)
        if (currentScrollTop < lastScrollTop.current) {
            setIsUserScrolling(true);
            setShouldAutoScroll(false);
        }

        lastScrollTop.current = currentScrollTop;

        // Reset user scrolling flag after a delay
        scrollTimeoutRef.current = setTimeout(() => {
            setIsUserScrolling(false);
            // Re-enable auto scroll if user is near bottom
            if (isNearBottom()) {
                setShouldAutoScroll(true);
            }
        }, 150);
    }, [scrollElement, isNearBottom]);

    // Set up scroll event listener
    useEffect(() => {
        if (!scrollElement) return;

        scrollElement.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            scrollElement.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [scrollElement, handleScroll]);

    // Auto scroll when dependencies change
    useEffect(() => {
        if (!scrollElement || !shouldAutoScroll || isUserScrolling) return;

        // Small delay to ensure DOM updates are complete
        const timeoutId = setTimeout(() => {
            // Double check that we should still auto scroll after the delay
            if (!isUserScrolling && shouldAutoScroll) {
                scrollToBottom();
            }
        }, 10);

        return () => clearTimeout(timeoutId);
    }, [...dependencies, scrollElement, shouldAutoScroll, isUserScrolling]);

    // Initialize scroll position
    useEffect(() => {
        if (!scrollElement) return;

        // Check if we should start with auto scroll enabled
        setShouldAutoScroll(isNearBottom());
    }, [scrollElement, isNearBottom]);

    return {
        scrollToBottom,
        isNearBottom: isNearBottom(),
        isUserScrolling,
        shouldAutoScroll,
        enableAutoScroll: () => setShouldAutoScroll(true),
        disableAutoScroll: () => setShouldAutoScroll(false),
    };
}
