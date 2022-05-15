import type { ComponentThis, BaseProps } from './types';
import {
  internalComponent,
  InternalComponent,
  flattenChildren,
  appendChildren,
} from './internal';
import { VNode } from './VNode';

export type ContextProviderProps<T = unknown> = BaseProps & { value: T };
export type ContextProvider<T = unknown> = InternalComponent<
  ContextProviderProps<T>
>;
export type Context<T = unknown> = {
  Provider: ContextProvider<T>;
  for(componentThis: ComponentThis): T;
};

export function createContext<T>(fallback: T): Context<T> {
  const type = Symbol();

  return {
    Provider: internalComponent(
      (props: ContextProviderProps<T>) => new VContextNode(type, props)
    ),
    for(componentThis) {
      if (type in componentThis) {
        return componentThis[type] as T;
      }

      return fallback;
    },
  };
}

class VContextNode extends VNode {
  private type: symbol;
  private value: unknown;
  private children: VNode[];

  public constructor(type: symbol, { value, children }: ContextProviderProps) {
    super();
    this.children = flattenChildren(children);
    this.type = type;
    this.value = value;
  }

  public override toDom(
    document: Document,
    thisArg: ComponentThis
  ): Promise<HTMLElement | DocumentFragment | Text> {
    return appendChildren(
      document,
      document.createDocumentFragment(),
      this.children,
      { ...thisArg, [this.type]: this.value }
    );
  }
}
