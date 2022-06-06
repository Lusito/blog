import type { PageData } from "./pageData";

export type ContainerElement = {
    element: Element;
    id: string;
};

export function markSwupElements(doc: Document, containers: string[], fail = false) {
    const items: ContainerElement[] = [];
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];

        const elements = Array.from(doc.querySelectorAll(container));
        if (!elements.length) {
            if (fail) throw new Error("Received page is invalid.");
            console.warn(`Element ${container} is not in current page.`);
            continue;
        }

        for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            const id = `${i}-${j}`;
            element.setAttribute("data-swup", id); // marks element with data-swup
            items.push({ element, id });
        }
    }
    return items;
}

export function unmarkSwupElements(doc: Document) {
    doc.querySelectorAll("[data-swup]").forEach((element) => element.removeAttribute("data-swup"));
}

export function replaceSwupElements(doc: Document, page: PageData) {
    for (const block of page.blocks) {
        const el = doc.body.querySelector(`[data-swup="${block.id}"]`);
        if (el) {
            el.outerHTML = block.html;
        }
    }
}
