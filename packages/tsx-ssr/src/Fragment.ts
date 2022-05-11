import type { InternalComponent } from "./types";

export const Fragment: InternalComponent = (props) => props.children;
Fragment.__tsxInternal = true;
