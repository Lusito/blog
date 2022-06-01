import { BaseProps } from "tsx-dom-ssr";
import MarkdownIt from "markdown-it";

import { withCss } from "../../utils/withCss";
import classes from "./Article.module.scss";

const md = new MarkdownIt();

export const Article = withCss(classes, ({ children }: BaseProps) => (
    <article class={classes.article}>{children}</article>
));

type MarkdownArticleProps = {
    markdown: string;
};

export const MarkdownArticle = withCss(classes, ({ markdown }: MarkdownArticleProps) => (
    <article class={classes.article} dangerouslySetInnerHTML={md.render(markdown)} />
));
