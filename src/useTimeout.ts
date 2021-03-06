import { useEffect, useRef } from "react";

function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the timeout.
    useEffect(() => {
        function tick() {
            if (savedCallback && savedCallback.current) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setTimeout(tick, delay);
            return () => clearTimeout(id);
        }
    }, [delay]);
}

export default useTimeout;