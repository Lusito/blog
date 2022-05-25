import { BaseProps } from "tsx-dom-ssr";

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
            <body>{children}</body>
        </html>
    );
}
