import classNames from "classnames";
import { BaseProps } from "tsx-dom-ssr";

import { withCss } from "../../utils/withCss";
import classes from "./LinkButton.module.scss";

type LinkButtonProps = BaseProps & {
    href?: string;
    ariaLabel?: string;
    ariaCurrent?: "page";
    title?: string;
    class?: string;
};
export const LinkButton = withCss(classes, (props: LinkButtonProps) => {
    const { href, children, ariaLabel, ariaCurrent, title } = props;
    const clazz = classNames(href ? classes.linkButton : classes.linkButtonDisabled, props.class);

    if (!href) {
        return (
            <span class={clazz} title={title} aria-label={ariaLabel} aria-current={ariaCurrent}>
                {children}
            </span>
        );
    }

    return (
        <a href={href} class={clazz} title={title} aria-label={ariaLabel} aria-current={ariaCurrent}>
            {children}
        </a>
    );
});
