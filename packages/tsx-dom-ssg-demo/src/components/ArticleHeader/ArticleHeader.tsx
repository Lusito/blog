import { withCss } from "../../utils/withCss";
import { DateTime } from "../DateTime/DateTime";
import classes from "./ArticleHeader.module.scss";

type ArticleHeaderProps = {
    title: string;
    description: string;
    created?: Date;
    modified?: Date;
};

export const ArticleHeader = withCss(classes, ({ title, description, created, modified }: ArticleHeaderProps) => (
    <header class={classes.articleHeader}>
        <div>
            <h1>{title}</h1>
            {created && (
                <div>
                    {"Written "}
                    <b>
                        <DateTime date={created} />
                    </b>
                    {modified && (
                        <span>
                            , updated <DateTime date={created} />
                        </span>
                    )}
                </div>
            )}
            {/* fixme: should article description rather be outside of the head, since it's easy to overlook? */}
            {description && <p>{description}</p>}
        </div>
    </header>
));
