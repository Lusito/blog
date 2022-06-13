import { withCss } from "../../utils/withCss";
import classes from "./Footer.module.scss";

export const Footer = withCss(classes, () => (
    <footer class={classes.footer}>
        © {new Date().getFullYear()} Santo Pfingsten
        {" - "}
        Powered by <a href="https://github.com/lusito/tsx-dom">tsx-dom-ssr</a>
    </footer>
));
