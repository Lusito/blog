import fs from "fs";
import path from "path";

export function getAllFiles(dirPath: string, pattern: RegExp, arrayOfFiles: string[]) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, pattern, arrayOfFiles);
        } else if (pattern.test(filePath)) {
            arrayOfFiles.push(filePath);
        }
    }

    return arrayOfFiles;
}
