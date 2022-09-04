import fs from "fs";

export function getCustomElementsFile() {
    const filePath = "./dist/packages/custom-elements/main.esm.js";
    return fs.existsSync(filePath) ? filePath : filePath.replace(/\.esm\.js$/, ".js");
}
