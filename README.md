# React Timers Hooks
### Usage
```
import { useInterval, useTimeout } from "react-timers-hooks";

...
const [interval, setInterval] = useState(false);

useInterval(
    () => {
        doSomething();
    },
    interval ? 5000 : null,
);

useTimeout(
    () => {
        doSomething2();
    },
    2000
)
```

The useInterval/useTimeout accepts 2 arguments - your callback function and delay value which can be a Number or null.

If delay is set to null the timer is cleared.
If the delay has changed during the countdown, the tick resets and starts again with new delay value.

License: MIT.