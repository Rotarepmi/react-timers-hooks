import React from "react";
import { render } from "@testing-library/react";

import { useTimeout } from "../src";

const TestComponent: React.FC<{ delay: number | null; callback: () => void }> = ({ delay, callback }) => {
    useTimeout(() => {
        callback();
    }, delay);

    return <div />;
};

let callback = jest.fn();
const delay = 1000;

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
    callback = jest.fn();
});

describe("useTimeout", () => {
    it("should call setTimeout on mount & clearTimeout on un-mount", () => {
        const { unmount } = render(<TestComponent delay={delay} callback={callback} />);

        unmount();

        expect(setTimeout).toHaveBeenCalledTimes(2); // test-renderer runs setTimeout as well
        expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    it("should run timeout with proper delay value (1000ms)", () => {
        const { unmount } = render(<TestComponent delay={delay} callback={callback} />);

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delay);
        expect(setTimeout).not.toHaveBeenCalledWith(expect.any(Function), delay * 1.5);

        unmount();
    });

    it("should call the callback after delay (1000ms) via advanceTimersByTime", () => {
        const { unmount } = render(<TestComponent delay={delay} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(delay);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call the callback after delay (1000ms) via advanceTimersToNextTimer", () => {
        const { unmount } = render(<TestComponent delay={delay} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersToNextTimer(1);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call the callback after delay (1000ms) via runOnlyPendingTimers", () => {
        const { unmount } = render(<TestComponent delay={delay} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.runOnlyPendingTimers();

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call the callback only after delay (1000ms)", () => {
        const { unmount } = render(<TestComponent delay={delay} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(delay * 0.5);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(delay * 0.5);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        jest.advanceTimersByTime(delay * 3);

        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should stop timeout when delay value is set to null", () => {
        const { unmount, rerender } = render(<TestComponent delay={delay} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(delay * 0.5);

        expect(callback).not.toBeCalled();

        rerender(<TestComponent delay={null} callback={callback} />);

        jest.advanceTimersByTime(delay);

        expect(callback).not.toBeCalled();

        unmount();
    });

    it("should start timeout when delay value is set to number", () => {
        const { unmount, rerender } = render(<TestComponent delay={null} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(delay);

        expect(callback).not.toBeCalled();

        rerender(<TestComponent delay={delay} callback={callback} />);

        jest.advanceTimersByTime(delay * 2);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call currently provided callback", () => {
        const { unmount, rerender } = render(<TestComponent delay={delay} callback={callback} />);
        const newCallback = jest.fn();

        jest.advanceTimersByTime(delay * 0.5);

        rerender(<TestComponent delay={delay} callback={newCallback} />);

        jest.advanceTimersByTime(delay * 0.5);

        expect(callback).not.toBeCalled();
        expect(newCallback).toBeCalled();
        expect(newCallback).toBeCalledTimes(1);

        unmount();
    });
});
