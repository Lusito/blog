import { ComponentThis } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./SideBarMenu.module.scss";

type NavItemProps = {
    label: string;
    ariaLabel?: string;
    path: string;
};

function NavItem(this: ComponentThis, { label, ariaLabel, path }: NavItemProps) {
    return (
        <li class={path === this.path ? classes.selected : undefined}>
            <a href={path} aria-label={ariaLabel}>
                {label}
            </a>
        </li>
    );
}

// eslint-disable-next-line func-names
export const SideBarMenu = withCss(classes, () => (
    <ul class={`${classes.sideBarMenu} scatman-container`}>
        <NavItem path="/" label="Latest Posts" />
        <li>
            <span>Top Categories</span>
            <ul>
                <NavItem
                    path="/tag/web-development.html"
                    label="Web Development"
                    ariaLabel="Category: Web Development"
                />
                <NavItem
                    path="/tag/game-development.html"
                    label="Game Development"
                    ariaLabel="Category: Game Development"
                />
                <NavItem path="/tag/toilet-paper.html" label="Toilet Paper" ariaLabel="Category: Toilet Paper" />
            </ul>
        </li>
        <NavItem path="/categories.html" label="All Categories" />
        <NavItem path="/about.html" label="About" ariaLabel="About this blog" />
    </ul>
));
