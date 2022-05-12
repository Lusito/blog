import { ComponentThis } from 'tsx-ssr';
import { SomeNumber } from '../../SomeNumber';

import classes from './LazyImage.module.css';

const Css = ({ style }: { style: { _getCss(): string } }) => (
  <style dangerouslySetInnerHTML={style._getCss()} />
);

export function LazyImage(this: ComponentThis, { src }: { src: string }) {
  const num = SomeNumber.for(this);
  return [
    <img class={classes.lazyImage} is="lazy-image" data-src={src} />,
    <Css style={classes} />,
    <div>{num}</div>,
  ];
}
