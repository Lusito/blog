import type { BaseProps } from './types';
import { internalComponent } from './utils';

export const Fragment = internalComponent((props: BaseProps) => props.children);
