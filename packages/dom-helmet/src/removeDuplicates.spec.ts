/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prepareDom } from "../testUtils";
import { removeDuplicatesBySelector, removeDuplicatesBySelectorAndAttribute } from "./removeDuplicates";

test("removeDuplicatesBySelector removes elements if they exist in the false head", () => {
    const el = prepareDom(`
      <html>
        <head><title>hello</title></head>
        <body>
            <head>
                <title>Overwrite</title>
            </head>
        </body>
      </html>
      `);
    const head = el.querySelector("html > head")!;
    const falseHead = el.querySelector("body > head")!;
    removeDuplicatesBySelector(head, falseHead, "title");

    expect(head.querySelector("title")).toBeFalsy();
    expect(falseHead.querySelector("title")).toBeTruthy();
});

test("removeDuplicatesBySelector does not removes elements if they do not exist in the false head", () => {
    const el = prepareDom(`
      <html>
        <head><title>hello</title></head>
        <body>
            <head></head>
        </body>
      </html>
      `);
    const head = el.querySelector("html > head")!;
    const falseHead = el.querySelector("body > head")!;
    removeDuplicatesBySelector(head, falseHead, "title");

    expect(head.querySelector("title")).toBeTruthy();
});

test("removeDuplicatesBySelectorAndAttribute removes elements if they exist in the false head with the same attribute value", () => {
    const el = prepareDom(`
      <html>
        <head><meta name="description" content="Initial"></head>
        <body>
            <head>
              <meta name="description" content="Override">
            </head>
        </body>
      </html>
      `);
    const head = el.querySelector("html > head")!;
    const falseHead = el.querySelector("body > head")!;
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "meta", "name");

    expect(head.querySelector("meta")).toBeFalsy();
    expect(falseHead.querySelector("meta")).toBeTruthy();
});

test("removeDuplicatesBySelectorAndAttribute does not remove elements if they do not exist in the false head", () => {
    const el = prepareDom(`
      <html>
        <head><meta name="description" content="Initial"></head>
        <body>
            <head></head>
        </body>
      </html>
      `);
    const head = el.querySelector("html > head")!;
    const falseHead = el.querySelector("body > head")!;
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "meta", "name");

    expect(head.querySelector("meta")).toBeTruthy();
});

test("removeDuplicatesBySelectorAndAttribute does not remove elements if they exist in the false head with a different attribute value", () => {
    const el = prepareDom(`
      <html>
        <head><meta name="description" content="Initial"></head>
        <body>
            <head>
              <meta name="keywords" content="Override">
            </head>
        </body>
      </html>
      `);
    const head = el.querySelector("html > head")!;
    const falseHead = el.querySelector("body > head")!;
    removeDuplicatesBySelectorAndAttribute(head, falseHead, "meta", "name");

    expect(head.querySelector("meta")).toBeTruthy();
});
