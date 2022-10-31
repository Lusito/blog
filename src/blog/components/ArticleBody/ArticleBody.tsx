import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./ArticleBody.module.scss";

export const ArticleBody = withCss(classes, ({ children }: BaseProps) => (
    <div class={classes.articleBody}>{children}</div>
));
