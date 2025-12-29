---
tags:
  - "TypeScript"
title: "Adding Types Vs Type-Safe Code"
description: >
  I regularly see TypeScript developers confuse type-safety with adding types. This post is about understanding the difference and how to actually make things type-safe.
created: "2025-12-29"
---

TypeScript lets you specify types in lots of different ways. But it will only be checked during build-time and even there, TypeScript does not check everything.

## Problem

In order to understand the difference between adding types and making code type-safe, let's take a look at the following simplified example:

`store.ts`

```ts
const store: Record<string, unknown> = {};

export function getStoreItem<T>(key: string): T | undefined {
  return store[key] as T | undefined;
}

export function setStoreItem<T>(key: string, value: T) {
  store[key] = value;
}
```

The above creates a store and allows setting items on it with a key and retrieving the value as well.

One might use it like this:

`logic.ts`

```ts
//...
setStoreItem<string>("foo", "bar");

//...
const value = getStoreItem<string>("foo");
console.log(value); // value is of type string | undefined
```

This looks about right? After all, the following would fail during build-time:

`logic.ts`

```ts
// Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
setStoreItem<string>("foo", 10);
```

But imagine someone uses the store at some other place, unaware, that the key `"foo"` is already being used as a string

`conflict.ts`

```ts
setStoreItem<number>("foo", 10);
```

This would be fine by TypeScript, but it would break existing code during runtime.

This is because TypeScript does not know the connection between the key `"foo"` and its desired type.

## Solution

In order to make the code type-safe, we need to establish a connection that TypeScript can validate. That is usually a parameter, variable or constant, which contains type information.

So let's try this again:

`store.ts`

```ts
type StoreKey<T> = symbol & { __type?: T };

export function createStoreKey<T>(
  description?: string,
): StoreKey<T> {
  return Symbol(description);
}

const store: Record<StoreKey<unknown>, unknown> = {};

export function getStoreItem<T>(
  key: StoreKey<T>,
): T | undefined {
  return store[key] as T | undefined;
}

export function setStoreItem<T>(key: StoreKey<T>, value: T) {
  store[key] = value;
}
```

We've introduced a constant that can store our type information (not during runtime) and whenever we use it on `setStoreItem` and `getStoreItem`, TypeScript can automatically infer the type correctly:

`logic.ts`

```ts
const fooKey = createStoreKey<string>("foo");

setStoreItem(fooKey, "");

const value = getStoreItem(fooKey);
console.log(value); // value is of type string | undefined

// This would fail during build-time:
// Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
setStoreItem(fooKey, 10);
```

With this solution, we have type-safety, which is checked at build-time without having to manually specify the type everywhere we use it.

Also, the new approach using a symbol completely avoids the issue of using the same key for something completely different, so we're safe at runtime as well.

**Well, there might be one case, where this can still fail:** If the value we are passing to `setStoreItem` doesn't have the correct type specified (or worse, is of type `any`), you are doomed. For example the data came from a server and has not been validated.

## Conclusion

Does the above seem fabricated to you? While it was not taken from existing code, a very similar problem and solution can be found in the Vue framework:

- [Typing Provide/Inject](https://vuejs.org/guide/typescript/composition-api#typing-provide-inject)

I've encountered this sort of confusion between adding types and type-safety in other places as well. Most recently when formiks [useFormikContext](https://formik.org/docs/api/useFormikContext) was introduced in a customer project.

### Lessons Learned

- Purely specifying a type does not make it type-safe.
- You need to establish a connection between your variables and your types so that TypeScript can verify that connection.
- This usually comes with additional checks that will be performed in runtime.
- Try to reduce the places where you manually specify types, as that leaves you open to human error.
- If you are unsure if the data from a server is correctly typed, introduce code generators or if you want to be extra sure, use a schema validator like [zod](https://zod.dev/).

You should also avoid casting types, but that is a topic for another day.
