import { ComponentThis } from "tsx-dom-ssr";

import { SomeNumber } from "../../contexts/SomeNumber";
import { Css } from "../Css";
import classes from "./LazyImage.module.css";

export function LazyImage(this: ComponentThis, { src }: { src: string }) {
    const num = SomeNumber.for(this);
    return [
        <Css style={classes} />,
        <img class={classes.lazyImage} is="lazy-image" data-src={src} />,
        <div>{num}</div>,
    ];
}
