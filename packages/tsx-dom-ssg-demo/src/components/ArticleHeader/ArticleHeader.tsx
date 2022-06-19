import { withCss } from "../../utils/withCss";
import classes from "./ArticleHeader.module.scss";

type ArticleHeaderProps = {
    title: string;
    description: string;
    date?: Date;
};

export const ArticleHeader = withCss(classes, ({ title, description, date }: ArticleHeaderProps) => (
    <header class={classes.articleHeader}>
        <div>
            <h1>{title}</h1>
            {date && <div>{date.toDateString()}</div>}
            {/* fixme: should article description rather be outside of the head, since it's easy to overlook? */}
            {description && <p>{description}</p>}
        </div>
    </header>
));
