---
tags: ["TypeScript", "JavaScript", "Web Development", "Toilet Paper"]
title: "JavaScript Proxy Object"
description: >
    Need to provide an object without knowing which operations are applied to it and without writing them manually?
    No problem with JavaScript Proxy Object!
created: "2020-10-23"
modified: "2022-08-21"
---

## Problem

You want to provide an object and you don't know beforehand which operations will be applied on it? Or maybe you know which operations, but to write every single operation manually would be way too time consuming? By operations I mean e.g. reading, writing, deleting, instantiating (new), calling, enumerating, examining, etc.

## Solution

With the JavaScript (ES6) [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object, you can define so-called handlers (sometimes called traps) for all operations that can be performed on an object. In these handlers, you can intercept the actual request and implement your own logic. As you can see, a JavaScript proxy object has nothing to do with a network proxy.

## Example

A target and a handler object are passed to the proxy constructor. The functions in the handler object receive the target as the first parameter and possibly further parameters depending on the type. So, we have a strict separation between data and logic. Each of the following functions is optional:

```ts
// It's a Trap!
const handlers = {
    getPrototypeOf(target) { /* ... */ },
    setPrototypeOf(target, v) { /* ... */ },
    isExtensible(target) { /* ... */ },
    preventExtensions(target) { /* ... */ },
    getOwnPropertyDescriptor(target, p) { /* ... */ },
    has(target, p) { /* ... */ },
    get(target, p, receiver) { /* ... */ },
    set(target, p, value, receiver) { /* ... */ },
    deleteProperty(target, p) { /* ... */ },
    defineProperty(target, p, attributes) { /* ... */ },
    enumerate(target) { /* ... */ },
    ownKeys(target) { /* ... */ },
    apply(target, thisArg, argArray) { /* ... */ },
    construct(target, argArray, newTarget) { /* ... */ },
}
const data = { foo: 'bar' };
const proxy = new Proxy(data, handlers);
```

## Possible Applications:

-   Creating mocks in the field of unit testing
-   Uncomplicated access to databases, or translating from one API to another
-   Performing an operation on multiple objects (distribution principle)
-   Logging, caching, data validation, read-only access, side effects, ...

## Further Aspects

-   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
-   https://www.digitalocean.com/community/tutorials/js-proxy-traps
-   https://ponyfoo.com/articles/es6-proxy-traps-in-depth
-   A private project where I used proxies: https://github.com/Lusito/mockzilla
-   More examples: [LDFlex](https://github.com/LDflex/LDflex), [Immer](https://github.com/immerjs/immer), [Alpine.js](https://github.com/alpinejs/alpine), [exploringjs.com](https://exploringjs.com/es6/ch_proxies.html)
-   Apart from IE, Opera Mini, and Baidu [all browsers](https://caniuse.com/proxy) support the proxy object
-   Alternatively, there is a polyfill, which does not support all traps: https://www.npmjs.com/package/proxy-polyfill
