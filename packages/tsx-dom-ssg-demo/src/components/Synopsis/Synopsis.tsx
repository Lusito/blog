import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./Synopsis.module.scss";

export const Synopsis = withCss(classes, ({ children }: BaseProps) => (
    <div class={classes.synopsis}>
        <p>{children}</p>
    </div>
));
