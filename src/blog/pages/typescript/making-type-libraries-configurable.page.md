---
tags: ["TypeScript", "Web Development"]
title: "Making the Types of an NPM Package Configurable"
description: >
    Sometimes you need to allow users to configure the types of your NPM package.
    Surprisingly, I couldn't find any websites covering this topic.
created: "2022-08-28"
---

## Problem

My project [tsx-dom](https://github.com/Lusito/tsx-dom/) allows creating dom elements using JSX/TSX syntax.
Originally it only supported HTML elements, but when the feature-request to support SVG elements was implemented,
the return-type for the JSX/TSX syntax suddenly changed from `HTMLElement` to `HTMLElement | SVGElement`.

This was of course a breaking change, since users expected an `HTMLElement`, and sure enough, a bug-report [was filed](https://github.com/Lusito/tsx-dom/issues/15) shortly after.

Since `HTMLElement` and `SVGElement` do not have the same properties, you'd get errors like this:
```tsx
function task(node: HTMLElement) {
    // ...
}

const div = <div />;

// Error: Property 'title' does not exist on type 'Element'.
// Property 'title' does not exist on type 'SVGElement'.
div.title = "hello";

// Error: Argument of type 'Element' is not assignable to parameter of type 'HTMLElement'.
// Type 'SVGElement' is missing ...
task(div);
```

You could work around this with type casting, but depending on how many JSX statements you have, that might result in a lot of work:
```tsx
const div = <div /> as HTMLElement;
div.title = "hello"; // No error
task(div); // No error
```

I provided a workaround the user could apply in the project, by creating a file `tsx-config.d.ts` with the following content:
```ts
declare namespace JSX {
    type Element = HTMLElement;
}
```

This worked without adjusting the rest of the code, but it was a hacky way to do this.


## Solution

So I did a few experiments using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) and came up with a more idiomatic configuration method.

Using this method, the user could simply create a file `tsx-config.d.ts` file with the following content:
```ts
import 'tsx-dom';

declare module "tsx-dom" {
    export interface TsxConfig {
        // Set one of these to false to disable support for them
        svg: false;
        // html: false;
    }
}
```

Granted, this is a bit more code, but it looks a lot more like a configuration!

If the user used the above configuration, the JSX/TSX syntax would be limited to html types only:
```tsx
// Return-type: HTMLElement
const html = <div title="What's up?">Hello</div>;

// Error: Property 'svg' does not exist on type 'JSX.IntrinsicElements'
const svg = <svg><path /></svg>;
```

## Implementation

### How the User Augments the Library

First of all, let's take a look at the configuration in detail:

First, we need to import the library itself:
```ts
import 'tsx-dom';
```
Without this, the `declare module` statement below would be the only place TypeScript looks for types of `tsx-dom`.

Now, we augment the library with an interface. I.e. we act as if tsx-dom defined the interface TsxConfig:
```ts
declare module "tsx-dom" {
    export interface TsxConfig {
        svg: false;
    }
}
```

Interfaces have declaration-merging, which means you can define them multiple times to add more properties.
So in conclusion, we tell TypeScript, that the interface TsxConfig in the module "tsx-dom" has a property `svg` with a "value" of false.


### How the Library Applies This Configuration

This is all nice, but how do we actually use this configuration in our library?

Well, first of all, we need to define the `TsxConfig` interface in the library, like this:
```ts
export interface TsxConfig {
    [s: string]: boolean;
}
```

Using an index signature, we allow for all kinds of boolean options. Other types would also be possible, but I don't need them in this example.

Now, in order to actually use this configuration, we can check for value types:

```ts
// This way assumes a fallback of true:
type TestTypeA = TsxConfig[T] extends false ? "nope" : "yep";

// This way assumes a fallback of false:
type TestTypeB = TsxConfig[T] extends true ? "yep" : "nope";
```

The fallback will be used, if the user did not configure TsxConfig manually.

Since all the configuration options in `tsx-dom` are enabled by default (fallback: true), I can write myself a helper like this:

```ts
// Returns TIF if T is specified as true in TsxConfig, otherwise TELSE
type IfTsxConfig<T extends string, TIF, TELSE> = TsxConfig[T] extends false ? TELSE : TIF;
```

And now I can use it like this:
```ts
type Element = IfTsxConfig<"html", HTMLElement, never> | IfTsxConfig<"svg", SVGElement, never>;

// If both html and svg options are set to true (or have not been configured), this evaluates to:
type Element = HTMLElement | SVGElement;

// If html was set to false, but svg to true, this evaluates to:
type Element = SVGElement;

// If svg was set to false, but html to true, this evaluates to:
type Element = HTMLElement;

// If both svg and html are set to false, this evaluates to:
type Element = never;
```

Of course, the last option is not something the user would normally configure.

Explanation:
- `never | A` becomes `A`
- `never | never` becomes `never`

The above was a union-type example. This can be used with intersections as well. Just use unknown instead of never:

```ts
type IntrinsicElementsCombined = IfTsxConfig<"html", IntrinsicElementsHTML, unknown> &
    IfTsxConfig<"svg", IntrinsicElementsSVG, unknown>;

// If both html and svg options are set to true (or have not been configured), this evaluates to:
type IntrinsicElementsCombined = IntrinsicElementsHTML & IntrinsicElementsSVG;

// If html was set to false, but svg to true, this evaluates to:
type IntrinsicElementsCombined = IntrinsicElementsSVG;

// If svg was set to false, but html to true, this evaluates to:
type IntrinsicElementsCombined = IntrinsicElementsHTML;

// If both svg and html are set to false, this evaluates to:
type IntrinsicElementsCombined = unknown;
```

Explanation:
- `unknown & A` becomes `A`
- `unknown & unknown` becomes `unknown`

## Verdict

It is possible to make the types of your library configurable. It just takes a little tinkering depending on the types of options you might want.

Things to keep in mind:
- This approach has **no** effect on the **runtime code**. If you want that, you'll need more than just a `d.ts` file.
- There is no validation in place that prevents the user from doing wrong configurations or notifies him/her if an option is not available or of a different type.

If you know better techniques or improvements for this, please let me know in the comments.
