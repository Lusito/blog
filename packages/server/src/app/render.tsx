import { h, toDom } from 'tsx-ssr';
import { Window } from 'happy-dom';
import { LazyImage } from '../components/LazyImage/LazyImage';
import { SomeNumber } from '../SomeNumber';

const window = new Window();
const document = window.document as unknown as Document;

export async function renderExample() {
  const lazy = (
    <SomeNumber.Provider value={20}>
      <LazyImage src="hello.png" />
    </SomeNumber.Provider>
  );

  const dom = await toDom(document, lazy, {});
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  const html = wrapper.innerHTML;
  console.log({ html });
}
