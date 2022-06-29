import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./LinkButton.module.scss";

type LinkButtonProps = BaseProps & {
    href?: string;
    ariaLabel?: string;
    ariaCurrent?: "page";
    title?: string;
    theme?: "default" | "pagination";
};
export const LinkButton = withCss(
    classes,
    ({ href, children, ariaLabel, ariaCurrent, title, theme }: LinkButtonProps) => {
        if (!href) {
            return (
                <span class={classes.linkButtonDisabled} aria-label={ariaLabel} aria-current={ariaCurrent}>
                    {children}
                </span>
            );
        }

        const className = theme === "pagination" ? classes.linkButtonPagination : classes.linkButton;

        return (
            <a href={href} class={className} title={title} aria-label={ariaLabel} aria-current={ariaCurrent}>
                {children}
            </a>
        );
    }
);
