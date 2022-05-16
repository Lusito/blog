/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Window } from 'happy-dom';
import { domHelmet } from './src';

const window = new Window();
export const document = window.document as unknown as Document;

export function prepareHelmetTest(html: string) {
  const element = document.createElement('div');
  element.innerHTML = html;
  domHelmet({
    html: element.querySelector('html')!,
    head: element.querySelector('head')!,
    body: element.querySelector('body')!,
  });

  return element;
}

export function prepareDom(html: string) {
  const element = document.createElement('div');
  element.innerHTML = html;

  return element;
}
