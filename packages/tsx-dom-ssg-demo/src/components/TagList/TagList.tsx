import slugify from "slugify";

import { slugifyOptions } from "../../utils/config";
import { withCss } from "../../utils/withCss";
import classes from "./TagList.module.scss";

type TagListProps = {
    tags: string[];
};

export const TagList = withCss(classes, ({ tags }: TagListProps) => (
    <div class={classes.tagList}>
        {tags.map((tag) => (
            <a href={`/tag/${slugify(tag, slugifyOptions)}.html`}>{tag}</a>
        ))}
    </div>
));
