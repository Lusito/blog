function debounce(func: () => void, timeout = 300) {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, timeout);
    };
}

// fixme: pagination if too many items?
// fixme: filter by tags, maybe date-range?
class SearchContainer extends HTMLElement {
    searchField?: HTMLInputElement;

    searchItems: HTMLElement[] = [];

    connectedCallback() {
        const searchFieldClass = this.getAttribute("searchField") ?? "";
        const searchItemClass = this.getAttribute("searchItem") ?? "";
        const searchField = this.querySelector(`.${searchFieldClass}`);
        this.searchItems = Array.from(this.querySelectorAll(`.${searchItemClass}`));
        if (searchField instanceof HTMLInputElement && this.searchItems.length) {
            this.searchField = searchField;
            searchField.addEventListener("input", this.onInput);
            this.searchField.value = "";
        }
    }

    disconnectedCallback() {
        this.searchField?.removeEventListener("input", this.onInput);
    }

    private onInput = debounce(() => {
        if (this.searchField) {
            const terms = this.searchField.value
                .toLocaleLowerCase()
                .split(" ")
                .filter((v) => v.trim());
            if (!terms.length) {
                for (const item of this.searchItems) {
                    item.style.display = "none";
                }
            } else {
                for (const item of this.searchItems) {
                    const text = item.textContent?.toLocaleLowerCase();
                    const visible = text && terms.every((term) => text.includes(term));
                    item.style.display = visible ? "block" : "none";
                }
            }
        }
    });
}

customElements.define("search-container", SearchContainer);

export type SearchContainerProps = {
    searchField: string;
    searchItem: string;
};
