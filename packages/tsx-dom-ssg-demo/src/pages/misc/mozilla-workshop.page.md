---
tags: ["Web-Extensions", "Web Development"]
title: "Mozilla Workshop Summary"
description: >
    I attended a workshop at Mozillas office in London on the topic of Manifest V3 and the future of the Recommended Extensions Program.
date: "2019-11-17T10:00:00.000Z"
---

## Introduction

Some time ago, I've been invited by Mozilla to attend a workshop on the topic of [Manifest V3](https://www.androidpolice.com/wp-content/uploads/2019/02/Manifest-V3.pdf) and the future of the [Recommended Extensions Program](https://support.mozilla.org/en-US/kb/recommended-extensions-program). Mozilla was paying for the whole trip: Cost of travel, accommodations, food, and even tickets for [Mozfest 2019](https://www.mozillafestival.org/), which was held the two days after. So it was an obvious choice to accept this invitation.

I took the opportunity to collect some thoughts on these topics from different communities:

-   [Reddit Firefox](https://www.reddit.com/r/firefox/comments/d9hos9/collecting_your_thoughts_about_manivest_v3_and/)
-   [Mozilla Discourse](https://discourse.mozilla.org/t/collecting-your-thoughts-about-manivest-v3-and-the-recommended-extensions-program/45846)

On October 25th 2019 the workshop took place at Mozillas London office on the day before MozFest and I just got around to write everything down.

**Fair warning:** I don't speak for Mozilla. Everything I say here is a recording of my memories from that event. Nothing more. Nothing less.

## The Workshop Attendees

Some folks from Mozilla, that are working on the Firefox add-ons community and/or products (alphabetical order):

-   Scott DeVaney, Senior Editorial Manager
-   Philipp Kewisch, Product Manager for WebExtensions
-   Caitlin Neiman, Add-ons Community Manager
-   Jorge Villalobos, Senior Product Manager for Add-ons
-   A couple of more of which I don't remember the names to be honest.\
    I'm very bad with names and in my defense, there was so much happening at that event.

In addition, Mozilla invited 7 developers of the [Recommended Extensions](https://addons.mozilla.org/firefox/search/?recommended=true&sort=random&type=extension) Program. Since I'm not sure if they want to be named, I'll just name their extensions:

-   [Decentraleyes](https://addons.mozilla.org/firefox/addon/decentraleyes/)
-   [Forget Me Not](https://addons.mozilla.org/firefox/addon/forget_me_not/) -> mine
-   [Ghostery Privacy Ad Blocker](https://addons.mozilla.org/firefox/addon/ghostery/)
-   [HTTPS Everywhere](https://addons.mozilla.org/firefox/addon/https-everywhere/)
-   [NoScript Security Suite](https://addons.mozilla.org/firefox/addon/noscript/)
-   [Privacy Possum](https://addons.mozilla.org/firefox/addon/privacy-possum/)
-   [To Google Translate](https://addons.mozilla.org/firefox/addon/to-google-translate/)

So, it was a big group of unique people from different backgrounds from all over the world.
Some working on extensions in their free-time and some who have been hired to do so.
I'm quite surprised how all these different personalities contributed to a very productive meeting.

## The Workshop Agenda.

-   Welcome & introduction
-   Recommended Extensions: UX polish / common themes.
-   Manifest V3 (except WebRequest API)
-   WebRequest API
-   Mobile APIs and user experience
-   Wrap up

## Recommended Extensions: UX polish / common themes.

So the first big round was about how we can improve Mozillas Recommended Extensions Program.
Scott DeVaney showed us various examples of bad user experience from existing extensions like:

-   Bad add-on listing pages with very long and/or not very helpful descriptions
-   Bad post-installation pages (new tab popups, that show upon installation)
-   Donation requests showing up at installation-time and/or not looking very trustworthy.

He continued to lay out plans to improve the above and other things by creating guidelines and helping recommended extension authors to improve their extensions' user experience.

Some infos taken from this talk:

-   The recommended extensions program will grow to a maximum of ~200 extensions within the next year. The limit is there for two reasons:
    1. This is a manually maintained list and all of these extensions receive extra review attention in order to ensure good quality, user experience and safety.
    2. A recommended extensions list should be easily browsed in a reasonable amount of time. Having thousands of recommended extensions removes the purpose of the recommendation.
-   The information on what extensions need to do in order to get into the program will be extended and made more public.
    But in the end, since the amount of recommended extensions are limited, parts of that decision will always be a "soft evaluation".
-   One of the things that Mozilla is going to spend some time on is improving the translation process, as this is currently more difficult than it needs to be.
-   I forwarded the idea of creating a "recommended developers program". We talked about this in the group, but in the end, it would be too hard with too little benefit to implement.
    -   As an alternative, Mozilla is considering adding a badge to the developer, showing that he/she has written other recommended extensions.
-   Paging through the random sorting order of recommended extensions is currently broken, as the random ordering gets reset on every page. This should be fixed when more extensions come in.
-   Reviews are usually done in a diff-view (after the first commit), so that the review process is sped up.
-   There are no weekend reviews, so patches might not get in until Monday.
-   They are running reviews in a VM and are willing to install necessary tooling there, so your tooling choice should not matter as long as it runs in this VM.
-   Recommended Extensions have a higher weight in searches, get a badge (even if not hosted on AMO) both on AMO and the add-ons manager and are listed in curated collections.
-   There are per-page recommendations. For example "Facebook Container" might be recommended on Facebook. Which extensions get shown at what pages is a soft evaluation.
-   Mozilla plans an extension spotlight series, where they will show and explain one (recommended) extension in detail in regular intervals.

## Manifest V3

Philipp Kewisch talked about the changes that Manifest V3 will introduce. In between and afterwards we discussed what impact these changes will have on current and future web-extensions.

Noteworthy things taken from this part:

-   Mozilla is looking at Manifest V3 very objectively. Some parts obviously have their reasoning behind it to improve security and as such need to be considered to ensure a trustworthy relationship between user and extension.
-   Manifest V3 is still not completely defined, so it's hard to say what Mozilla will do with it in the end.
-   Mozilla is, however, trying to get the best out of it:
    -   Some of the proposed new APIs can be implemented to allow simple extensions to work more efficiently and without special permissions.
    -   Google wants to limit the amount of rules an extension can define. Mozilla considers to have no limit on them.
    -   Google wants to drop support for blocking WebRequests, which will cripple certain extensions, others might not even work at all. Mozilla is not going to follow this destructive path.
        Instead, they will keep allowing the use of blocking WebRequests and investigate how to address the issue differently. One proposal was to make more extensive reviews on extensions, which use this kind of API and possibly prevent them from being published if there is no actual need. If you have good ideas to address this, let me (or them) know.
-   Manifest V3 wants to replace background scripts with service workers. They say it's supposed to improve performance.
    In its current state, it is very unclear to all attendees, how this is going to look. But there are big doubts on googles claim, since this will just require extensions to permanently store and restore their data whenever the worker goes to sleep and wakes up. This will even make some extensions hard to develop. Some might have to create hacks to keep the service worker alive.
-   Mozilla is trying to talk with Google (and other browser developers) about Manifest V3, but so far there has been little feedback, especially from Google.
-   It seems other browser developers are investigating these security and performance claims google is currently making.

## Mobile APIs and user experience

Last, but not least, we talked about Mozillas [rewrite of Firefox for Android](https://blog.mozilla.org/futurereleases/2019/06/27/reinventing-firefox-for-android-a-preview/).
Mozilla is focusing on creating a better user experience on android and will also put a lot of effort into making [good use of Web-Extensions](https://blog.mozilla.org/addons/2019/10/23/fx-preview-geckoview-add-ons-support/) here.
They are also evaluating new mobile-specific APIS, so if you have ideas for new (or extended) APIs, which would be beneficial for mobile, please tell them!

## Other things:

-   Users wanted to have more control over which sites can create service workers. I.e. a permission popup similar to the camera and notification permission popups.
    Mozilla is open for this, a [Bugzilla](https://bugzilla.mozilla.org/) ticket should be created for evaluation.
-   About the "Not monitored by Mozilla" Warning: The message will stay, but the color/severity of the visuals will change.
    -   In addition, I forwarded the request to create different levels (recommended, monitored, normal, new user) and they will consider this!
-   I haven't been able to address all the questions and issues users have on these topics, as there was not enough time. But I have forwarded them all and they have assured me to take them seriously.

## Verdict

There was so much information packed into this workshop, I probably missed some of it writing this summary. Everyone was really invested in making Firefox and Web-Extensions the best it can be.

I arrived with a lot of questions, doubts and fears, but I left with hope and new friendships.

I'm looking forward to what's going to happen next! (at least on Mozillas side.. for Google, I have as little hope as I had before).
