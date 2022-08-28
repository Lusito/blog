import { withCss } from "../../utils/withCss";
import { DateTime } from "../DateTime/DateTime";
import classes from "./ArticleDateSubTitle.module.scss";

type ArticleDateSubTitleProps = {
    created: Date;
    modified?: Date;
};

export const ArticleDateSubTitle = withCss(classes, ({ created, modified }: ArticleDateSubTitleProps) => (
    <div class={classes.articleDateSubTitle}>
        <span>
            {"Written "}
            <b>
                <DateTime date={created} />
            </b>
        </span>
        {modified && (
            <span>
                updated <DateTime date={modified} />
            </span>
        )}
    </div>
));
