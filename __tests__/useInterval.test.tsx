import React from "react";
import { render } from "@testing-library/react";

import { useInterval } from "../src";

const TestComponent: React.FC<{ interval: number | null; callback: () => void }> = ({ interval, callback }) => {
    useInterval(() => {
        callback();
    }, interval);

    return <div />;
};

let callback = jest.fn();
const tick = 1000;

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
    callback = jest.fn();
});

describe("useInterval", () => {
    it("should call setInterval on mount & clearInterval on un-mount", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        unmount();

        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    it("should run interval with proper tick value (1000ms)", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), tick);
        expect(setInterval).not.toHaveBeenCalledWith(expect.any(Function), tick * 1.5);

        unmount();
    });

    it("should call the callback only on tick (on 1000ms) via advanceTimersByTime", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(tick * 0.5);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(tick * 0.5);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call the callback only on tick (on 1000ms) via advanceTimersToNextTimer", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersToNextTimer(1);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call the callback only on tick (on 1000ms) via runOnlyPendingTimers", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.runOnlyPendingTimers();

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should call the callback 3 times (on 3 ticks) via advanceTimersByTime", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(tick * 3);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(3);

        unmount();
    });

    it("should call the callback 3 times (on 3 ticks) via advanceTimersToNextTimer", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersToNextTimer(3);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(3);

        unmount();
    });

    it("should call the callback 3 times (on 3 ticks) via runOnlyPendingTimers", () => {
        const { unmount } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.runOnlyPendingTimers();
        jest.runOnlyPendingTimers();
        jest.runOnlyPendingTimers();

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(3);

        unmount();
    });

    it("should stop interval when interval value is set to null", () => {
        const { unmount, rerender } = render(<TestComponent interval={tick} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(tick);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);

        rerender(<TestComponent interval={null} callback={callback} />);

        jest.advanceTimersByTime(tick * 2);

        expect(callback).toBeCalledTimes(1);

        unmount();
    });

    it("should start interval when interval value is set to number", () => {
        const { unmount, rerender } = render(<TestComponent interval={null} callback={callback} />);

        expect(callback).not.toBeCalled();

        jest.advanceTimersByTime(tick);

        expect(callback).not.toBeCalled();

        rerender(<TestComponent interval={tick} callback={callback} />);

        jest.advanceTimersByTime(tick * 2);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(2);

        unmount();
    });

    it("should call currently provided callback", () => {
        const { unmount, rerender } = render(<TestComponent interval={tick} callback={callback} />);
        const newCallback = jest.fn();

        jest.advanceTimersByTime(tick);

        rerender(<TestComponent interval={tick} callback={newCallback} />);

        jest.advanceTimersByTime(tick * 2);

        expect(callback).toBeCalled();
        expect(callback).toBeCalledTimes(1);
        expect(newCallback).toBeCalled();
        expect(newCallback).toBeCalledTimes(2);

        unmount();
    });
});
