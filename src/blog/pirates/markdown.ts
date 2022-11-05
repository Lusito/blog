import { createMarkdownHandler } from "@lusito/require-libs";
import MarkdownIt from "markdown-it";
import { join } from "path";
import { addHook } from "pirates";

import classes from "../components/MarkdownContent/MarkdownContent.module.scss";
import { FrontMatter } from "../utils/pageUtils";
import { createElement } from "../utils/renderHTML";
import { copyAsset } from "./utils";

function isFrontMatter(object: unknown): object is FrontMatter {
    return object !== null && typeof object === "object" && "image" in object;
}

function copyButtonPlugin(md: MarkdownIt) {
    for (const rule of ["code_block", "fence"]) {
        const original = md.renderer.rules[rule];
        if (original) {
            md.renderer.rules[rule] = (...args) => {
                const [tokens, idx] = args;
                const { content } = tokens[idx];
                const html = original(...args);

                if (content.length === 0) return html;

                const title = "Copy the code snippet to the clipboard";
                const el = createElement("code-copy-button");
                el.setAttribute("code", content);
                el.setAttribute("title", title);
                el.setAttribute("aria-title", title);
                el.setAttribute("enhancedClass", classes.enhancedCopyButton);

                return html.replace("</pre>", () => `${el.outerHTML}</pre>`);
            };
        }
    }
}

// Markdown
const markdownHandler = createMarkdownHandler({
    copyAsset,
    createElement,
    postProcess({ dir, frontMatter }) {
        if (isFrontMatter(frontMatter) && frontMatter.image) {
            frontMatter.image = copyAsset(join(dir, frontMatter.image));
        }
    },
    setup(md) {
        md.use(copyButtonPlugin);
    },
});

addHook(markdownHandler, { exts: [".md"] });
