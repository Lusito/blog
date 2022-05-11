import type { ComponentThis, BaseProps, InternalComponent } from './types';
import { flattenChildren } from './utils';
import { VNodeParent } from './VNodeParent';

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
    Provider: Object.assign(
      (props: ContextProviderProps<T>) => new VContextNode(type, props),
      {
        __tsxInternal: true,
      }
    ),
    for(componentThis) {
      if (type in componentThis) {
        return componentThis[type] as T;
      }
      return fallback;
    },
  };
}

class VContextNode extends VNodeParent {
  protected type: symbol;
  protected value: unknown;

  public constructor(type: symbol, { value, children }: ContextProviderProps) {
    super(flattenChildren(children));
    this.type = type;
    this.value = value;
  }

  public override async resolve(thisArg: ComponentThis) {
    return super.resolve({ ...thisArg, [this.type]: this.value });
  }
}
