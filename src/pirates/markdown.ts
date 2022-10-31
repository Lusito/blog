import { dirname, join } from "path";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import frontMatter from "front-matter";

import { createElement } from "../blog/utils/renderHTML";
import classes from "../blog/components/MarkdownContent/MarkdownContent.module.scss";
import { copyAsset, setupCachedHook } from "./utils";
import type { FrontMatter } from "../blog/utils/pageUtils";

export type MarkdownModule = {
    html: string;
    frontMatter: unknown;
};

const md: MarkdownIt = new MarkdownIt({
    linkify: true,
    highlight(str, lang) {
        let code: string | undefined;
        if (lang && hljs.getLanguage(lang)) {
            try {
                code = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
            } catch (e) {
                console.error("Failed highlighting", e);
            }
        }

        return `<pre><code class="hljs">${code ?? md.utils.escapeHtml(str)}</code></pre>`;
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
}).use((md) => {
    for (const rule of ["code_block", "fence"]) {
        const original = md.renderer.rules[rule];
        if (original) {
            md.renderer.rules[rule] = (...args) => {
                const [tokens, idx] = args;
                const { content } = tokens[idx];
                const html = original(...args);

                if (content.length === 0) return html;

                const title = "Copy the code snippet to the clipboard";
                const el = createElement("code-copy-button", {
                    enhancedClass: classes.enhancedCopyButton,
                    code: content,
                    title,
                    "aria-label": title,
                });

                return html.replace("</pre>", `${el.outerHTML}</pre>`);
            };
        }
    }
});

function isFrontMatter(object: unknown): object is FrontMatter {
    return object !== null && typeof object === "object" && "image" in object;
}

setupCachedHook(
    (code, filename) => {
        const dir = dirname(filename);
        const dom = createElement("div", {});
        const result = frontMatter(code);

        dom.innerHTML = md.render(result.body);
        dom.querySelectorAll("img").forEach((img) => {
            img.src = copyAsset(join(dir, img.src));
        });

        if (isFrontMatter(result.attributes) && result.attributes.image) {
            result.attributes.image = copyAsset(join(dir, result.attributes.image));
        }

        const data: MarkdownModule = {
            html: dom.innerHTML,
            frontMatter: result.attributes,
        };

        return `module.exports = ${JSON.stringify(data)}`;
    },
    { exts: [".md"] }
);
