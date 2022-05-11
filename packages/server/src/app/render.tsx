import { h, toDom } from 'tsx-ssr';
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document as unknown as Document;

const LazyImage = ({ src }: { src: string }) => {
  return <img class="todo" is="lazy-image" data-src={src} />;
};

export async function renderExample() {
  const lazy = <LazyImage src="hello.png" />;

  const dom = await toDom(document, lazy, {});
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  const html = wrapper.innerHTML;
  console.log({ html });
}
