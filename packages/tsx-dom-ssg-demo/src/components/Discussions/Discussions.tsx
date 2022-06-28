import { withCss } from "../../utils/withCss";
import classes from "./Discussions.module.scss";

export const Discussions = withCss(classes, () => (
    <div class={classes.discussions}>
        <script
            src="https://giscus.app/client.js"
            // fixme: my repo
            data-repo="giscus/giscus"
            data-repo-id="MDEwOlJlcG9zaXRvcnkzNTE5NTgwNTM="
            data-category="General"
            data-category-id="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyNzk2NTc1"
            data-mapping="title"
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
