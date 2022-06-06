import { goToPage } from "../swupInstance";

class PagePicker extends HTMLSelectElement {
    onChangeHandler = () => {
        const url = this.getAttribute("url")?.replace("{{PAGE}}", this.value);
        if (url) {
            goToPage(url);
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
