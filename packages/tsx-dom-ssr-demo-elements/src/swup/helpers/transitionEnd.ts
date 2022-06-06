export const transitionEndEventName = (() => {
    const transEndEventNames = {
        transition: "transitionend",
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd otransitionend",
    } as const;
    const el = document.createElement("div");

    for (const name of Object.keys(transEndEventNames) as Array<keyof CSSStyleDeclaration>) {
        if (el.style[name] !== undefined) {
            return transEndEventNames[name as keyof typeof transEndEventNames];
        }
    }

    return "transitionend";
})();
