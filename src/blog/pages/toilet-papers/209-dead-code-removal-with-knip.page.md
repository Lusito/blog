---
tags:
  - "Technical Debt"
  - "JavaScript"
  - "TypeScript"
  - "Web Development"
  - "Toilet Paper"
title: "Dead Code Removal With Knip"
description: >
  We all know the problem: The codebase keeps growing and you end up with lots of code that isn't actively used anymore. Find out how to manage this easily.
created: "2025-03-25"
---

## Problem

Why is dead code bad? After all, you might still need it in the future?

- It causes confusion when inspecting the current state of the application.
- It increases bundle size if tree-shaking is not able to properly remove it.
- You keep maintaining it when refactoring code, which increases development time.
- Unused code and dependencies can be security risks.

So, removing dead code is always a good idea. If you really need to reactivate previously dead code, you can always use git history to get it back!

In small code-bases it might be easy to get rid of dead code, but what if you are migrating a huge application onto a new UI framework step by step?

## Solution

With [Knip](https://knip.dev/) you can identify dead code in TypeScript and JavaScript projects. Knip not only finds files and exports, which are unused, but also unused dependencies.

Knip comes with lots of plugins, which bring support for React, Vue, Astro, etc. with almost no need for configuration files.

In my latest project at work, I was able to identify **131** completely unused files and **8** unused dependencies. After removing them and using the `--fix` option to remove unused exports, I was able to remove dead code from files that are still being used and after doing so found even more files and dependencies to completely remove.

**Additional Notes:**

- Obviously, you'll need to be careful, as no tool can identify everything correctly and some code may seem dead to knip, but actually isn't. You can use JsDoc to mark code as `@public` to prevent knip from complaining here.
- Knip can be integrated into the build-pipeline, so that new dead code can be identified before merging a pull request!
- A good addition to Knip is obviously a good linting setup which detects unused variables, like https://typescript-eslint.io/rules/no-unused-vars/.

## Example

A quick run can be triggered like this:

```bash
npx knip
```

If you want to install knip into your project, you can easily do so with npm init:

```bash
npm init @knip/config
npm run knip
```

Of course, this can also be one with yarn, pnpm, bun, etc.: https://knip.dev/overview/getting-started

## Conclusion

Since I've introduced Knip into our code-base, almost every time I touch legacy code, I get to remove dead code as well, making the code-base slimmer and easier to reason with little by little.

Some things can't be automatically detected, for example when some conditional code in a function is never actually executed because the input provided by the caller never causes this condition to become truthy. So there's still some work for you to manually do, but it's such a blessing to get a lot of it detected and removed automatically without having to think about it too much.
