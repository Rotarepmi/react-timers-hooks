# React Timers Hooks [![npm version](https://badge.fury.io/js/react-timers-hooks.svg)](https://www.npmjs.com/package/react-timers-hooks) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://camo.githubusercontent.com/21132e0838961fbecb75077042aa9b15bc0bf6f9/68747470733a2f2f62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565)](https://www.typescriptlang.org/)

The useInterval/useTimeout custom React hooks accepts 2 arguments - your callback function and delay value which can be a `Number` or `null`.

When delay is set to `null` the timer is cleared, `Number` value represents timeout in milliseconds.  
When delay has changed during the countdown, the tick resets and starts again with new delay value.

Built with TypeScript.

## Installation

```
npm i react-timers-hooks
```  
or  
```
yarn add react-timers-hooks  
```

## Basic usage

```
import { useInterval, useTimeout } from "react-timers-hooks";

...
useInterval (
    () => {
        doSomething();
    },
    5000
);

useTimeout (
    () => {
        doSomething2();
    },
    2000,
);
```

## Usage with conditionals
```
import { useInterval, useTimeout } from "react-timers-hooks";

...
const [interval, setInterval] = useState(false);
const [waitAndGo, waitAndGo] = useState(false);

useInterval (
    () => {
        doSomething();
    },
    interval ? 5000 : null,
);

useTimeout (
    () => {
        doSomething2();
    },
    waitAndGo ? 2000 : null,
);
```

## License

MIT