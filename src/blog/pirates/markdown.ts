import { createMarkdownHandler } from "@lusito/require-libs";
import { join } from "path";
import { addHook } from "pirates";

import classes from "../components/MarkdownContent/MarkdownContent.module.scss";
import { FrontMatter } from "../utils/pageUtils";
import { createElement } from "../utils/renderHTML";
import { copyAsset } from "./utils";

function isFrontMatter(object: unknown): object is FrontMatter {
    return object !== null && typeof object === "object" && "image" in object;
}

// Markdown
const markdownHandler = createMarkdownHandler({
    copyAsset,
    copyButtonEnhancedClass: classes.enhancedCopyButton,
    createElement,
    postProcess({ dir, frontMatter }) {
        if (isFrontMatter(frontMatter) && frontMatter.image) {
            frontMatter.image = copyAsset(join(dir, frontMatter.image));
        }
    },
});

addHook(markdownHandler, { exts: [".md"] });
