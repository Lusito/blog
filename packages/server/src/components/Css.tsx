export const Css = ({ style }: { style: { _getCss(): string } }) => (
  <style dangerouslySetInnerHTML={style._getCss()} />
);
