import { withCss } from "../../utils/withCss";
import classes from "./Navigation.module.scss";
import logo from "./logo.png";

interface NavigationProps {
    siteTitle: string;
}

export const Navigation = withCss(classes, ({ siteTitle }: NavigationProps) => (
    <nav class={classes.menucolumn}>
        <div class={classes.menuscroller}>
            <div class={classes.logo}>
                <img src={`/${logo}`} alt="logo" />
                <h3>{siteTitle}</h3>
            </div>
            <menu>
                <li>
                    <a href="/">Home</a>
                </li>
                <li class={classes.selected}>
                    <a href="#about">About</a>
                </li>
                <li>
                    <a href="#cv">My CV</a>
                </li>
                <li>
                    <a href="#impress">Impress</a>
                </li>
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
