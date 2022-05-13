import { BaseProps } from 'tsx-ssr';

export function DefaultLayout({ children }: BaseProps) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
