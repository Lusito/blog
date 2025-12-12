---
tags:
  - "JavaScript"
  - "TypeScript"
  - "Web Development"
  - "Toilet Paper"
title: "Tagged Template Literals"
description: >
  A lot of you might have already stumbled over a tagged template literal.
  It looks similar to a template literal, but with a name in front of the first `.
  But what exactly is this? And how do you create one?
created: "2025-03-22"
---

## Template Literal Vs Tagged Template Literal

A **template literal** is a string enclosed in back-ticks (\`) and can include JS expressions:

```ts
const styles = `
  display: ${display};
  color: ${color};
`;
```

A **tagged template literal** is almost the same, but with a name in front:

```ts
const styles = css`
  display: ${display};
  color: ${color};
`;
```

If you are interested, why the syntax highlighting in the above code blocks are different, look further below.

## Basic Idea

A tagged template literal is basically a function with variable parameters:

- The first parameter is an array of strings that have been used.
- The remaining parameters are the values that have been inserted via `${...}` syntax.

So you can think of the above css example as being translated to:

<!-- prettier-ignore -->
```ts
const styles = css([
  "\n  display: ",
  ";\n  color: ",
  ";\n",
], display, color);
```

The css function can now use these parameters to calculate the result.

## Example

Let's make us a totally fabricated example!

```ts
const a = { hello: "world" };
console.log(`My value is: ${a}`);
```

Bonkers, this prints `"My value is: [object Object]"`!

With a tagged template literal, we can make this better:

<!-- prettier-ignore -->
```ts
function readable(strings: TemplateStringsArray, ...values: unknown[]) {
  return strings
    .map((str, i) =>
      i === strings.length - 1
        ? str
        : `${str}${JSON.stringify(values[i])}`,
    )
    .join("");
}

const a = { hello: "world" };
console.log(readable`My value is: ${a}`);
```

Hooray, it prints `"My value is: {"hello":"world"}"`!;

### Explanation of the Above

- The `strings` parameter is of type `TemplateStringsArray`, but for most operations, you can see it as a normal string array.
- I've specified `values` as `unknown[]`, but you can actually use types here and TypeScript will complain if they don't match!
- In the callback for `map`, there's a special case for the last element in `strings`.
  There is always one more string than there is values, because `${...}` expressions are always surrounded by a string, even if it's an empty one.
- Of course it is possible to check the type of the values in runtime to change what is happening. You might even have functions as values and call them from within the tagged template literal function. This is actually what [styled-components](https://styled-components.com/) does.
- You don't have to return a string. It's just as well possible to return anything else. TypeScript will pick up on it.

## More Goodies

You can even add special support in development tools. For example [prettier](https://prettier.io/blog/2020/08/24/2.1.0.html) supports formatting html and css within `html`/`css` tagged template literals and the [lit-html extension](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) for VSCode adds syntax highlighting and code-completion for them (you can even use the extension without using lit itself).

On this blog, [highlight.js](https://highlightjs.org/) also adds syntax-highlighting for them:

```ts
// Nicely color printed and formatted
const result = html`
  <html>
    <style>
      a {
        color: "black";
      }
    </style>
    <body>
      <a href="https://blog.lusito.info">Click me</a>
    </body>
  </html>
`;

// Other tags don't do this:
const result2 = lmth`
    <html>
        <style>
            a {
                color: "black";
            }
        </style>
        <body>
            <a href="https://blog.lusito.info">Click me</a>
        </body>
    </html>
`;
```

## Further Aspects

- MDN reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
