import slugify from "slugify";

import { slugifyOptions } from "../../utils/config";
import { tagDescriptions } from "../../utils/tagDescriptions";
import { withCss } from "../../utils/withCss";
import classes from "./TagDetail.module.scss";

type TagDetailProps = {
    tag: string;
};

export const TagDetail = withCss(classes, ({ tag }: TagDetailProps) => (
    <div class={classes.tagDetail}>
        <h2>
            <a href={`/tag/${slugify(tag, slugifyOptions)}.html`}>{tag}</a>
        </h2>
        <div>{tagDescriptions[tag]}</div>
    </div>
));
