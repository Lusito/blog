import { BaseProps } from "tsx-dom-ssr";

export function DefaultLayout({ children }: BaseProps) {
    return (
        <html>
            <head>
                <script src="/custom-elements.js" />
            </head>
            <body>{children}</body>
        </html>
    );
}
