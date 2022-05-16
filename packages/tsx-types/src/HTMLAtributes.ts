export type StyleAttributes = {
  [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K];
};

export interface HTMLAttributes {
  // Standard HTML Attributes
  accept?: string;
  acceptCharset?: string;
  accessKey?: string;
  action?: string;
  allowFullScreen?: boolean;
  allowTransparency?: boolean;
  alt?: string;
  async?: boolean;
  autocomplete?: string;
  autofocus?: boolean;
  autoPlay?: boolean;
  capture?: boolean;
  cellPadding?: number | string;
  cellSpacing?: number | string;
  charSet?: string;
  challenge?: string;
  checked?: boolean;
  class?: string;
  cols?: number;
  colSpan?: number;
  content?: string;
  contentEditable?: boolean;
  contextMenu?: string;
  controls?: boolean;
  controlsList?: string;
  coords?: string;
  crossOrigin?: string;
  data?: string;
  dateTime?: string;
  default?: boolean;
  defer?: boolean;
  dir?: string;
  disabled?: boolean;
  download?: string;
  draggable?: boolean;
  encType?: string;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  frameBorder?: number | string;
  headers?: string;
  height?: number | string;
  hidden?: boolean;
  high?: number;
  href?: string;
  hrefLang?: string;
  for?: string;
  httpEquiv?: string;
  icon?: string;
  id?: string;
  inputMode?: string;
  integrity?: string;
  is?: string;
  keyParams?: string;
  keyType?: string;
  kind?: string;
  label?: string;
  lang?: string;
  list?: string;
  loop?: boolean;
  low?: number;
  manifest?: string;
  marginHeight?: number;
  marginWidth?: number;
  max?: number | string;
  maxLength?: number;
  media?: string;
  mediaGroup?: string;
  method?: string;
  min?: number | string;
  minLength?: number;
  multiple?: boolean;
  muted?: boolean;
  name?: string;
  noValidate?: boolean;
  open?: boolean;
  optimum?: number;
  pattern?: string;
  placeholder?: string;
  playsInline?: boolean;
  poster?: string;
  preload?: string;
  radioGroup?: string;
  readOnly?: boolean;
  rel?: string;
  required?: boolean;
  role?: string;
  rows?: number;
  rowSpan?: number;
  sandbox?: string;
  scope?: string;
  scoped?: boolean;
  scrolling?: string;
  seamless?: boolean;
  selected?: boolean;
  shape?: string;
  size?: number;
  sizes?: string;
  slot?: string;
  span?: number;
  spellcheck?: boolean;
  src?: string;
  srcset?: string;
  srcDoc?: string;
  srcLang?: string;
  srcSet?: string;
  start?: number;
  step?: number | string;
  style?: string | StyleAttributes;
  summary?: string;
  tabIndex?: number;
  target?: string;
  title?: string;
  type?: string;
  useMap?: string;
  value?: string | string[] | number;
  width?: number | string;
  wmode?: string;
  wrap?: string;

  // RDFa Attributes
  about?: string;
  datatype?: string;
  inlist?: boolean;
  prefix?: string;
  property?: string;
  resource?: string;
  typeof?: string;
  vocab?: string;
}