import { withCss } from "../../utils/withCss";
import classes from "./ArticleHead.module.scss";

type ArticleHeadProps = {
    title: string;
    image: string;
    description?: string;
};

export const ArticleHead = withCss(classes, ({ title, image, description }: ArticleHeadProps) => (
    <div class={classes.articleHead} style={{ backgroundImage: `url(/assets/${image})` }}>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
    </div>
));
