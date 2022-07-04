---
tags: ["Toilet Paper", "React", "JavaScript", "TypeScript", "Web Development", "Partial Hydration", "Progressive Enhancement"]
title: "Don't Drink So Much: Reducing Frontend Code"
description: >
    Some developers keep using the tools they are used to, rather than the best tool for the job.
    Recently, I had to develop a Multi Page Application using a Single Page Application Framework and here are my thoughts on how to do it better.
date: "2022-06-03T10:00:00.000Z"
---

## Introduction

Imagine you have a hammer, which is perfect for getting nails into the wall. This hammer is so good, you start using it to
slam screws into the wall and to remove those dried up, hard to remove remains from your dishes.
Sounds familiar? No? Try replacing "hammer" with the development tool of your choice and "screw" with a project that has been implemented using this tool.

## Hydration & Partial Hydration

When you do server-side rendering with React, you'll need to use a feature called **hydration** in order to make
this HTML interactive again in the browser (for example a menu, slideshow or videos). When you do this,
React, by default, sends much more data to the browser than actually needed. There are **opt-out** methods,
which allow you to mark components as "static", so that only the server needs to process it.
This will result in HTML being generated on the server, but data (JSON) and code (.js)
for these elements don't need to be shipped to the browser. This is called **partial hydration**.
This does, however, mean that those elements don't get client-side logic.
As you can imagine, this needs careful evaluation and it's not always as straight-forward to implement as you might think.

Aside from the size of the shipped content, performance is a huge topic as well.
The "time-to-interactive" is quite high when using React on content-heavy pages and the server-side rendering takes its time as well.

## Example of a Bigger Project

For some time now, I've been working on a big german news website, which uses a React based framework
to generate HTML on the server and hydrate it in the browser. Sadly, we didn't have any influence on the technology choice.
The problem: By default, everything you need to render on the server needs to get to the browser as well in order to restore interactivity.
We're talking both code (.js) and data (JSON), since we don't want to re-fetch them again in the browser.
At one point, we had over **20 MB** on the first request (just the HTML, which includes the bundled JSON data).

With a lot of work (and ugly workarounds), we managed to reduce this to below **1MB** using partial hydration.
This is still far from ideal.

## Alternatives

When choosing a technology, you should always consider what you're trying to accomplish. A news website is no Single-Page-Application, but a Multi-Page-Application. Focus should be on fast page layout and good SEO values.

In order to achieve this, we need an **opt-in** process to connect those few features, which actually need to be interactive,
with their respective code. In the old days this was the normal way to do this. Nowadays in the SPA hype, it's easy to forget.
I have my hammer and I use it to batter everything with it. Bad performance on the server can be (somewhat) masked with CDNs,
but that doesn't help with bad performance in the browser.

You don't need to go back to the stone-age with PHP & JQuery. There are modern alternatives. They are just hard to find.
Helpful search-terms are **partial hydration** and **progressive enhancement**.

## Interesting Tools & Frameworks

-   https://astro.build/ is a build-tool, which can be used with the popular SPA frameworks, but you have an opt-in process.
    In my opinion, this doesn't go far enough though. SPA frameworks are not made for this and can never be as fast as something made for the job.
-   https://nanojsx.io/ is more like what I imagine: A new lightweight framework based on the JSX syntax.
    It still seems to be in the early stages of development though.
-   https://stimulus.hotwired.dev/ takes a completely different approach and ignores how you create the HTML.
    Instead it focuses on how to make the HTML interactive again. Obviously, you'll need to figure out how to create the HTML now.
    This approach is easily combined with https://turbo.hotwired.dev/, which improves the page-change performance of mostly static websites.
-   Purists can use custom-elements to connect existing HTML with JavaScript code. In this case you probably want to avoid the Shadow-Dom,
    so that the website still shows correctly even without JavaScript.
-   React will soon get **server components**.. it's been dragging on for quite some time though and there are still some open questions,
    for example if (and how) this works with CDNs. Initially, this will not be supported directly by React, but by separate projects like Next.js:
    https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html
-   https://remix.run/ looks promising, even if it currently ignores the problem of partial hydration, it still fits the category **progressive enhancement**.
