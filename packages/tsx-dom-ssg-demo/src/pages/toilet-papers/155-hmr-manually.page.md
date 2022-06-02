---
tags: ["Toilet Paper", "JavaScript", "TypeScript", "Hot Module Replacement", "Web Development", "Game Development"]
title: "Address Hot Module Replacement API manually"
description: >
    HMR works automagically in almost all popular frontend frameworks.
    It is, however, possible to control HMR manually. How and why is shown in this Toilet Paper.
date: "2022-05-19T10:00:00.000Z"
---

## Problem

Frontend developers are familiar with **Hot Module Replacement (HMR)** in the context of various frameworks, such as React. The idea is simple: You use a development server, change code, and without having to reload the web page (which means losing state), the logic updates itself. This happens **automagically** for popular frameworks.

But there is also the possibility to control HMR manually. There is no standardized API yet, but the differences between the dev servers are relatively small, probably because most follow the top dog **webpack**.

## Solution

The most important functions:

```js
// Accept updates
module.hot.accept(...)
// Reject updates
module.hot.decline(...)
// Tear-down and transfer of data
module.hot.dispose((data) => { ... })
```

A simplified example:

```js
const value = "constant";

export default value;

// module.hot is only present in dev server
if (module.hot) {
    // Accept updates
    module.hot.accept();

    // Transfer of information
    // to the updated version:
    module.hot.dispose((data) => {
        data.value = value;
    });

    // Was information transferred
    // from the old version?
    const oldValue = module.hot.data?.value;
    if (oldValue) {
        console.log("On-Update", {
            oldValue,
            value,
        });
    } else {
        console.log("On-Create", { value });
    }
}
```

## Important to Keep In Mind:

As soon as file A accepts an update, file B, which imports A, no longer receives the update. Of course, it is important to remember that file B may have imported a value that is a different instance after the update. A new file C could then already have received the new value, while file B still has the old one. Well, you have to take care of this problem yourself.

## Real-Life Purposes:

Why would you want to do this? Maybe there is no out-of-the-box support for the UI framework you want to use. Or you have a scenario that can't be mapped with classic UI frameworks.

In my case, I was developing a video game. For that, I wrote a dependency injection framework where files can register (and update) their services globally. Here, the DI framework ensures that only proxies of the services are returned in the dev server and thus the reference to the service instance can be exchanged in the background without losing the state.

## Further Aspects

-   Summary on HMR: https://webpack.js.org/concepts/hot-module-replacement/
-   API: https://webpack.js.org/api/hot-module-replacement/
