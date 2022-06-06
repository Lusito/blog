import { markSwupElements } from "./dataSwup";

const domParser = new DOMParser();

type PageDataBlock = {
    html: string;
    id: string;
};

export class PageData {
    readonly url: string;

    readonly title: string;

    readonly html: string;

    readonly blocks: PageDataBlock[];

    private docRef: WeakRef<Document>;

    constructor(url: string, title: string, html: string, blocks: PageDataBlock[], docRef: WeakRef<Document>) {
        this.url = url;
        this.title = title;
        this.html = html;
        this.blocks = blocks;
        this.docRef = docRef;
    }

    public cloneWithUrl(newUrl: string) {
        return new PageData(newUrl, this.title, this.html, this.blocks, this.docRef);
    }

    get document() {
        let doc = this.docRef.deref();
        if (!doc) {
            doc = domParser.parseFromString(this.html, "text/html");
            this.docRef = new WeakRef(doc);
        }
        return doc;
    }
}

export const getPageDataFromHtml = (url: string, html: string, containers: string[]) => {
    const doc = domParser.parseFromString(html, "text/html");
    const blocks = markSwupElements(doc, containers).map(({ element, id }) => ({
        html: element.outerHTML,
        id,
    }));

    return new PageData(url, doc.querySelector("title")?.textContent ?? "", html, blocks, new WeakRef(doc));
};
