import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
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
            <LinkButton href={href}>
                <span class={classes.label}>{title}</span>
                {date && <span class={classes.date}>{date.toDateString()}</span>}
            </LinkButton>
        </h2>
        {children}
    </article>
));
