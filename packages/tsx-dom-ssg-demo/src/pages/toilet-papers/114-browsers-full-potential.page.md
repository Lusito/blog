---
tags: ["Toilet Paper", "Web-Extensions", "TypeScript", "JavaScript", "Web Development"]
title: "Using the Browser’s Full Potential"
description: >
    Everyone knows how to use a browser to perform certain tasks.
    And yet there are problems many people might work around,
    because they don't know the browser’s full potential.
created: "2019-05-17"
modified: "2022-08-21"
---

## Possible Problems

-   You suspect that the browser cache, local storage or cookies are responsible for a problem and delete them to test this theory.
-   You write debugging code to help analyzing the status (-change) of the application.
-   You have to log in to a web service (Gmail, Office365, ...) with different user IDs and therefore use a different browser for each user account.

## Solutions

-   Instead of clearing the browser cache, etc., simply use the browser’s private/incognito mode. It strictly separates cache, local storage, cookies, etc. from the non-private tabs.
-   So-called web extensions (formerly called browser add-ons) allow you to add functionality to the browser. Ad blockers are the best known, but there are also some special extensions for developers. These allow, for example, to monitor the Redux State.
-   In Firefox, Mozilla has taken the encapsulation of private tabs one step further:
    -   So-called [container tabs](https://support.mozilla.org/kb/containers) (contextual identities) allow you to create new tabs, which run separately from the normal tabs – similar to the private mode. Unlike in private mode, cache, cookies, etc. are not forgotten when closing the tab.
    -   That way, you can create separate containers – for the company, the customer and also for the private account. Simply press the plus in the tab bar a bit longer or use the menu "File -> New Container Tab".

## Example

Web extensions worth looking at:

-   Container tabs: [Firefox Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers), [Temporary Containers](https://addons.mozilla.org/firefox/addon/temporary-containers/)
-   Developer tools: [Augury (Angular)](https://addons.mozilla.org/firefox/addon/angular-augury), [React Developer Tools](https://addons.mozilla.org/firefox/addon/react-devtools/), [Redux DevTools](https://addons.mozilla.org/firefox/addon/reduxdevtools/), [ColorZilla](https://addons.mozilla.org/firefox/addon/colorzilla/), [CORS Everywhere](https://addons.mozilla.org/firefox/addon/cors-everywhere/), [Nimbus Screenshot & Video Recorder](https://chrome.google.com/webstore/detail/nimbus-screenshot-screen/bpconcjcammlapcogcnnelfmaeghhagj), [Page Ruler](https://chrome.google.com/webstore/detail/page-ruler/emliamioobfffbgcfdchabfibonehkme), [Let's get color blind](https://addons.mozilla.org/firefox/addon/let-s-get-color-blind/)
-   Recording and playing back sequences: [iMacros](https://addons.mozilla.org/firefox/addon/imacros-for-firefox), [Selenium IDE](https://addons.mozilla.org/firefox/addon/selenium-ide)
-   Inspect and edit cookies: [Cookie Quick Manager](https://addons.mozilla.org/firefox/addon/cookie-quick-manager/), [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)
-   Written by me:
    -   [Forget Me Not](https://addons.mozilla.org/en-US/firefox/addon/forget_me_not/) (Rule-based deletion of cookies, local storage and more)
    -   [Dict.cc Translation](https://addons.mozilla.org/firefox/addon/dictcc-translation/) (In-page translation)

## Further Aspects

If there is no suitable web extension available, it is relatively easy to [write one yourself in JavaScript or TypeScript](https://jambit.com/en/latest-info/news/why-jambit-softwaredeveloper-develops-browser-add-ons/):

-   Popups or sidebars can provide information or control elements
-   Panels can complement the browsers dev-tools
-   HTTP headers can be inspected and modified live. It is also possible to redirect requests to other URLs.
-   Code and CSS can be injected into web pages to add missing functionality.
-   Reading, saving and deleting cookies is part of the basics.

There are endless possibilities. Most features are available in Firefox, but all major browsers (Firefox, Chrome, Edge, Opera) support web extensions at least in part. A polyfills for cross-browser development can be found on NPM: ([webextension-polyfill](https://www.npmjs.com/package/webextension-polyfill)) and TypeScript types are available as well ([@types/webextension-polyfill](https://github.com/Lusito/webextension-polyfill-ts))

API documentation: https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions
