import type { CustomElementProps } from "tsx-dom-ssr";

class CodeCopyButton extends HTMLElement {
    connectedCallback() {
        this.setAttribute("tabindex", "0");
        this.className = this.getAttribute("enhancedClass") ?? "";
        this.addEventListener("click", this.onClick);
        this.addEventListener("keydown", this.onKeyDown);
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.onClick);
        this.removeEventListener("keydown", this.onKeyDown);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            this.onClick();
        }
    };

    private onClick = () => {
        const code = this.getAttribute("code");
        if (code) {
            navigator.clipboard.writeText(code);
        }
    };
}

customElements.define("code-copy-button", CodeCopyButton);

type CodeCopyButtonProps = {
    enhancedClass: string;
};

declare module "tsx-dom-ssr" {
    interface CustomElementsHTML {
        "code-copy-button": CustomElementProps<CodeCopyButtonProps, "div">;
    }
}
