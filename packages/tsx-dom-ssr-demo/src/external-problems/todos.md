## support css-modules, etc.

basic support possible (as style tags), not sure if external files would be supported with nx

## amp-mode, which warns on script tags and inlines styles:

by doing querySelector on the dom-nodes, everyone could easily do this.

## Timeouts

Via custom fetch call, which just triggers the error boundary using a Promise.race.

## Cancelable promises/async methods

If timed out or other error, how to stop promises from continueing?
It's not a huge problem, since extra requests shouldn't do anything on finished nodes, but it could reduce cpu load.

Idea 1: AbortController, which triggers an error in a call like this?

```ts
await this.withBailout(this.fetch('...'));
```

Problem: this will throw for all fetches.. we probably only want them limited to an error-boundary.
