import { Css } from "../Css";
import classes from "./Footer.module.scss";

export const Footer = () => (
    <div class={classes.footer}>
        <Css style={classes} />
        {"Powered by "}
        <a href="https://github.com/Lusito/tsx-dom" target="_blank" rel="noopener noreferrer">
            tsx-dom-ssr
        </a>
        {" and "}
        <a href="https://rickandmortyapi.com/" target="_blank" rel="noopener noreferrer">
            The Rick and Morty API
        </a>
    </div>
);
