import { BaseProps } from "tsx-dom-ssr";

import { Css } from "../components/Css";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import classes from "./DefaultLayout.module.scss";

interface DefaultLayoutProps extends BaseProps {
    title: string;
}

export function DefaultLayout({ children, title }: DefaultLayoutProps) {
    return (
        <html>
            <head>
                <script src="/custom-elements.js" />
                <title>{title}</title>
            </head>
            <body class={classes.body}>
                <Css style={classes} />
                <Header />
                <h1>{title}</h1>
                {children}
                <Footer />
            </body>
        </html>
    );
}
