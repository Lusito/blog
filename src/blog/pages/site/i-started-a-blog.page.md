---
tags: ["Web Development", "Progressive Enhancement", "JSX/TSX", "TypeScript", "JavaScript", "Projects"]
title: "I Started a Blog"
description: >
  Recently, I wrote a rant about using the right tools for the job.
  This sparked some ideas and I needed a project to try it on.
  I had been writing posts from time to time, so it seemed like a good time to start my own blog.
created: "2022-08-21"
---

## Hello, World of Blogs

Hi, my name is Santo Pfingsten, also known as [Lusito](https://github.com/lusito/).

Recently, I wrote [Toilet Paper](https://blog.lusito.info/tag/toilet-paper.html) about [using the right tools for the job](https://blog.lusito.info/dont-drink-so-much-reducing-frontend-code.html).
This sparked a couple of ideas I wanted to try on a new project and I ended up creating this blog.
You'll notice a couple of posts that predate this one. I've written them before on various platforms and now copied (and in some cases translated) them here.

## The Technology Behind This Blog

The ideas mentioned above included a new way to generate HTML using Server-Side-Rendering and Static-Site-Generation.
My project [tsx-dom](https://github.com/lusito/tsx-dom) would serve as a starting point, as I liked the [JSX/TSX Syntax](https://blog.lusito.info/what-is-jsx-tsx.html), but I didn't want to use React. tsx-dom did not support async code, so I had to create a new project from it, which will be released as open-source soon (stay tuned).

Since I didn't want to create a full Next.js clone all by myself, I used [nx](https://nx.dev) to help with the project setup. Here are some measurements I did:

- The static site generation for this blog takes about 10 seconds.
- Only **293ms** of this time is used to generate all (49) HTML files and the sitemap.xml.
- This is less than **6ms** per file.

While there is room for improvement on the startup time using nx, I'm quite happy with the performance of my code.

## Getting All Lighthouse Scores to 100

As wrote in [Don't Drink So Much](https://blog.lusito.info/dont-drink-so-much-reducing-frontend-code.html), a Multi-Page-Application should focus on fast page layout and good SEO values. A good starting point for this is creating a [Lighthouse Report](https://web.dev/measure/).

When I finished the initial code for my blog, I was curious, how well it would perform and what i'd have to change to get all scores to 100.
After all, getting even small improvements on the scores of the React based news-website I talked about in [the rant](https://blog.lusito.info/dont-drink-so-much-reducing-frontend-code.html) took a lot of effort.

I expected it to be less work here, but I didn't expect it to be this easy:

- Add a couple of meta tags
- Convert images from png to webp
- Do a couple of accessibility improvements
- Set appropriate caching headers

Accessibility took longer than everything else combined: Fixing the contrast ratio for small texts took me about 2 days, as I had to adjust the colors without drifting too much from the desired design.

Granted, the news-website has a lot more content, so it's not a fair comparison, but I'm still quite happy with how well this approach performs.

## Opt-In For Client-Side Logic

The above results show how easy it can be to optimize your webpage if you follow an opt-in approach for client-side logic.

There's actually very little client-side code on this blog:

- A "Copy Code" button on the code snippets
- The search functionality (see [search](https://blog.lusito.info/search.html))
- Faster navigation by intercepting link clicks, fetching and merging the HTML of those links. Try navigating the pages on this blog. It's blazing fast!
- Support for comments using [giscus](https://giscus.app/) (feel free to leave a comment below).

If you are wondering about the sidebar menu: It's all done via CSS. No JS involved, not even for the mobile menu.

## What's Up Next

You can expect to see the new library I'm using to render HTML using JSX/TSX to arrive soon. This will also involve some improvements on the [tsx-dom](https://github.com/lusito/tsx-dom) library and a couple of additional libraries, which help with this kind of project.

All of these will of course receive their own blog post with some more detail.
