import { prepareHelmetTest } from '../utils.test';

test('all heads should be removed after completion', () => {
  const el = prepareHelmetTest(`
      <html>
          <head>
              <title>Initial</title>
          </head>
          <body>
              <head></head>
              <div>
                <head></head>
              </div>
          </body>
      </html>
      `);

  expect(el.querySelectorAll('head')).toHaveLength(1);
});
