import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./LinkButton.module.scss";

type LinkButtonProps = BaseProps & {
    href?: string;
    ariaLabel?: string;
    ariaCurrent?: "page";
    title?: string;
};
export const LinkButton = withCss(
    classes,
    ({ href, children, ariaLabel, ariaCurrent, title }: LinkButtonProps) => {
        if (!href) {
            return (
                <span class={classes.linkButtonDisabled} aria-label={ariaLabel} aria-current={ariaCurrent}>
                    {children}
                </span>
            );
        }

        return (
            <a href={href} class={classes.linkButton} title={title} aria-label={ariaLabel} aria-current={ariaCurrent}>
                {children}
            </a>
        );
    }
);
