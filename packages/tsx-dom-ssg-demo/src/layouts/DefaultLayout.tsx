import { BaseProps } from "tsx-dom-ssr";

import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { withCss } from "../utils/withCss";
import classes from "./DefaultLayout.module.scss";
// fixme: not as data-uri
import logo from "./backhat_2x.png";
import { reloadScript } from "../utils/reloadScript";

interface DefaultLayoutProps extends BaseProps {
    pageTitle: string;
    siteTitle: string;
}

export const DefaultLayout = withCss(classes, ({ children, pageTitle, siteTitle }: DefaultLayoutProps) => (
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
            <nav class={classes.menucolumn}>
                <div class={classes.menuscroller}>
                    <div class={classes.logo}>
                        <img src={logo} alt="logo" />
                        <h3>{siteTitle}</h3>
                    </div>
                    <menu>
                        <li>
                            <a href="#home">Home</a>
                        </li>
                        <li class={classes.selected}>
                            <a href="#about">About</a>
                        </li>
                        <li>
                            <a href="#cv">My CV</a>
                        </li>
                        <li>
                            <a href="#impress">Impress</a>
                        </li>
                    </menu>
                </div>
                <div class={classes.menugrip}>
                    <div>
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </nav>
            <div class={classes.mainwrapper}>
                <Header pageTitle={pageTitle} siteTitle={siteTitle} />
                <div class={classes.content}>{children}</div>
                <Footer />
            </div>
        </body>
    </html>
));
