export type VNode = (document: Document, thisArg: ComponentThis) => Promise<HTMLElement | DocumentFragment | Text>;

export interface BaseProps {
    children?: ComponentChildren;
}

export interface HTMLComponentProps extends BaseProps {
    dangerouslySetInnerHTML?: string;
}

export interface ComponentThis {
    [s: symbol]: unknown;
}

export type Component<T = BaseProps> = (this: ComponentThis, props: T) => ComponentChildren;

export type ComponentChild = VNode | string | number | false | undefined | null;
export type ComponentChildren = ComponentChild | ComponentChildren[] | Promise<ComponentChild | ComponentChildren[]>;
