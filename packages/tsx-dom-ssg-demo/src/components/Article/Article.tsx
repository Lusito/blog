import { BaseProps } from "tsx-dom-ssr";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

import { withCss } from "../../utils/withCss";
import classes from "./Article.module.scss";
import { createElement } from "../../utils/renderHTML";

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

                const el = createElement("code-copy-button", {
                    enhancedClass: classes.enhancedCopyButton,
                    code: content,
                    title: "Copy",
                    "aria-label": "Copy",
                });

                return html.replace("</pre>", `${el.outerHTML}</pre>`);
            };
        }
    }
});

// fixme: rename to ArticleContent or something?
export const Article = withCss(classes, ({ children }: BaseProps) => <div class={classes.article}>{children}</div>);

type MarkdownArticleProps = {
    markdown: string;
};

export const MarkdownArticle = withCss(classes, ({ markdown }: MarkdownArticleProps) => (
    <div class={classes.article} dangerouslySetInnerHTML={md.render(markdown)} />
));
