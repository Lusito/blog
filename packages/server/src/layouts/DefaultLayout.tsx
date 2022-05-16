import { BaseProps } from 'tsx-dom-ssr';

export function DefaultLayout({ children }: BaseProps) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
