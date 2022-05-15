import type { ComponentThis } from './types';

export abstract class VNode {
  public abstract toDom(
    document: Document,
    thisArg: ComponentThis
  ): Promise<HTMLElement | DocumentFragment | Text>;
}
