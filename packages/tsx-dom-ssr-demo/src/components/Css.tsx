export const Css = ({ style }: { style: { _getCss(): string } }) => (
  <head>
    <style dangerouslySetInnerHTML={style._getCss()} />
  </head>
);
