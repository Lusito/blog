import type { ComponentThis, TsxDocument } from "./types";

export abstract class VNode {
    public async resolve(self: ComponentThis) { }

    public abstract toDom(document: TsxDocument): HTMLElement | DocumentFragment | Text;
}
