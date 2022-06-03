import { withCss } from "../../utils/withCss";
import classes from "./ArticleHead.module.scss";

type ArticleHeadProps = {
    title: string;
    description?: string;
};

export const ArticleHead = withCss(classes, ({ title, description }: ArticleHeadProps) => (
    <div class={classes.articleHead} style={{ backgroundImage: "url(/assets/article-head.jpg)" }}>
        <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
        </div>
    </div>
));
