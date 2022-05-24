import { prepareDom, document } from "../testUtils";
import { transferAttributes } from "./transferAttributes";

describe("transferAttributes", () => {
    it("transfers all attributes to the original", () => {
        const body = document.createElement("body");
        const el = prepareDom(`
        <div>
            <body id="id-value"></body>
            <body class="class-value"></body>
        </div>
        `);
        transferAttributes(body, el.querySelectorAll("body"));

        expect(el.querySelectorAll("body")).toHaveLength(0);
        expect(body.getAttribute("id")).toBe("id-value");
        expect(body.className).toBe("class-value");
    });

    it("appends all style and class attributes", () => {
        const body = document.createElement("body");
        body.className = "class-value-1";
        body.setAttribute("style", "color: red;");
        const el = prepareDom(`
        <div>
          <body style="color: green" class="class-value-2"></body>
          <body style="color: blue;" class="class-value-3"></body>
        </div>
        `);
        transferAttributes(body, el.querySelectorAll("body"));

        expect(el.querySelectorAll("body")).toHaveLength(0);
        expect(body.className).toBe("class-value-1 class-value-2 class-value-3");
        expect(body.getAttribute("style")).toBe("color: red;color: green;color: blue;");
    });

    it("removes all fake elements after completion", () => {
        const el = prepareDom(`
        <html>
            <head>
                <title>Initial</title>
            </head>
            <body>
                <body></body>
                <body></body>
                <body></body>
            </body>
        </html>
        `);

        const body = document.createElement("body");
        transferAttributes(body, el.querySelectorAll("body > body"));

        expect(el.querySelectorAll("body > body")).toHaveLength(0);
    });
});
