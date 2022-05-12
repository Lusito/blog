import type { VNode } from './VNode';

export type HTMLComponentProps = {
  children?: ComponentChildren;
  dangerouslySetInnerHTML?: string;
};

export interface BaseProps {
  children?: ComponentChildren;
}

export interface ComponentThis {
  [s: symbol]: unknown;
}

export type Component<T = BaseProps> = (
  this: ComponentThis,
  props: T
) => ComponentChildren;
export type ComponentChild = VNode | string | number | false | undefined | null;
export type ComponentChildren =
  | ComponentChild
  | ComponentChildren[]
  | Promise<ComponentChild | ComponentChildren[]>;
