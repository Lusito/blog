import { withCss } from "../../utils/withCss";
import classes from "./ArticleHeader.module.scss";

type ArticleHeaderProps = {
    title: string;
    subTitle?: string;
};

export const ArticleHeader = withCss(classes, ({ title, subTitle }: ArticleHeaderProps) => (
    <header class={classes.articleHeader}>
        <div>
            <h1>{title}</h1>
            {subTitle && <h4>{subTitle}</h4>}
        </div>
    </header>
));
