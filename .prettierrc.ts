import { type Config } from "prettier";
import cfg from "@lusito/prettier-config";

const config: Config = {
    ...(cfg as Config),
    overrides: [
        ...cfg.overrides,
        {
            files: ["*.md"],
            options: {
                printWidth: 62,
            },
        },
    ],
};

export default config;
