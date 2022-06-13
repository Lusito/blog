import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./LinkButton.module.scss";

type LinkButtonProps = BaseProps & {
    href?: string;
    ariaLabel?: string;
    title?: string;
};
export const LinkButton = withCss(classes, ({ href, children, ariaLabel, title }: LinkButtonProps) => {
    if (!href) return <span class={classes.linkButtonDisabled}>{children}</span>;

    return (
        <a href={href} class={classes.linkButton} title={title} aria-label={ariaLabel}>
            {children}
        </a>
    );
});
