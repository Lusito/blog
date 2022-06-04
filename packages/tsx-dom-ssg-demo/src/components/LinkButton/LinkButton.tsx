import { withCss } from "../../utils/withCss";
import classes from "./LinkButton.module.scss";

type LinkButtonProps = {
    href?: string;
    label: string | number;
    title?: string;
};
export const LinkButton = withCss(classes, ({ href, label, title }: LinkButtonProps) => {
    if (!href) return <span class={classes.linkButtonDisabled}>{label}</span>;

    return (
        <a href={href} class={classes.linkButton} title={title}>
            {label}
        </a>
    );
});
