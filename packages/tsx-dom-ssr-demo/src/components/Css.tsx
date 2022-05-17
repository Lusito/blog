export const Css = ({ style }: { style: { _getCss(): string } }) => (
    <head>
        {/* eslint-disable-next-line no-underscore-dangle */}
        <style dangerouslySetInnerHTML={style._getCss()} />
    </head>
);
