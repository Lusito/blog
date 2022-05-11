import { TsxDocument } from "./types";
import { VNode } from "./VNode";

export class VTextNode extends VNode {
    protected text: string;

    public constructor(text: string) {
        super();
        this.text = text;
    }

    public override toDom(document: TsxDocument) {
        return document.createTextNode(this.text);
    }
}