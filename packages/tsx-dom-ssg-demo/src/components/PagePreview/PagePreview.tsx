import { siteUrl } from "../../utils/config";
import { PageInfo } from "../../utils/getPages";
import { withCss } from "../../utils/withCss";
import { TagList } from "../TagList/TagList";
import classes from "./PagePreview.module.scss";

type PagePreviewProps = {
    page: PageInfo;
};

export const PagePreview = withCss(classes, ({ page }: PagePreviewProps) => (
    <div class={classes.pagePreview}>
        <h2>
            <a href={`${siteUrl}/${page.slug}.html`}>{page.title}</a>
            <span class={classes.date}>{page.date.toUTCString()}</span>
        </h2>
        <div>{page.description}</div>
        <TagList tags={page.tags} />
    </div>
));
