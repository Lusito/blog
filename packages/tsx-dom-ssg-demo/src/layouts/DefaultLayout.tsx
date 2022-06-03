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
    <html lang="en" class="dark">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <base href="/" />
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
