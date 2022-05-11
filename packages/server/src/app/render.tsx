import { h, toDom } from 'tsx-ssr';

export async function renderExample() {
  const Draggable = () => {
    return <img class="todo" is="lazy-image" data-src="hello.png" />;
  };

  const draggable = <Draggable />;

  const dom = await toDom(draggable, {});
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  const html = wrapper.innerHTML;
  console.log({ html });
}
