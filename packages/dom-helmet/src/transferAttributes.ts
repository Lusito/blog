export function transferAttributes(original: Element, element: Element) {
    const attributes = element.getAttributeNames();
    for (const attribute of attributes) {
        const newValue = element.getAttribute(attribute) ?? "";
        const oldValue = original.getAttribute(attribute);

        if (attribute === "class" && oldValue) {
            // Classes will be appended instead of replaced
            original.setAttribute("class", `${oldValue} ${newValue}`);
        } else if (attribute === "style" && oldValue) {
            // Style will be appended instead of replaced
            const separator = oldValue.endsWith(";") ? "" : ";";
            original.setAttribute("style", `${oldValue}${separator}${newValue}`);
        } else {
            original.setAttribute(attribute, newValue);
        }
    }

    element.remove();
}
