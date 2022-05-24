import * as Turbo from "@hotwired/turbo";

class PagePicker extends HTMLSelectElement {
    onChangeHandler = () => {
        const url = this.getAttribute("url")?.replace("{{VALUE}}", this.value);
        if (url) {
            Turbo.visit(url);
        }
    };

    connectedCallback() {
        this.addEventListener("change", this.onChangeHandler);
    }

    disconnectedCallback() {
        this.removeEventListener("change", this.onChangeHandler);
    }
}

customElements.define("page-picker", PagePicker, { extends: "select" });

export type PagePickerProps = {
    url: string;
};
