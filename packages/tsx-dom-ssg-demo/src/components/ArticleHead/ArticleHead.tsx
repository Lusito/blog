import { withCss } from "../../utils/withCss";
import classes from "./ArticleHead.module.scss";

type ArticleHeadProps = {
    title: string;
    description: string;
    date?: Date;
};

export const ArticleHead = withCss(classes, ({ title, description, date }: ArticleHeadProps) => (
    <div class={classes.articleHead}>
        <div>
            <h1>{title}</h1>
            {date && <div>{date.toDateString()}</div>}
            {description && <p>{description}</p>}
        </div>
    </div>
));
