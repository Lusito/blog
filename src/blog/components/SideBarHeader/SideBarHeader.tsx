import { withCss } from "../../utils/withCss";
import classes from "./SideBarHeader.module.scss";
import logo from "./logo.webp";
import { siteTitle } from "../../utils/config";

// eslint-disable-next-line func-names
export const SideBarHeader = withCss(classes, () => (
    <a href="/" aria-label="Homepage" class={classes.sideBarHeader}>
        <header>
            <img src={`/${logo}`} alt="My head as a vector graphic" />
            <h3>{siteTitle}</h3>
        </header>
    </a>
));
