import type { ComponentThis, BaseProps } from "./types";
import { internalComponent, InternalComponent } from "./internal";
import { toDom } from "./domUtils";

export type ContextProviderProps<T = unknown> = BaseProps & { value: T };
export type ContextProvider<T = unknown> = InternalComponent<ContextProviderProps<T>>;
export type Context<T = unknown> = {
    Provider: ContextProvider<T>;
    for(componentThis: ComponentThis): T;
};

export function createContext<T>(fallback: T, description?: string): Context<T> {
    const type = Symbol(description);

    return {
        Provider: internalComponent(
            (props: ContextProviderProps<T>) => (document, thisArg) =>
                toDom(document, props.children, {
                    ...thisArg,
                    [type]: props.value,
                })
        ),
        for(componentThis) {
            if (type in componentThis) {
                return componentThis[type] as T;
            }

            return fallback;
        },
    };
}
