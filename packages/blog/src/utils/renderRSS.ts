import { Window } from "happy-dom";

import { siteDescription, siteTitle, siteUrl, siteUrlForSlug } from "./config";
import { getLatestCreated, PageInfo, tagLabels } from "./pageUtils";

const window = new Window();
const document = window.document as unknown as Document;

function simpleNode(tag: string, text: string) {
    const link = document.createElement(`blog-rss-${tag}`);
    link.textContent = text;
    return link;
}

export function renderRSS(pages: PageInfo[]) {
    const pubDate = getLatestCreated(pages);
    const channel = document.createElement("blog-rss-channel");
    channel.appendChild(simpleNode("title", siteTitle));
    channel.appendChild(simpleNode("link", siteUrl));
    channel.appendChild(simpleNode("description", siteDescription));
    if (pubDate) {
        channel.appendChild(simpleNode("pubDate", pubDate.toUTCString()));
    }
    for (const tag of tagLabels) {
        channel.appendChild(simpleNode("category", tag));
    }

    const atomLink = document.createElement("atom:link");
    atomLink.setAttribute("href", `${siteUrl}/rss.xml`);
    atomLink.setAttribute("rel", "self");
    atomLink.setAttribute("type", "application/rss+xml");
    channel.appendChild(atomLink);

    for (const page of pages) {
        const item = document.createElement("blog-rss-item");
        item.appendChild(simpleNode("title", page.title));
        item.appendChild(simpleNode("link", siteUrlForSlug(page.slug)));
        item.appendChild(simpleNode("guid", siteUrlForSlug(page.slug)));
        item.appendChild(simpleNode("description", page.description));
        item.appendChild(simpleNode("pubDate", page.created.toUTCString()));
        for (const tag of page.tags) {
            item.appendChild(simpleNode("category", tag));
        }
        channel.appendChild(item);
    }

    const content = channel.outerHTML
        .replace(/blog-rss-pubdate/g, "pubDate")
        .replace(/blog-rss-/g, "")
        .replace("></atom:link>", "/>");
    return `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">${content}</rss>`;
}
