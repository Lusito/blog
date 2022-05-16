import { prepareHelmetTest } from '../utils.test';

test('base be inserted from the body if none in the head exists', () => {
  const el = prepareHelmetTest(`
      <html>
          <head></head>
          <body>
              <head>
                  <base href="https://www.w3schools.com" target="_blank">
              </head>
          </body>
      </html>
      `);

  const base = el.querySelector('html > head > base') as HTMLBaseElement;
  expect(base).toBeTruthy();
  expect(base.href).toBe('https://www.w3schools.com');
});

test('base should be replaced with the one in body', () => {
  const el = prepareHelmetTest(`
    <html>
        <head>
          <base href="https://www.w3schools.com" target="_blank">
        </head>
        <body>
            <head>
                <base href="https://www.w3schools.com/overwrite">
            </head>
        </body>
    </html>
    `);

  const base = el.querySelector('html > head > base') as HTMLBaseElement;
  expect(base).toBeTruthy();
  expect(base.href).toBe('https://www.w3schools.com/overwrite');
  expect(base.target).toBeFalsy();
});

test('title should be replaced with the last one in body', () => {
  const el = prepareHelmetTest(`
      <html>
          <head>
            <base href="https://www.w3schools.com" target="_blank">
          </head>
          <body>
              <head>
                  <base href="https://www.w3schools.com/overwrite-2" target="_self">
              </head>
          </body>
      </html>
      `);

  const base = el.querySelector('html > head > base') as HTMLBaseElement;
  expect(base).toBeTruthy();
  expect(base.href).toBe('https://www.w3schools.com/overwrite-2');
  expect(base.target).toBe("_self");
});
