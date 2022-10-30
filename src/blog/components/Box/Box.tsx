import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import { DateTime } from "../DateTime/DateTime";
import { LinkButton } from "../LinkButton/LinkButton";
import classes from "./Box.module.scss";

type BoxProps = BaseProps & {
    href: string;
    title: string;
    date?: Date;
};

export const Box = withCss(classes, ({ href, title, date, children }: BoxProps) => (
    <article class={classes.box}>
        <h2>
            <LinkButton href={href} class={classes.boxLink}>
                <span class={classes.label}>{title}</span>
                {date && <DateTime date={date} />}
            </LinkButton>
        </h2>
        <div class={classes.boxChildren}>{children}</div>
    </article>
));
