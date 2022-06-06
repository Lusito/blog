type LinkData = {
    pathname: string;
    hash: string;
    search: string;
};

export class Link {
    link: HTMLAnchorElement | SVGElement;

    constructor(elementOrUrl: HTMLAnchorElement | SVGElement | string) {
        if (elementOrUrl instanceof Element) {
            this.link = elementOrUrl;
        } else {
            const a = document.createElement("a");
            a.href = elementOrUrl;
            this.link = a;
        }
    }

    private getData(): LinkData {
        if (this.link instanceof HTMLAnchorElement) {
            return this.link;
        }
        const href = this.link.getAttribute("href");
        if (href) {
            return new URL(href);
        }
        return {
            pathname: "/",
            hash: "",
            search: "",
        };
    }

    getPath(): string {
        const { pathname } = this.getData();
        return pathname.startsWith("/") ? pathname : `/${pathname}`;
    }

    getAddress() {
        const data = this.getData();
        const address = `${data.pathname}${data.search}`;
        return address.startsWith("/") ? address : `/${address}`;
    }

    getHash(): string {
        return this.getData().hash;
    }
}
