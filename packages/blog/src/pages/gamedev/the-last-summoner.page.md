---
tags:
    - "Game Development"
    - "Global Game Jam"
    - "Web Development"
    - "WebGL"
    - "Web Audio"
    - "Box2D"
    - "Box2D Lights"
    - "TypeScript"
    - "JavaScript"
title: "The Last Summoner: An Exploration Game"
description: >
    Back in 2016, I've written a game in just 48 hours with Dennis Grass, Wladimir Kröker, and Florian Oetke. Stephen Froeber made amazing music and sound effects for it. It was a very fun weekend. Now I've ported this game from Java (Desktop) to TypeScript (Web-Technologies) and you can actually play it in your browser.
image: "the-last-summoner.png"
created: "2022-01-28"
modified: "2022-08-21"
originalSource: "https://www.linkedin.com/pulse/last-summoner-santo-pfingsten/"
---

![Menu](/assets/the-last-summoner.png)

## Previously on a GlobalGameJam

Back in 2016 I joined a GlobalGameJam event in Trier. In just 48 hours, we (me, [Dennis Grass](https://github.com/Kinggrass), [Wladimir Kröker](https://github.com/compix) and [Florian Oetke](https://github.com/lowkey42)) created this neat little exploration game called [The Last Summoner](https://globalgamejam.org/2016/games/last-summoner). This was written in Java back then and we used some creative-commons pixel art from [Kingel](https://forums.tigsource.com/index.php?topic=14166.0). Last, but not least, [Stephen Froeber](https://stephenfroeber.com/) created amazing music, ambience sounds and sound effects to make this world feel more alive.

![Ingame Screenshot 1](/assets/the-last-summoner-ingame1.png)

## Porting It to Web Technologies

Lately I've been playing with web-technologies to create games and I thought it might be a nice challenge to bring this game online. So I've ported the whole thing to TypeScript. It's not very optimized yet, but you can give it a try if you are interested:

http://lusito.info/last-summoner/

Keep in mind, this won't work on a mobile device. Use arrow keys, Q, E and SPACE. Progress is saved in the browser if you want to continue later. If you're noticing performance issues on Firefox, try using chrome or chromium-based browsers.

It's using a couple of libraries I'm working on, like [typed-ecstasy](https://lusito.github.io/typed-ecstasy/) as Entity Component System, [sounts](https://lusito.github.io/sounts/) for audio and [@box2d](https://lusito.github.io/box2d.ts/) for physics and [physics based lighting](https://lusito.github.io/box2d.ts/testbed/#/Lights#Draw_World):

![Ingame Screenshot 2](/assets/the-last-summoner-ingame2.png)

## Camera Library

A library I have not yet released, but am trying out on this game is a 2D camera library, where the camera gets attracted to certain objects in the world (both position and zoom), so you notice them more. This was inspired by [the camera](http://michelgagne.blogspot.com/2012/07/itsp-camera-explained.html) on the game Insanely Twisted Shadow Planet. I'm not entirely sure the game is a good example for this kind of camera, but I don't have a better fitting game yet.

## Entity Component System With Hot Module Replacement

The Entity Component System I am using in this game is currently on the path to a new release, which will feature Hot Module Replacement, which essentially means, that you can save your code and instantly see the changes in the browser without reloading and without losing the current game-state. As far as I know, this has not been done before and I am really excited to bring this to a stable release soon.

Stay tuned for more web/game related content.
