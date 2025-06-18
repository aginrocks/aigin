import { useEffect, useState } from 'react';

/**
 * A React hook to track if a specific keyboard key is currently pressed down.
 *
 * @param key The string representation of the key to track (e.g., 'Meta', 'Control', 'Alt', 'Shift', 'a', 'Enter').
 * @returns A boolean indicating whether the specified key is currently pressed.
 */
export function useModifier(key: string): boolean {
    const [pressed, setPressed] = useState<boolean>(false);

    useEffect(() => {
        const onDown = (e: KeyboardEvent) => {
            if (e.key === key) {
                setPressed(true);
            }
        };

        const onUp = (e: KeyboardEvent) => {
            if (e.key === key) {
                setPressed(false);
            }
        };

        document.addEventListener('keydown', onDown);
        document.addEventListener('keyup', onUp);

        // Cleanup function to remove event listeners when the component unmounts
        // or when the 'key' dependency changes.
        return () => {
            document.removeEventListener('keydown', onDown);
            document.removeEventListener('keyup', onUp);
        };
    }, [key]); // Re-run effect if the 'key' prop changes

    return pressed;
}
