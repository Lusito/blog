/* eslint-disable @typescript-eslint/no-unused-vars */
import { IntrinsicElementsHTML, IntrinsicElementsSVG } from "./types";

export * from "./createElement";
export * from "./jsx-runtime";
export * from "./types";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        // Return type of jsx syntax
        type Element = HTMLElement | SVGElement;

        // The property name to use
        interface ElementAttributesProperty {
            props: unknown;
        }

        // The children name to use
        interface ElementChildrenAttribute {
            children: unknown;
        }

        // The available string tags
        type IntrinsicElements = IntrinsicElementsHTML & IntrinsicElementsSVG;
    }
}
