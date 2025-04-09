---
tags: ["React", "Performance", "JavaScript", "TypeScript", "Web Development", "Bad Choices"]
title: "Stop Using and Recommending React"
description: >
  I have used React for a long time. Trust me when I tell you: There is no reason to use it and a lot of reasons against it.
  This is going to be a long explanation, but bear with me!
created: "2025-03-04"
---

## Why You Should Take Me Seriously

So the title might sound like click-bait, but it actually isn't. And I'm not someone who always disliked React either.

To a lot of people, especially at my current employer, I am "the react guy".

I started working with react professionally in February 2019, which was when hooks have just been released.
This was quite exciting, as I haven't been a fan of the class-based approach of earlier React versions.

In fact, I was so excited about this, that I started a whole meetup series with 7 presentations from project setup to testing and various libraries in the ecosystem. That was so well received, that I offered a 3 days React live-coding training course within my company 3 years in a row with roughly 14 participants each time. I only stopped when I ran out of people to teach.

Since 2019, I have been constantly working on react projects. Both at my current employer and privately. I even published [7 lightweight react libraries](https://lusito.github.io/react-nano/).

So when I tell you to stop using React, you can bet that I have some very good reasons.

## Why Do People Choose React?

- It's under active development
- It's [popular](https://npmtrends.com/@angular/core-vs-react-vs-svelte-vs-vue).. way more than any of the alternatives
- Lots of frontend developers have this skill in their portfolio
- There's a huge ecosystem of libraries, tools and frameworks
- With Next.js and similar tools, it's even possible to do server-side-rendering

## Why Shouldn't You Choose React?

I can find negative points on all of the statements above:

- **It's under active development**\
  Yes, but it doesn't improve things. See the topic React-Compiler further below.
- **It's popular.. way more than any of the alternatives**\
  Hype is no reason to use something. It can even blind you.
  - Lots of times, React is being used in use-cases, which it hasn't been designed for (see the customer project below in the section about hydration).
  - React was made for highly dynamic content
  - React has bad performance, especially when you use it for mostly static content.
- **Lots of frontend developers have this skill in their portfolio**\
  Correct, but only very few actually know how to use it properly:
  - You have to keep a lot of things in mind if you want to avoid issues and still have a well-performing application.
  - In code-reviews you'll have to focus even more on these things, as it's easy to miss dependencies in a diff-view.
  - Especially beginners, but also experienced devs with a non-frontend background easily fall into traps.
- **There's a huge ecosystem of libraries, tools and frameworks**\
  A huge ecosystem is nice. You have lots of choices, but:
  - You have too many choices. I can't count how many libraries for state management exist and every one of them promises to be a game-changer.
  - Choosing which library to use isn't as easy as it sounds: Going by popularity can be fatal. Some UI-Libraries, for example, look nice and give a pleasant dev-experience, but once you start using them in a more complex (real) scenario, they have performance issues that can bring your application to its knees.
- **With Next.js and similar tools, it's even possible to do server-side-rendering**\
  Right, you can also take a [Microlino](https://en.wikipedia.org/wiki/Microlino) on the highway, but I wouldn't say it's a smart idea. See the following topic on hydration.

## Problems With Hydration

When you prerender your application on the server-side with for example [Next.js](https://nextjs.org/) or the [Arc XP](https://www.arcxp.com/) platform, it will be reactivated on the client-side. This process is called hydration.

The basic idea is, that the whole application needs to be restarted on the browser, so that it can become dynamic. To make this possible, all (JSON-) data that is needed for the rendering needs to be included in the HTML the server sends to the client. Since these technologies don't know your data, they send all of it by default.

In 2021, I joined an existing customer project, which was on it's way to relaunch their news-website on the Arc XP platform (think Next.js for news-websites, in proprietary and poorly written by the Washington Post devs to make some extra money).
On the day of the relaunch the landing page served an initial HTML document which was 20MB in size (without external resources!):

- The landing page had over 100 teasers to articles. At that time, the JSON-data for each teaser was the whole article.
- Even though the teasers where completely static, the JSON had to be included, so that react could rerender them during hydration. Using [partial hydration](https://blog.lusito.info/tag/partial-hydration.html) here didn't work because of the way Arc XP worked.
- To improve the situation, we had to rewrite the code, so that the JSON would only contain relevant content. This wasn't a simple Task. Teasers are the most complex thing in this project. They have lots of variations, each requiring different properties.
- We formed a team of 3 experienced developers plus a junior who focused solely on SEO and performance for about 9 months in order to get to a point where the values had been acceptable (keep in mind, that 20 other devs where pushing more features during that time).
- The initial HTML of the landing page had shrunk to about 1MB by then, which is still way too much in my opinion.

**In short:** You need to be very careful what you send to the client and when you work with an untyped API like Arc-XP, It's easy to miss that some object might contain more data than what you think. You need to actively think about this, as otherwise it will be automatically shipped to the client.

Granted, a news-page (or rather a Multi-Page-Application) is not the ideal use-case for React. React was made for Single-Page-Applications, where the dynamic parts outweigh the static parts, but the decision to use Arc XP (and therefore React) was made against the protest of developers.

## Problems With Memoization

React performance is difficult to get right. I remember when I opened the customers news-page on a medium-level Android device for the first time and had to wait over half a minute before I could use the menu.

With React, you'll always have to consider performance manually and keep a lot of things in mind while doing so:

- `useEffect`, `useMemo`, `useCallback`.. all of these hooks receive a dependencies-array, which will be compared using a shallow-equals comparison with the previous values. If one value changed (think `===` check) the code within their callbacks will be re-executed.
- What is easily missed: When this array contains a value, which is being recreated during each render without memoizing it, it will cause a re-execution.
  - The usual suspects are: An object or array, which was recreated. For example by use of `Array.filter()`. Or a function, which has been created within the render-function without memoizing it.
  - Harder to spot are values which are calculated in other functions (like custom hooks), which produce new values on each call.
  - Worst case scenario: You have such a problem within a provider component and there are lots of composing depending on the context value. Every time something on the context changes, you can bet almost your entire application needs to rerender.
- Sure, there are linting rules, which check if you added all dependencies and some even check for recreated values, but they don't follow function calls, so they can't see what your custom hook does wrong.
- If you miss a dependency in the array, this can lead to logic issues. If you forget to remove an unused dependency, this will contribute to bad performance.
- The concept of [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) is a big cause of issues when memoizing functions. Lots of developers either haven't fully grasped them or miss potential issues with them when reviewing code. This happens mostly to beginners, but even experienced developers can miss them.
- React-19, or rather the [React-Compiler](https://react.dev/learn/react-compiler), which has been released at the same time, promises to improve the situation. You don't have to manually do memoization anymore. The compiler does it for you. Sadly, this brings other problems, as I'll show you further below.

## Problems to Keep in Mind

- In React, a lot of things happen auto-magically. This is convenient, but it also causes confusions for beginners and even experienced devs make mistakes sometimes.
- The React-Compiler doesn't improve the situation, as you'll see in the next chapter.

## The New React-Compiler

As mentioned, the [React-Compiler](https://react.dev/learn/react-compiler) promises to get rid of performance issues for you. It's currently in beta and needs to be explicitly added to a project via babel plugin for example.
It will then hook itself into the transpilation process, analyze the code and adjust it to add automatic memoization and possibly other improvements.

This sounds great, but my experiments to inspect the behavior show, that the magic comes with its own problems.

Take a look at this **example code**:

```tsx
function Button({ data, text, onClick }: ButtonProps) {
  console.log(`Button ${text}`);

  return (
    <button title={data.title} onClick={onClick}>
      {text}
    </button>
  );
}

const increment = (v: number) => v + 1;

function App() {
  const [foo, increaseFoo] = useReducer(increment, 0);
  const [bar, increaseBar] = useReducer(increment, 0);

  console.log("App");

  const fooData = useMemo(() => {
    console.log("fooData");
    return { title: `Is: ${foo}` };
  }, [foo]);

  const barData = useMemo(() => {
    console.log("barData");
    return { title: `Is: ${bar}` };
  }, [bar]);

  return (
    <>
      <Button text="foo" data={fooData} onClick={increaseFoo} />
      <Button text="bar" data={barData} onClick={increaseBar} />
    </>
  );
}
```

The code above is currently completely memoized as it should be, aside from the `Button` component.
This is a bit of a fabricated example, but bear with me.

When I use this **without** the React-Compiler, I see the following logs:

- On Start: `App`, `fooData`, `barData`, `Button foo`, `Button bar`
- When I press the foo button: `App`, `fooData`, `Button foo`, `Button bar`
  - `barData` will not be logged, as `useMemo` prevents it.
  - Both button components write their logs, since they are not memoized.

When run the same code **with** the React-Compiler, I see the following logs:

- On Start: `App`, `fooData`, `barData`, `Button foo`, `Button bar` (identical to the above run)
- When I press the foo button: `App`, `fooData`, `barData`, `Button foo`
  - `Button bar` will not be logged, since the React-Compiler automatically memoized the `Button` component.
  - But why is `barData` being recomputed, even though the code is manually memoizing it? And following up on this, why is the button not rerendered, even though `barData` has been recomputed?

It gets even more interesting when I change the dependencies array of both `useMemo` Calls to be an empty array and click on the foo button:

- Without the React-Compiler: `App`, `Button foo`, `Button bar` (as expected)
- With React-Compiler: `App`, `fooData`, `barData`, `Button foo`
  - Even though `foo` and `bar` are not specified as dependencies anymore, the values of `fooData` and `barData` are being recalculated!

### To Summarize:

- The React-Compiler does some weird magic, which completely ignores the dependencies array.
  - So it thinks it knows better than you.
  - This might even fix some bugs, as people easily make mistakes here, but in other cases this might not be desired. Mostly though, this is not what you would expect it to do!
- Even though the React-Compiler recalculated values in `useMemo` (which causes new object instances), this does not cause the `Button` component to rerender.
  - So after the value is recalculated, react does a deep comparison, which prevents a rerender.
  - This even works if the calculated value is or contains a function. Even though you can't easily compare functions in JavaScript (keep closures in mind).

## Drawing a Conclusion

We learned:

- Writing good React code requires a focused mind.
- Even experienced developers fall into traps or approve them in code reviews.
- React does a lot of magic and the new React-Compiler is no exception. Even worse, it does things you wouldn't expect!

So, how do we continue from here on?

I can't recommend React to any project or customer anymore. Even before my current customer project, which we inherited from another company of very inexperienced react developers, I noticed the issues above. This new project just proved my fears.

You can't say it any nicer: You can only write stable, well-performing React code if you have a team of exclusively experienced React developers. Once you introduce less experienced devs (which will happen at some point in any long running project), you will face the issues listed above. So if anyone wants to start a new project with React, tell them `No!` and tell them why. Using almost any other modern alternative, you will save time, money and nerves, even if you haven't used them before.

## Alternatives

So you might be asking me: _What frontend framework should I use today?_

Honestly, even when I still liked react, I would never have said React. I would have responded with a counter question: _What use-case do you have?_

The best generic answer I can give is this: Choose your technology based on the use-case you have. Of course, keep your teams experience in mind, but don't limit yourself too much by it. After all you are developers. Your job is to learn technologies and use them. Don't be afraid to do a few prototypes (ideally before time is of the essence).

### Single Page Applications

The only reason to choose an SPA framework is if you plan to create a Single-Page-Application. I.e. something that starts once in your browser and you leave it open for a long time to work with highly dynamic content. Facebook, Web-Clients for E-Mail, Live-Chats, all of these are good use-cases for SPA frameworks. Having an on-page chat feature for an otherwise static page does not give you a reason to write the entire page in an SPA framework though!

If you want me to name a few candidates I find promising: [Vue](https://vuejs.org/), [Svelte](https://svelte.dev/) or [Lit](https://lit.dev/) might be worth taking a look at.

### Multi Page Applications

If you have a use-case of mostly static content, like news-pages, Wikipedia or similar, then an SPA framework is the worst choice you can make. No matter which one you choose. The best you can do is generate most of the content completely static and only sprinkle in some JavaScript for the few dynamic parts. Ideally your website works for the most part completely without JavaScript (think [progressive enhancement](https://blog.lusito.info/tag/progressive-enhancement.html)).

One framework I currently find interesting for exactly that reason is [Astro](https://astro.build). You have zero JavaScript delivered to the client by default and it's easy to learn since most of it is native web technology. If you need to write a more complex part like an on-page chat, you can do so in another framework and easily include it on-demand. Astro helps you with that!

You can also write your client-side code in a completely separate technology than the one you are using to generate server-side HTML and CSS. This even makes you more flexible when the next technology choice is on the horizon!

## Final Words

Remember, your mind is the best tool you have in your belt. Use it to choose the technology that fits your needs. Don't be afraid to learn something new, fail and restart. You'll become a better developer by doing so. Don't stick to technology just because you know it.
