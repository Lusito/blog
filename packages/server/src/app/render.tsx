import { ErrorBoundary, toDom } from 'tsx-ssr';
import { Window } from 'happy-dom';
import { LazyImage } from '../components/LazyImage/LazyImage';
import { SomeNumber } from '../SomeNumber';
import { Todos } from './todos';
import { CustomError } from '../CustomError';

const window = new Window();
const document = window.document as unknown as Document;

export async function renderExample() {
  const lazy = (
    <html>
      <head>
        <title>Woot</title>
      </head>
      <body>
        <SomeNumber.Provider value={20}>
          <LazyImage src="hello.png" />
          <ErrorBoundary
            render={() => (
              <ErrorBoundary
                render={() => <Todos />}
                fallback={({ error }) => <h2>Error 1: {String(error)}</h2>}
                accept={(error) => !(error instanceof CustomError)}
              />
            )}
            fallback={({ error }) => <h2>Error 2: {String(error)}</h2>}
          />
        </SomeNumber.Provider>
      </body>
    </html>
  );

  const dom = await toDom(document, lazy, {});
  const wrapper = document.createElement('div');
  wrapper.appendChild(dom);
  const head = wrapper.querySelector('head');
  wrapper.querySelectorAll('html > body style').forEach((el) => {
    head.appendChild(el);
  });
  return `<!DOCTYPE html>${wrapper.innerHTML}`;
}
