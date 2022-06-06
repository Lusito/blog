export type Handler<T = Event> = (event?: T) => void;

export class EventManager<T = Event> {
    readonly name: string;

    private handlers = new Set<Handler<T>>();

    constructor(name: string) {
        this.name = name;
    }

    emit(originalEvent?: T) {
        // call saved handlers with "on" method and pass originalEvent object if available
        this.handlers.forEach((handler) => {
            try {
                handler(originalEvent);
            } catch (error) {
                console.error(error);
            }
        });

        // trigger event on document with prefix "swup:"
        const event = new CustomEvent(`swup:${this.name}`, { detail: this.name });
        document.dispatchEvent(event);
    }

    on(handler: Handler<T>) {
        this.handlers.add(handler);

        return () => this.off(handler);
    }

    off(handler?: Handler<T>) {
        if (!handler) {
            this.handlers.clear();
        } else if (!this.handlers.delete(handler)) {
            console.warn(`Handler for event '${this.name}' no found.`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static off(map: Record<string, EventManager<any>>) {
        Object.keys(map).forEach((keys) => map[keys].off());
    }
}
