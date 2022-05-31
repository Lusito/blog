import fs from "fs";
import path from "path";
import frontMatter from "front-matter";

function getAllFiles(dirPath: string, pattern: RegExp, arrayOfFiles: string[]) {
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

// fixme: use library
const slugify = (s: string) => s.replace(/[^a-z0-9]+/g, "-");

type FrontMatter = {
    tags: string[];
    title: string;
    description: string;
    timestamp: number;
    slug?: string;
};

export type PageInfoMd = Required<FrontMatter> & { type: "md"; body: string };
export type PageInfoTsx = Required<FrontMatter> & { type: "tsx"; path: string };
export type PageInfo = PageInfoMd | PageInfoTsx;

export async function getPages(): Promise<PageInfo[]> {
    const rootPath = path.join("packages", "tsx-dom-ssg-demo", "src", "pages");
    const pages = getAllFiles(rootPath, /\.page\.(md|tsx)$/, []);

    return Promise.all(
        pages.map(async (file) => {
            if (file.endsWith(".md")) {
                const data = await fs.promises.readFile(file, "utf-8");
                const fm = frontMatter(data);
                const page = fm.attributes as FrontMatter;
                return {
                    type: "md",
                    tags: page.tags,
                    title: page.title,
                    description: page.description,
                    timestamp: page.timestamp,
                    slug: page.slug ?? slugify(page.title),
                    body: fm.body,
                };
            }

            const relativePath = path.relative(rootPath, file).replace(/\.page\.tsx$/, "");
            const page: FrontMatter = await import(`../pages/${relativePath}.page`);
            return {
                type: "tsx",
                tags: page.tags,
                title: page.title,
                description: page.description,
                timestamp: page.timestamp,
                slug: page.slug ?? slugify(page.title),
                path: relativePath,
            };
        })
    );
}
