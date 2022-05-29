module.exports = {
    displayName: "tsx-dom-ssg-demo",
    preset: "../../jest.preset.ts",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.spec.json",
        },
    },
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/tsx-dom-ssg-demo",
};
