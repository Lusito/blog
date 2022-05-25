import { Css } from "../Css";
import classes from "./BackLink.module.scss";

export type BackLinkProps = {
    label: string;
    url: string;
};

export async function BackLink({ label, url }: BackLinkProps) {
    return (
        <>
            <Css style={classes} />
            <a href={url} class={classes.backLink}>{label}</a>
        </>
    );
}
