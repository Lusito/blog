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

// fixme: rename to ArticleContent or something?
export const Article = withCss(classes, ({ children }: BaseProps) => (
    <div class={classes.article}>{children}</div>
));

type MarkdownArticleProps = {
    markdown: string;
};

export const MarkdownArticle = withCss(classes, ({ markdown }: MarkdownArticleProps) => (
    <div class={classes.article} dangerouslySetInnerHTML={md.render(markdown)} />
));
