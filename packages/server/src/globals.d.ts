declare namespace JSX {
  interface IntrinsicElements {
    'word-count': import('tsx-types').HTMLAttributes;
  }
}

declare module '*.module.css' {
  const content: {
    _getCss(): string;
    [key: string]: string;
  };
  export = content;
}
