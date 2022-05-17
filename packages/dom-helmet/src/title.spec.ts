import { prepareHelmetTest } from "../testUtils";

test("title be inserted from the body if none in the head exists", () => {
    const el = prepareHelmetTest(`
      <html>
          <head></head>
          <body>
              <head>
                  <title>Overwrite</title>
              </head>
          </body>
      </html>
      `);

    expect(el.querySelector("html > head > title")?.textContent).toBe("Overwrite");
});

test("title should be replaced with the one in body", () => {
    const el = prepareHelmetTest(`
    <html>
        <head>
            <title>Initial</title>
        </head>
        <body>
            <head>
                <title>Overwrite</title>
            </head>
        </body>
    </html>
    `);

    expect(el.querySelector("html > head > title")?.textContent).toBe("Overwrite");
});

test("title should be replaced with the last one in body", () => {
    const el = prepareHelmetTest(`
      <html>
          <head>
              <title>Initial</title>
          </head>
          <body>
              <head>
                  <title>Overwrite</title>
              </head>
              <div>
                <head>
                    <title>Overwrite 2</title>
                </head>
              </div>
          </body>
      </html>
      `);

    expect(el.querySelector("html > head > title")?.textContent).toBe("Overwrite 2");
});
