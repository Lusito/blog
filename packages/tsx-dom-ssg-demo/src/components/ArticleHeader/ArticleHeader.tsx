import { withCss } from "../../utils/withCss";
import classes from "./ArticleHeader.module.scss";

type ArticleHeaderProps = {
    title: string;
    subTitle?: string;
};

export const ArticleHeader = withCss(classes, ({ title, subTitle }: ArticleHeaderProps) => (
    <header class={classes.articleHeader}>
        <div>
            <h1 aria-label={subTitle ? `${title}: ${subTitle}` : title}>
                <span>{title}</span>
                {subTitle && <span>{subTitle}</span>}
            </h1>
        </div>
    </header>
));
