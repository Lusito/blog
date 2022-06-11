import { withCss } from "../../utils/withCss";
import classes from "./LinkButton.module.scss";

type LinkButtonProps = {
    href?: string;
    label: string | number;
    ariaLabel?: string;
    title?: string;
};
export const LinkButton = withCss(classes, ({ href, label, ariaLabel, title }: LinkButtonProps) => {
    if (!href) return <span class={classes.linkButtonDisabled}>{label}</span>;

    return (
        <a href={href} class={classes.linkButton} title={title} aria-label={ariaLabel}>
            {label}
        </a>
    );
});
