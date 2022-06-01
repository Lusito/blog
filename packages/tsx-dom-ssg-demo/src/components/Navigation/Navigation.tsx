import { ComponentThis } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./Navigation.module.scss";
import logo from "./logo.png";

type NavItemProps = {
    label: string;
    path: string;
};

function NavItem(this: ComponentThis, { label, path }: NavItemProps) {
    return (
        <li class={path === this.path ? classes.selected : undefined}>
            <a href={path}>{label}</a>
        </li>
    );
}

interface NavigationProps {
    siteTitle: string;
}

// eslint-disable-next-line func-names
export const Navigation = withCss(classes, ({ siteTitle }: NavigationProps) => (
    <nav class={classes.menucolumn}>
        <div class={classes.menuscroller}>
            <div class={classes.logo}>
                <img src={`/${logo}`} alt="logo" />
                <h3>{siteTitle}</h3>
            </div>
            <menu>
                <NavItem path="/" label="Latest Posts" />
                <li>
                    <span>Popular Categories</span>
                    <menu>
                        <NavItem path="/tag/web-development.html" label="Web Development" />
                        <NavItem path="/tag/game-development.html" label="Game Development" />
                    </menu>
                </li>
                <NavItem path="/categories.html" label="All Categories" />
                <NavItem path="/about.html" label="About" />
            </menu>
        </div>
        <div class={classes.menugrip}>
            <div>
                <div />
                <div />
                <div />
            </div>
        </div>
    </nav>
));
