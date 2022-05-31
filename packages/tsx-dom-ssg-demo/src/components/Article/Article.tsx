import { BaseProps } from "tsx-dom-ssr";
import MarkdownIt from "markdown-it";

import { withCss } from "../../utils/withCss";
import classes from "./Article.module.scss";

const md = new MarkdownIt();

type ArticleProps = BaseProps & {
    title: string;
};

export const Article = withCss(classes, ({ title, children }: ArticleProps) => (
    <article class={classes.article}>
        <h2>{title}</h2>
        <section class={classes.body}>{children}</section>
    </article>
));

type MarkdownArticleProps = {
    markdown: string;
};

export const MarkdownArticle = withCss(classes, ({ markdown }: MarkdownArticleProps) => (
    <article class={classes.article} dangerouslySetInnerHTML={md.render(markdown)} />
));
