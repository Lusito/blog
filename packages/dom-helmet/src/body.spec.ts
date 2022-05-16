import { prepareHelmetTest } from '../utils.test';

test('all attributes should be applied to the root body', () => {
  const el = prepareHelmetTest(`
      <html>
          <head>
              <title>Initial</title>
          </head>
          <body>
              <head><body id="id-value"></body></head>
              <div>
                <head><body class="class-value"></body></head>
              </div>
          </body>
      </html>
      `);

  expect(el.querySelectorAll('body')).toHaveLength(1);
  const body = el.querySelector("body")!;
  expect(body.getAttribute("id")).toBe("id-value");
  expect(body.className).toBe("class-value");
});

test('style and class attributes get appended', () => {
  const el = prepareHelmetTest(`
      <html>
          <head>
              <title>Initial</title>
          </head>
          <body style="color: red;" class="class-value-1">
              <head><body style="color: green" class="class-value-2"></body></head>
              <div>
                <head><body style="color: blue;" class="class-value-3"></body></head>
              </div>
          </body>
      </html>
      `);

  expect(el.querySelectorAll('body')).toHaveLength(1);
  const body = el.querySelector("body")!;
  expect(body.className).toBe("class-value-1 class-value-2 class-value-3");
  expect(body.getAttribute("style")).toBe("color: red;color: green;color: blue;");
});
