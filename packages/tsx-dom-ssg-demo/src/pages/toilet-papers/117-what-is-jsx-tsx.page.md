---
tags: ["Toilet Paper", "React", "JSX/TSX", "TypeScript", "JavaScript", "Web Development"]
title: "What Is Jsx / TSX?"
description: >
    Anyone who has ever worked with React will know the file extension JSX (TSX for TypeScript) and the HTML-related syntax.
    But what lies under the hood?
created: "2019-06-28"
---

## Problem

Anyone who has ever worked with **React** will know the file extension **JSX** (**TSX** for TypeScript) and the HTML-related syntax.

Example:

```tsx
const profile = (
    <div>
        <img src={u.avatar} className="profile" alt={`Pic of ${u.firstName}`} />
        <h3>{[u.firstName, u.lastName].join(" ")}</h3>
    </div>
);
```

But how does it work.. this is magic syntax is not supported by JavaScript.

## Solution

A **transpiler** (e.g. **babel** or **tsc**) converts JSX/TSX into pure JavaScript code. The example shown above would be compiled to the following JS:

```js
const profile = React.createElement(
    "div",
    null,
    React.createElement("img", { src: u.avatar, className: "profile", alt: `Pic of ${u.firstName}` }),
    React.createElement("h3", null, [u.firstName, u.lastName].join(" "))
);
```

-   The function `React.createElement` gets as first parameter either a tag name or a component.
    -   If the **tag name** in the JSX is lowercase, e.g. <button>, the parameter will become a **string**. Otherwise (e.g. <Button>) it is a assumed to be a **function** or a **class** (which must be present in the scope with the same name).
-   The second parameter is an **object with all properties** assigned to the tag. If no properties have been assigned, this parameter is null.
-   The remaining parameters are the **children** that have been inserted into the tag.

## Example

You can easily write a replacement for React which, instead of a Virtual DOM, creates real HTML elements with `document.createElement`:

```js
function h(tag, props, ...children) {
    if (typeof tag === "function") return tag({ ...props, children });

    const element = document.createElement(tag);
    if (props) setAllAttributes(element, props);

    applyChildren(element, children);
    return element;
}
```

This function can be called instead of calling `React.createElement`. This very simple example even supports function components.

## Further Aspects

-   Babel: https://babeljs.io/docs/en/6.26.3/babel-plugin-transform-react-jsx
-   TypeScript: https://www.typescriptlang.org/docs/handbook/jsx.html
-   The last example in TypeScript a bit more in detail: https://github.com/Lusito/tsx-dom
-   React without JSX: https://reactjs.org/docs/react-without-jsx.html
-   Why JSX in React: https://reactjs.org/docs/introducing-jsx.html
