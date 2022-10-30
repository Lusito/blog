import { withCss } from "../../utils/withCss";
import classes from "./Footer.module.scss";

export const Footer = withCss(classes, () => (
    <footer class={classes.footer}>
        <span>© {new Date().getFullYear()} Santo Pfingsten</span>
        <span>
            <a href="/rss.xml" data-no-scatman="true">
                RSS Feed
            </a>
        </span>
        <span>
            Powered by <a href="https://github.com/lusito/tsx-dom">tsx-dom-ssr</a>
        </span>
        <span>
            <a href="/legal-notice.html">Legal Notice</a>
        </span>
        <span>
            <a href="/privacy-policy.html">Privacy Policy</a>
        </span>
    </footer>
));
