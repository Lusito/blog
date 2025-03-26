import type { CustomElementProps } from "tsx-dom-ssr";

import { scatman } from "../scatman";

/* eslint-disable max-classes-per-file */
class CodeBlock extends HTMLElement {
    private activated = false;

    connectedCallback() {
        if (this.activated) this.activate();
    }

    disconnectedCallback() {
        this.tabs.removeEventListener("click", this.onClick);
    }

    public activate() {
        this.tabs.addEventListener("click", this.onClick);
        this.tabs.addEventListener("keydown", this.onKeyDown);
    }

    private get tabs() {
        return this.querySelector("code-block-tabs") as HTMLElement;
    }

    private get panels() {
        return this.querySelector("code-block-panels") as HTMLElement;
    }

    public getElements() {
        return { tabs: this.tabs, panels: this.panels };
    }

    private selectTab(tab: Element | null, focus = false) {
        if (tab instanceof HTMLElement && tab.matches("button")) {
            this.tabs.querySelectorAll("button").forEach((t) => {
                t.setAttribute("aria-selected", String(t === tab));
                t.tabIndex = t === tab ? 0 : -1;
            });
            const panel = this.querySelector(`#${tab.getAttribute("aria-controls")}`);
            this.panels
                .querySelectorAll("pre")
                .forEach((p) => (p === panel ? p.removeAttribute("hidden") : p.setAttribute("hidden", "hidden")));

            focus && tab.focus();
        }
    }

    private onClick = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement) this.selectTab(e.target);
    };

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            const { tabs } = this;
            const focusedTab = tabs.querySelector("[aria-selected='true']");
            if (focusedTab) {
                if (e.key === "ArrowRight") {
                    this.selectTab(focusedTab.nextElementSibling ?? this.tabs.firstElementChild, true);
                } else if (e.key === "ArrowLeft") {
                    this.selectTab(focusedTab.previousElementSibling ?? this.tabs.lastElementChild, true);
                }
            }
        }
    };
}

customElements.define("code-block", CodeBlock);

declare module "tsx-dom-ssr" {
    interface CustomElementsHTML {
        "code-block": CustomElementProps<unknown, "div">;
        "code-block-tabs": CustomElementProps<unknown, "div">;
        "code-block-panels": CustomElementProps<unknown, "div">;
    }
}

function expectSingleChild(children: HTMLCollection) {
    if (children.length !== 1) {
        return null;
    }
    return children[0];
}

let tabCount = 0;
function mergeTabs() {
    const elements = Array.from(document.querySelectorAll("code-block"));
    for (const el of elements) {
        const prevElement = el.previousElementSibling;
        const prevElements = prevElement instanceof CodeBlock ? prevElement.getElements() : null;
        const hasPrevElement = !!prevElements;

        const currentElements = el instanceof CodeBlock ? el.getElements() : null;
        if (currentElements) {
            const tabNumber = tabCount++;
            const tabId = `code-block-tab-${tabNumber}`;
            const panelId = `code-block-tab-panel-${tabNumber}`;
            const tab = expectSingleChild(currentElements.tabs.children);
            if (tab) {
                tab.setAttribute("aria-selected", String(!hasPrevElement));
                (tab as HTMLElement).tabIndex = hasPrevElement ? -1 : 0;
                Object.assign(tab, { id: tabId });
                tab.setAttribute("aria-controls", panelId);
            }

            const panel = expectSingleChild(currentElements.panels.children);
            if (panel) {
                if (hasPrevElement) panel.setAttribute("hidden", "hidden");
                else panel.removeAttribute("hidden");

                Object.assign(panel, { id: panelId, role: "tabpanel", tabIndex: 0 });
                panel.setAttribute("aria-labelledby", tabId);
            }
        }

        if (prevElements && currentElements) {
            const tab = expectSingleChild(currentElements.tabs.children);
            if (tab) prevElements.tabs.appendChild(tab);

            const panel = expectSingleChild(currentElements.panels.children);
            if (panel) prevElements.panels.appendChild(panel);

            el.remove();
        }
    }

    document
        .querySelectorAll("code-block")
        .forEach((codeBlock) => codeBlock instanceof CodeBlock && codeBlock.activate());
}

mergeTabs();
scatman.events.contentReplaced.on(mergeTabs);
