/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Window } from 'happy-dom';
import { domHelmet } from './src';

const window = new Window();
const document = window.document as unknown as Document;

export function prepareHelmetTest(html: string) {
  const element = document.createElement('');
  element.innerHTML = html;
  domHelmet({
    html: element.querySelector('html')!,
    head: element.querySelector('head')!,
    body: element.querySelector('body')!,
  });

  return element;
}
