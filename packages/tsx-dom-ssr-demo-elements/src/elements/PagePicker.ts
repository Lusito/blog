class PagePicker extends HTMLSelectElement {
    onChangeHandler = () => {
        const url = this.getAttribute("url")?.replace("{{VALUE}}", this.value);
        if (url) {
            window.location.href = url;
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
