import { h, toDom } from 'tsx-ssr';
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document as unknown as Document;

export async function renderExample() {
  const Draggable = () => {
    return <img class="todo" is="lazy-image" data-src="hello.png" />;
  };

  const draggable = <Draggable />;

  const dom = await toDom(document, draggable, {});
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  const html = wrapper.innerHTML;
  console.log({ html });
}
