declare module "react-timers-hooks" {
    function useTimeout(callback: () => void, delay: number | null): void;
    function useInterval(callback: () => void, delay: number | null): void;
}