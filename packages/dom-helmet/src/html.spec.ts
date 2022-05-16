import { prepareHelmetTest } from '../utils.test';

test('all attributes should be applied to the root html', () => {
  const el = prepareHelmetTest(`
      <html>
          <head>
              <title>Initial</title>
          </head>
          <body>
              <head><html xmlns="xmlns-value"></html></head>
              <div>
                <head><html class="class-value"></html></head>
              </div>
          </body>
      </html>
      `);

  expect(el.querySelectorAll('html')).toHaveLength(1);
  const html = el.querySelector("html")!;
  expect(html.getAttribute("xmlns")).toBe("xmlns-value");
  expect(html.className).toBe("class-value");
});
