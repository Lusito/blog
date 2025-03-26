/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addAbortSignal, ComponentChildren, toDom } from "tsx-dom-ssr";
import { domHelmet } from "dom-helmet";
import { Window } from "happy-dom";
import imageSize from "image-size";
import type { ISizeCalculationResult } from "image-size/dist/types/interface";

import { productionSiteUrl } from "./config";
import globalCss from "../style/global.scss";
import highlightCss from "../style/highlight.scss";
import markdownClasses from "../components/MarkdownContent/MarkdownContent.module.scss";

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

    const thisArg = addAbortSignal({ path, cssModules }, abortController);
    let dom: DocumentFragment;
    try {
        dom = await toDom(document, children, thisArg);
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
    domHelmet({ html: wrapper.querySelector("html")!, head, body: wrapper.querySelector("html > body")! });

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
        if (!href) return;
        if (href.startsWith(productionSiteUrl)) {
            link.setAttribute("href", href.substring(productionSiteUrl.length));
        } else if (protocolPattern.test(href)) {
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

                if (width >= 800) {
                    img.classList.add(markdownClasses.largeImage);
                }
            }
        }
    });

    // Merge code blocks with their title
    const codeBlocks = Array.from(wrapper.querySelectorAll("pre > code.hljs"));
    if (codeBlocks.length) {
        const codeBlockTemplate = (
            await toDom(
                document,
                <code-block>
                    <code-block-tabs role="tablist" aria-label="Code tabs">
                        <button role="tab" aria-selected="true" />
                    </code-block-tabs>
                    <code-block-panels />
                </code-block>,
                thisArg,
            )
        ).children[0];

        for (const el of codeBlocks) {
            const pre = el.parentElement;
            const parent = pre?.parentElement;
            const previousSibling = pre?.previousElementSibling;
            if (!parent || !previousSibling || !previousSibling.matches("p") || previousSibling.children.length !== 1)
                continue;

            const code = previousSibling.children[0];
            if (!code.matches("code") || !code.textContent) continue;

            // We have a named code block, clone the template and adjust it
            const codeBlock = codeBlockTemplate.cloneNode(true) as HTMLElement;
            pre.parentElement!.insertBefore(codeBlock, pre);

            const tab = codeBlock.querySelector("code-block-tabs > button")!;
            tab.textContent = code.textContent;

            codeBlock.querySelector("code-block-panels")!.appendChild(pre);

            // Remove the paragraph containing the tab name
            previousSibling.remove();
        }
    }

    return `<!DOCTYPE html>${wrapper.innerHTML}`;
}

export const createElement = document.createElement.bind(document);
