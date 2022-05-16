import { prepareDom, prepareHelmetTest, document } from '../utils.test';
import { transferAttributes } from './transferAttributes';

test('all attributes should be applied to the original', () => {
  const body = document.createElement("body");
  const el = prepareDom(`
      <div>
          <body id="id-value"></body>
          <div>
            <body class="class-value"></body>
          </div>
      </div>
      `);
      transferAttributes(body, el.querySelectorAll("body"));

  expect(el.querySelectorAll('body')).toHaveLength(0);
  expect(body.getAttribute("id")).toBe("id-value");
  expect(body.className).toBe("class-value");
});

test('style and class attributes get appended', () => {
  const body = document.createElement("body");
  body.className = "class-value-1";
  body.setAttribute("style", "color: red;");
  const el = prepareDom(`
      <div>
        <body style="color: green" class="class-value-2"></body>
        <div>
          <body style="color: blue;" class="class-value-3"></body>
        </div>
      </div>
      `);
  transferAttributes(body, el.querySelectorAll("body"));

  expect(el.querySelectorAll('body')).toHaveLength(0);
  expect(body.className).toBe("class-value-1 class-value-2 class-value-3");
  expect(body.getAttribute("style")).toBe("color: red;color: green;color: blue;");
});
