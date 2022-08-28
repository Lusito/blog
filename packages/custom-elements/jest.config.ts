/* eslint-disable */
export default {
    displayName: "custom-elements",
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
    transform: {
        "^.+\\.[tj]s$": "babel-jest",
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/custom-elements",
};
