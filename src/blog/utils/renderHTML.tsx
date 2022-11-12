/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addAbortSignal, ComponentChildren, toDom } from "tsx-dom-ssr";
import { domHelmet } from "dom-helmet";
import { Window } from "happy-dom";
import imageSize from "image-size";
import type { ISizeCalculationResult } from "image-size/dist/types/interface";

import { siteUrl } from "./config";
import globalCss from "../style/global.scss";
import highlightCss from "../style/highlight.scss";

const window = new Window();
const document = window.document as unknown as Document;
const protocolPattern = /^https?:\/\//;

const imageSizes: Record<string, ISizeCalculationResult> = {};
function cachedImageSize(assetPath: string) {
    let result = imageSizes[assetPath];
    if (!result) {
        result = imageSize(`./dist${assetPath}`);
        imageSizes[assetPath] = result;
    }
    return result;
}

export async function renderHTML(path: string, children: ComponentChildren) {
    const cssModules = [globalCss];
    const abortController = new AbortController();

    let dom: DocumentFragment;
    try {
        dom = await toDom(document, children, addAbortSignal({ path, cssModules }, abortController));
    } catch (e) {
        if (!abortController.signal.aborted) abortController.abort();
        throw e;
    }

    // Since the dom might be a fragment or just a text node, we need a wrapper to render it
    const wrapper = document.createElement("div");
    wrapper.appendChild(dom);

    if (
        wrapper.childNodes.length !== 1 ||
        wrapper.childNodes[0].nodeType !== 1 ||
        (wrapper.childNodes[0] as Element).tagName !== "HTML"
    ) {
        throw new Error("Expected one html node at the root level");
    }

    const head = wrapper.querySelector("html > head") as HTMLHeadElement;
    domHelmet({
        html: wrapper.querySelector("html")!,
        head,
        body: wrapper.querySelector("html > body")!,
    });

    if (wrapper.querySelector("code.hljs")) {
        cssModules.push(highlightCss);
    }

    for (const cssModule of cssModules) {
        const style = document.createElement("style");
        // eslint-disable-next-line no-underscore-dangle
        style.innerHTML = cssModule.__CSS;
        head.appendChild(style);
    }

    wrapper.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href");
        if (href && protocolPattern.test(href) && !href.startsWith(siteUrl)) {
            const rel = link.getAttribute("rel");
            if (!rel) {
                link.setAttribute("rel", "noopener nofollow");
            }

            const target = link.getAttribute("target");
            if (!target) {
                link.setAttribute("target", "_blank");
            }
        }
    });

    if (!wrapper.querySelector("meta[name=description]")) {
        throw new Error(`Path "${path}" does not contain meta description`);
    }

    // Add width/height attributes to all img tags, which don't have it yet
    wrapper.querySelectorAll("img").forEach((img) => {
        if (!img.hasAttribute("width") && !img.hasAttribute("height") && img.src.startsWith("/assets/")) {
            const { width, height } = cachedImageSize(img.src);
            if (width && height) {
                img.setAttribute("width", width.toString());
                img.setAttribute("height", height.toString());
            }
        }
    });

    return `<!DOCTYPE html>${wrapper.innerHTML}`;
}

export const createElement = document.createElement.bind(document);
