import { Css } from "../Css";
import classes from "./Header.module.scss";

export const Header = () => (
    <div class={classes.header}>
        <Css style={classes} />
        <div class={classes.headerTitle}>Schwifty Database</div>
        <a href="/characters">Characters</a>
        <a href="/locations">Locations</a>
        <a href="/episodes">Episodes</a>
    </div>
);
