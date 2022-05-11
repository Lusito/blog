import type { ComponentThis } from './types';

export abstract class VNode {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async resolve(thisArg: ComponentThis) {}

  public abstract toDom(
    document: Document
  ): HTMLElement | DocumentFragment | Text;
}
