import { PageInfo } from "../../utils/pageUtils";
import { withCss } from "../../utils/withCss";
import { TagList } from "../TagList/TagList";
import classes from "./PagePreview.module.scss";

type PagePreviewProps = {
    page: PageInfo;
};

export const PagePreview = withCss(classes, ({ page }: PagePreviewProps) => (
    <div class={classes.pagePreview}>
        <h2>
            <a href={`/${page.slug}.html`}>{page.title}</a>
            <span class={classes.date}>{page.date.toDateString()}</span>
        </h2>
        <div>{page.description}</div>
        <TagList tags={page.tags} />
    </div>
));
