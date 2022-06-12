import { withCss } from "../../utils/withCss";
import classes from "./SideBarHeader.module.scss";
import logo from "./logo.webp";
import { siteTitle } from "../../utils/config";

// eslint-disable-next-line func-names
export const SideBarHeader = withCss(classes, () => (
    <header class={classes.sideBarHeader}>
        <img src={`/${logo}`} alt="logo" />
        <h3>{siteTitle}</h3>
    </header>
));
