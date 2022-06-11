import { BaseProps } from "tsx-dom-ssr";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { withCss } from "../utils/withCss";
import classes from "./DefaultLayout.module.scss";
import { reloadScript } from "../utils/reloadScript";
import { siteTitle } from "../utils/config";
import { SideBar } from "../components/SideBar/SideBar";

interface DefaultLayoutProps extends BaseProps {
    pageTitle: string;
}

export const DefaultLayout = withCss(classes, ({ children, pageTitle }: DefaultLayoutProps) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <base href="/" />
            <title>
                {pageTitle} - {siteTitle}
            </title>
            {reloadScript}
            <script src="/custom-elements.js" defer />
        </head>
        <body>
            <SideBar />
            <div class={classes.mainwrapper}>
                <Header siteTitle={siteTitle} />
                <div class={`${classes.content} swup-container`}>
                    {children}
                    <Footer />
                </div>
            </div>
        </body>
    </html>
));
