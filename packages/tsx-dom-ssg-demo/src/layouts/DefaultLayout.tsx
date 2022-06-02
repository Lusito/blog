import { BaseProps } from "tsx-dom-ssr";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { withCss } from "../utils/withCss";
import classes from "./DefaultLayout.module.scss";
import { reloadScript } from "../utils/reloadScript";
import { Navigation } from "../components/Navigation/Navigation";
import { siteTitle } from "../utils/config";

interface DefaultLayoutProps extends BaseProps {
    pageTitle: string;
}

export const DefaultLayout = withCss(classes, ({ children, pageTitle }: DefaultLayoutProps) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=PT+Serif"
                type="text/css"
                media="all"
            />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Sans" type="text/css" media="all" />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Doppio+One"
                type="text/css"
                media="all"
            />
            <title>
                {pageTitle} - {siteTitle}
            </title>
            {reloadScript}
        </head>
        <body>
            <Navigation siteTitle={siteTitle} />
            <div class={classes.mainwrapper}>
                <Header siteTitle={siteTitle} />
                <div class={classes.content}>
                    {children}
                    <Footer />
                </div>
            </div>
        </body>
    </html>
));
