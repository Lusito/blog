import { withCss } from "../../utils/withCss";
import classes from "./Discussions.module.scss";

export const Discussions = withCss(classes, () => (
    <div class={classes.discussions}>
        <script
            src="https://giscus.app/client.js"
            data-repo="Lusito/blog"
            data-repo-id="R_kgDOHpGztA"
            data-category="Announcements"
            data-category-id="DIC_kwDOHpGztM4CQKXP"
            data-mapping="og:title"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="bottom"
            data-theme="preferred_color_scheme"
            data-lang="en"
            data-loading="lazy"
            crossOrigin="anonymous"
            async
        ></script>
    </div>
));
