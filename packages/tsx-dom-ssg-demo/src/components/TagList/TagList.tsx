import slugify from "slugify";

import { slugifyOptions } from "../../utils/config";
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
            <LinkButton href={`/tag/${slugify(tag, slugifyOptions)}.html`} label={tag} title={tagDescriptions[tag]} />
        ))}
    </div>
));
