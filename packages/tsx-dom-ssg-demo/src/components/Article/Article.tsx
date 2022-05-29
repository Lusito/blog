import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./Article.module.scss";

type ArticleProps = BaseProps & {
    title: string;
};

export const Article = withCss(classes, ({ title, children }: ArticleProps) => (
    <article class={classes.article}>
        <h2>{title}</h2>
        <section class={classes.body}>{children}</section>
    </article>
));
