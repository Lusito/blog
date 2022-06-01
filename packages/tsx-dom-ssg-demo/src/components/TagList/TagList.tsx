import { slugify } from "../../utils/getPages";
import { withCss } from "../../utils/withCss";
import classes from "./TagList.module.scss";

type TagListProps = {
    tags: string[];
};

export const TagList = withCss(classes, ({ tags }: TagListProps) => (
    <div class={classes.tagList}>
        {tags.map((tag) => (
            <a href={`/tag/${slugify(tag)}.html`}>{tag}</a>
        ))}
    </div>
));
