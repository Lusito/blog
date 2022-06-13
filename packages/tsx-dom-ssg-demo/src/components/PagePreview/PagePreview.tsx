import { PageInfo } from "../../utils/pageUtils";
import { withCss } from "../../utils/withCss";
import { LinkButton } from "../LinkButton/LinkButton";
import { TagList } from "../TagList/TagList";
import classes from "./PagePreview.module.scss";

type PagePreviewProps = {
    page: PageInfo;
};

export const PagePreview = withCss(classes, ({ page }: PagePreviewProps) => (
    <div class={classes.pagePreview}>
        <h2>
            <LinkButton href={`/${page.slug}.html`}>
                <span class={classes.label}>{page.title}</span>
                <span class={classes.date}>{page.date.toDateString()}</span>
            </LinkButton>
        </h2>
        <div>{page.description}</div>
        <TagList tags={page.tags} />
    </div>
));
