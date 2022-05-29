import { withCss } from "../../utils/withCss";
import classes from "./Header.module.scss";

type HeaderProps = {
    pageTitle: string;
    siteTitle: string;
};

export const Header = withCss(classes, ({ pageTitle, siteTitle }: HeaderProps) => (
    <header class={classes.header}>
        <div>
            {pageTitle} | {siteTitle}
        </div>
        <form class={classes.searchBar} action="index.html">
            <input type="search" placeholder="Search" />
        </form>
    </header>
));
