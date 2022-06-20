class CodeCopyButton extends HTMLElement {
    connectedCallback() {
        this.className = this.getAttribute("enhancedClass") ?? "";
        this.addEventListener("click", this.onClick);
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.onClick);
    }

    private onClick = () => {
        const code = this.getAttribute("code");
        if (code) {
            navigator.clipboard.writeText(code);
        }
    };
}

customElements.define("code-copy-button", CodeCopyButton);

export type CodeCopyButtonProps = {
    enhancedClass: string;
};
