---
tags:
  - "React"
  - "Redux"
  - "Performance"
  - "JavaScript"
  - "TypeScript"
  - "Web Development"
title: "React Performance Issues And Solutions"
description: >
  Working on projects that have a wide range of skill-levels, I regularly find things that cause performance issues.
  This article shows some problems and possible solutions.
created: "2025-12-13"
---

While I do stand by my statement, that you should [stop using React](https://blog.lusito.info/stop-using-and-recommending-react.html),
I am aware, that you aren't always able to just rewrite an existing project.

This article is here to help those unfortunate souls.

## React Works Better With Stable References

React tries to avoid work when nothing changes. However, the test for change is usually a direct or shallow comparison.

So whenever you create a new instance of something that is used by React, it might cause React to do more work.

**Not every new instance is easily spotted:**

- Using `Array.filter/map` are often overlooked.
- Instances that are created outside of the component, for example in another function or custom hook are missed by both human reviewers and automatic solutions.

You want variables/constants/parameters that you pass to React to have a **stable reference**.

Before we take a look at possible solutions, **keep in mind, that not everything needs to be perfect**.
Sometimes it's completely valid to ignore these issues as they might not affect the user very much.
If you know your reference is only passed down one level, don't worry about it too much.

However, a changed reference can lead to recalculations and even cause a **chain-reaction**, causing rerenders in your entire application.
So if your references or those who depend on it, are passed down multiple levels (via providers or prop-drilling) try to **make them stable**!

## Unstable References

With that in mind, let's take a look at the basic problem and possible solutions.

`Problem 1`

```tsx
// If options is nullish, it will be set to a new array on
// every render, making findOption change as well
function MyComponent({ options = [] }: MyComponentProps) {
  const findOption = useCallback(
    (label: string) => {
      return options.find((o) => o.label === label);
    },
    [options],
  );

  return <NextComponent find={findOption} />;
}
```

`Solution 1.A`

```tsx
// Simple: Make the empty array stable.
// You can even reuse this constant in other code.
const emptyArray = [] as const;
// The `as const` is important. If TypeScript complains,
// you might need to change your types to ReadonlyArray.

function MyComponent({
  options = emptyArray,
}: MyComponentProps) {
  const findOption = useCallback(
    (label: string) => {
      return options.find((o) => o.label === label);
    },
    [options],
  );

  return <NextComponent find={findOption} />;
}
```

`Solution 1.B`

```tsx
// You could also just drop the default assignment:
function MyComponent({ options }: MyComponentProps) {
  const findOption = useCallback(
    (label: string) => {
      return (options ?? []).find((o) => o.label === label);
    },
    [options],
  );

  return <NextComponent find={findOption} />;
}
```

The above solutions work great until the caller makes a mistake:

`Problem 2`

```tsx
function MyCaller() {
  // Every time MyCaller is rerendered, MyComponent will
  // be rerendered as well, even if you memoized it!
  return <MyComponent options={[{ label: "Foo" }]} />;
}
```

`Solution 2.A`

```tsx
// If the options don't depend on anything inside MyCaller,
// just create it once outside of the component
const callerOptions = [{ label: "Foo" }];

function MyCaller() {
  return <MyComponent options={callerOptions} />;
}
```

`Solution 2.B`

```tsx
// If the options depend on something inside MyCaller,
// memoize it before passing:
function MyCaller({ prefix }) {
  const callerOptions = useMemo(
    () => [{ label: `${prefix}: Foo` }],
    [prefix],
  );
  return <MyComponent options={callerOptions} />;
}
```

## Eslint and React Compiler to the Rescue?

The [exhaustive-deps](https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) linting rule helps you detect new instances and you should enable it! However the rule is not perfect:

- It only looks at the current function (component or custom hook):
- It does not know if the props/parameters that have been passed to the current function are stable.
- It does not know if the return values of functions you call within the current function are stable.

The [React compiler](https://react.dev/learn/react-compiler) can automagically memoize things for you. However, it has the same limitations as the linting rule.

Let's take a look at this example and what the React compiler does with it:

`Problem 3`

```tsx
const fetchUrl = "https://github.com";
const useFetchData = () => {
  return () => fetch(fetchUrl);
};

function MyProvider() {
  const fetchData = useFetchData();
  const fetchDataDebounced = debounce(fetchData, 500);

  const value = useMemo(
    () => ({
      fetchData,
      fetchDataDebounced,
    }),
    [fetchData, fetchDataDebounced],
  );

  return (
    <MyContext.Provider value={value}>
      {/* ... */}
    </MyContext.Provider>
  );
}
```

`React Compiler Output`

```tsx
import { c as _c } from "react/compiler-runtime";
const fetchUrl = "https://github.com";
const useFetchData = () => {
  // React compiler does not memoize this
  return () => fetch(fetchUrl);
};

function MyProvider() {
  const $ = _c(7);
  const fetchData = useFetchData();
  let t0;
  // React compiler uses fetchData as dependency to memoize
  // fetchDataDebounced. But since fetchData is unmemoized,
  // fetchDataDebounced is essentially unmemoized as well
  if ($[0] !== fetchData) {
    t0 = debounce(fetchData, 500);
    $[0] = fetchData;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const fetchDataDebounced = t0;
  // This is the useMemo we actually added,
  // but it faces the same issue
  let t1;
  if ($[2] !== fetchData || $[3] !== fetchDataDebounced) {
    t1 = { fetchData, fetchDataDebounced };
    $[2] = fetchData;
    $[3] = fetchDataDebounced;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  const value = t1;
  // Additional memoization is added by the compiler,
  // but it's worthless as well
  let t2;
  if ($[5] !== value) {
    t2 = <MyContext.Provider value={value} />;
    $[5] = value;
    $[6] = t2;
  } else {
    t2 = $[6];
  }
  return t2;
}
```

`Solution 3`

```tsx
const fetchUrl = "https://github.com";
const useFetchData = () => {
  return useCallback(() => fetch(fetchUrl), []);
};

function MyProvider() {
  const fetchData = useFetchData();
  const fetchDataDebounced = useMemo(
    () => debounce(fetchData, 500),
    [fetchData],
  );

  const value = useMemo(
    () => ({
      fetchData,
      fetchDataDebounced,
    }),
    [fetchData, fetchDataDebounced],
  );

  return (
    <MyContext.Provider value={value}>
      {/* ... */}
    </MyContext.Provider>
  );
}
```

- Eslint rules won't detect any of those issues
- React compiler adds some automatic memoization, but since it doesn't memoize fetchData, all of its work is in vain.

You'll need to add a `useCallback` to `useFetchData` **and** if you're not using React compiler, you'll also need to add a `useMemo` for the `fetchDataDebounced`.

**So what can you do?**

- **Always** memoize values that you return inside your custom hooks.
  - They should only return new values if something actually changed.
  - I know this might seem overkill, but it saves you a lot of time (when writing and when reviewing code) if you don't have to think about whether the return values of a custom hook are memoized or not.
- If you use non-hook functions which return a new instance, which is used by React, **always** wrap them in a `useMemo`.
- If you pass values to custom hooks or components, make sure they are stable or make sure the hook has no problem with them being unstable.
  - `useLatestCallback` from the next section might help here.

## Improving `useCallback` for Better Performance

You might have found yourself in a situation, where a `useCallback` had a long list of dependencies.

- This is annoying, as you constantly need to update the dependencies list when changing the code.
- Many dependencies also mean more possible reference changes, which can cause a chain reaction again.

**Good news everyone**. Making a better alternative to `useCallback` is actually quite simple (for most cases).

`useLatestCallback`

```tsx
function useLatestCallback<T extends (...args: any[]) => any>(
  callback: T,
) {
  // Create a reference to the callback
  const fn = useRef<T>(callback);
  // Update it every render
  fn.current = callback;

  // useRef(...).current returns the initial value.
  // This way the return value never changes.
  return useRef(
    // just forward the args to the latest callback
    ((...args) => fn.current(...args)) as T,
  ).current;
}
```

**This has one drawback:**
It adds an additional function call. So whenever you call the memoized callback an additional step is done.
However, this is rarely an issue, since these callbacks are rarely called.

**Don't** use `useLatestCallback` if you want to call the function **very** often in a short time.
In all other cases you're probably fine using `useLatestCallback` instead of `useCallback` and saving yourself a lot of headache.

You can even make a variation of it for a debounced callback. Here is a version using lodashes debounce and one without an external library:

`useDebouncedCallback`

```tsx
function useDebouncedCallback<T extends any[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  const fn = useRef(callback);
  fn.current = callback;

  const handle = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const debounced = useCallback(
    (...args: T) => {
      clearTimeout(handle.current);
      handle.current = setTimeout(
        () => fn.current(...args),
        delay,
      );
    },
    [delay],
  );

  // On unmount, cancel pending calls
  useEffect(() => {
    return () => clearTimeout(handle.current);
  }, []);

  return debounced;
}
```

`useDebouncedCallback (lodash)`

```tsx
// If you use lodash or similar, you can make it simpler:
function useDebouncedCallback<
  T extends (...args: any[]) => any,
>(callback: T, delay: number) {
  const fn = useRef(callback);
  fn.current = callback;

  const debounced = useCallback(
    debounce(((...args) => fn.current(...args)) as T, delay),
    [delay],
  );

  // On unmount, cancel pending calls
  useEffect(() => {
    return () => debounced.cancel();
  }, [debounced]);

  return debounced;
}
```

## Redux `useSelector` Being Misused

`useSelector` is meant to help you only update your component when the values you actually care about change.
However, I've often seen this being used incorrectly, making it cause a rerender every time something in the store changes.

### Returning an Object

This happens quite often, but is also spotted easily if you know about it:

`Problem 4`

```ts
function MyComponent() {
  // The selector function returns a new object.
  // Redux detects a change even if nothing you care about
  // actually changed.
  const { foo, bar } = useSelector((store) => ({
    foo: store.foo,
    bar: store.bar,
  }));
  // ...
}
```

`Solution 4.A`

```ts
function MyComponent() {
  const { foo, bar } = useSelector(
    (store) => ({
      foo: store.foo,
      bar: store.bar,
    }),
    // passing shallowEqual makes sure that a rerender
    // only happens if one of the properties changes.
    shallowEqual,
  );
  // ...
}
```

`Solution 4.B`

```ts
function MyComponent() {
  // You can just call useSelector once for each value
  const foo = useSelector((store) => store.foo);
  const bar = useSelector((store) => store.bar);
  // ...
}
```

### Destructuring a Value Too Late

This happens mostly to beginners, but is sometimes overlooked in code reviews:

`Problem 5`

```ts
function MyComponent() {
  // If fooBar only contains foo and bar, this is fine.
  // However, if it has more properties, it will also cause
  // a rerender of this component if one of the other values
  // in fooBar changes.
  const { foo, bar } = useSelector((store) => store.fooBar);
  // ...
}
```

The solution is obviously to let the selector function only return the values you care about.

### Mapping or Filtering Within The Selector

This one is often overlooked in code-reviews.

`Problem 6`

```ts
function MyComponent() {
  const { foo, todoIds } = useSelector(
    (store) => ({
      foo: store.foo,
      // map returns a new instance.
      // shallowEqual will always detect a change!
      todoIds: store.todos.map((v) => v.id),
    }),
    shallowEqual,
  );
  // ...
}
```

`Solution 6.A`

```ts
function MyComponent() {
  const { foo, todos } = useSelector(
    (store) => ({
      foo: store.foo,
      todos: store.todos,
    }),
    shallowEqual,
  );

  // This is a simple solution, but it has a drawback:
  // This component will rerender even if only the labels
  // of the todo change (while ids stay the same).
  const barIds = useMemo(() => bar.map((v) => v.id), [bar]);
  // ...
}
```

`Solution 6.B`

```ts
function MyComponent() {
  const foo = useSelector((store) => store.foo);
  // By separating the values, we can use shallowEqual again:
  const todoIds = useSelector(
    (store) => store.todos.map((v) => v.id),
    shallowEqual,
  );
  // ...
}
```

`Solution 6.C`

```ts
// Using createSelector from the reselect project you can
// avoid useMemo. Redux Toolkit also exports it!
const selectFooAndTodos = createSelector(
  // First, just select values without mapping anything
  [
    (store: RootState) => store.foo,
    (store: RootState) => store.todos,
  ],
  // Then provide a function to create the values
  (foo, todos) => ({
    foo,
    todoIds: todos.map((v) => v.id),
  }),
);

function MyComponent() {
  const { foo, todoIds } = useSelector(selectFooAndTodos);
  // This still has the issue from solution 6.A:
  // This component will rerender even if only the labels
  // of the todo change (while ids stay the same).
  // ...
}
```

`Solution 6.D`

```ts
// For more comments, see Solution 6.C
const selectFooAndTodos = createSelector(
  [
    (store: RootState) => store.foo,
    (store: RootState) => store.todos,
  ],
  (foo, todos) => ({
    foo,
    todoIds: todos.map((v) => v.id),
  }),
  {
    // By adding a custom result equality check,
    // we can only rerender if the ids change!
    memoizeOptions: {
      resultEqualityCheck: customEqual,
    },
  },
);

function MyComponent() {
  const { foo, todoIds } = useSelector(selectFooAndTodos);
  // ...
}
```

- Solution `6.B` would be the simplest solution that works
- Solution `6.D` is a lot more code, but might also be worth a shot depending on your use-case.

## Using React Context As an Alternative to Redux

Some developers try to reduce the amount of dependencies in their project, which is a good thing, as there is less potential for security risk.

However, some of these libraries have solved problems that you need to consider when writing your alternative solution.

Here's a **real world example** I found in a customer project.

This actually had a lot more state in it, was messier and was named `AppContextProvider`,
but I've simplified it to only the notifications part, which still illustrates the issue.

`Problem 7`

```tsx
// Create context
const NotificationsContext =
  createContext<NotificationsContextType | null>(null);

const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error("Forgot to add the provider?");

  return context;
};

// Provide state and setters
function NotificationsProvider({ children }) {
  const [success, setSuccess] = useState("");
  const [warn, setWarn] = useState("");
  const [error, setError] = useState("");

  const value = useMemo(
    () => ({
      success,
      warn,
      error,
      setSuccess,
      setWarn,
      setError,
    }),
    [success, warn, error, setSuccess, setWarn, setError],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Show notifications
function Notifications() {
  const {
    success,
    warn,
    error,
    setSuccess,
    setWarn,
    setError,
  } = useNotifications();

  // ... render notifications with buttons to remove them.
}

// Publish notifications
function SomeComponent() {
  const { setSuccess, setError } = useNotifications();

  const onClick = useCallback(async () => {
    try {
      const data = await fetch(/*...*/);
      setSuccess("I am done!");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }, [setSuccess, setError]);

  return <button onClick={onClick}>Submit</button>;
}
```

- As you can see, `SomeComponent` uses only parts of the notifications context (only the setters).
- However, it needs to rerender every time `setSuccess`, `setWarn` or `setError` has been called.
- There are a lot of components that call `useNotifications`.

**So** `SomeComponent` **rerenders when:**

- ... it completed its task even if it didn't change its own state.
- ... any other component calls any of the setters.

**So what can you do to avoid this?**

- Split this into two providers.. one for the setters and one for the values.
- Use Redux, zustand or some other global state management library.
- The customer project was already using Redux, so it was an easy choice

React context is a nice thing to have, but it can cause terrible performance problems if its value changes and is consumed by a lot of components.

## Final Thoughts

- All of these issues can be fixed, but you need to keep them in mind when doing code reviews, as there is no automatic solution to find them all.
- If you establish coding guidelines, you can improve the developer experience and the performance of your app at the same time.
