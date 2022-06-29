import slugify from "slug";

import { tagDescriptions } from "../../utils/tagDescriptions";
import { withCss } from "../../utils/withCss";
import { LinkButton } from "../LinkButton/LinkButton";
import classes from "./TagList.module.scss";

type TagListProps = {
    tags: string[];
};

export const TagList = withCss(classes, ({ tags }: TagListProps) => (
    <div class={classes.tagList}>
        {tags.map((tag) => (
            <LinkButton href={`/tag/${slugify(tag)}.html`} ariaLabel={`Category: ${tag}`} title={tagDescriptions[tag]}>
                {tag}
            </LinkButton>
        ))}
    </div>
));
