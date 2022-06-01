import { withCss } from "../../utils/withCss";
import classes from "./Header.module.scss";

type HeaderProps = {
    siteTitle: string;
};

export const Header = withCss(classes, ({ siteTitle }: HeaderProps) => (
    <header class={classes.header}>{siteTitle}</header>
));
