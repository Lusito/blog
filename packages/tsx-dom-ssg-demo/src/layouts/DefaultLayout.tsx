import { BaseProps } from "tsx-dom-ssr";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { withCss } from "../utils/withCss";
import classes from "./DefaultLayout.module.scss";
import { reloadScript } from "../utils/reloadScript";
import { Navigation } from "../components/Navigation/Navigation";

const siteTitle = "Lusitos Blog";

interface DefaultLayoutProps extends BaseProps {
    pageTitle: string;
}

export const DefaultLayout = withCss(classes, ({ children, pageTitle }: DefaultLayoutProps) => (
    <html>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
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
                <Header pageTitle={pageTitle} siteTitle={siteTitle} />
                <div class={classes.content}>{children}</div>
                <Footer />
            </div>
        </body>
    </html>
));
