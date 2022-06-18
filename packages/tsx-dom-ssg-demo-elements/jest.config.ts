/* eslint-disable */
export default {
    displayName: "tsx-dom-ssg-demo-elements",
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
    transform: {
        "^.+\\.[tj]s$": "babel-jest",
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/tsx-dom-ssg-demo-elements",
};
