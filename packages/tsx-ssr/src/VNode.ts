import type { ComponentThis } from "./types";

export abstract class VNode {
    public async resolve(self: ComponentThis) { }

    public abstract toDom(): HTMLElement | DocumentFragment | Text;
}
