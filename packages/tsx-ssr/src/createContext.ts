import type { ComponentThis, BaseProps } from './types';
import {
  internalComponent,
  InternalComponent,
  flattenChildren,
  appendChildren,
} from './internal';

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
    Provider: internalComponent((props: ContextProviderProps<T>) => {
      return (document, thisArg) =>
        appendChildren(
          document,
          document.createDocumentFragment(),
          flattenChildren(props.children),
          { ...thisArg, [type]: props.value }
        );
    }),
    for(componentThis) {
      if (type in componentThis) {
        return componentThis[type] as T;
      }

      return fallback;
    },
  };
}
