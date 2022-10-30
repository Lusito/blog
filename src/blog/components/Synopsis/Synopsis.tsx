import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./Synopsis.module.scss";
import logo from "../SideBarHeader/logo.webp";

export const Synopsis = withCss(classes, ({ children }: BaseProps) => (
    <div class={classes.synopsis}>
        <img src={`/${logo}`} alt="My head as a vector graphic" />
        <p>{children}</p>
    </div>
));
