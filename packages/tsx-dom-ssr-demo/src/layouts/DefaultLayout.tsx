import { BaseProps } from "tsx-dom-ssr";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { withCss } from "../utils/withCss";
import classes from "./DefaultLayout.module.scss";

interface DefaultLayoutProps extends BaseProps {
    title: string;
}

export const DefaultLayout = withCss(classes, ({ children, title }: DefaultLayoutProps) => (
    <html>
        <head>
            <script src="/custom-elements.js" />
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body class={classes.body}>
            <Header />
            <div id="swup" class="transition-fade">
                <h1>{title}</h1>
                {children}
            </div>
            <Footer />
        </body>
    </html>
));
