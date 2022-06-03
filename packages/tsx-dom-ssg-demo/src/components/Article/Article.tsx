import { BaseProps } from "tsx-dom-ssr";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

import { withCss } from "../../utils/withCss";
import classes from "./Article.module.scss";

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
});

export const Article = withCss(classes, ({ children }: BaseProps) => (
    <article class={classes.article}>{children}</article>
));

type MarkdownArticleProps = {
    markdown: string;
};

export const MarkdownArticle = withCss(classes, ({ markdown }: MarkdownArticleProps) => (
    <article class={classes.article} dangerouslySetInnerHTML={md.render(markdown)} />
));
