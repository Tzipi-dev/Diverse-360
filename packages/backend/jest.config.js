const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules.bak",      // 💥 מדלג על הקונפליקט
    "<rootDir>/dist",
    "<rootDir>/build",
    "<rootDir>/coverage",
  ],
  testMatch: ["**/tests/**/*.test.ts"], // ✅ ספציפי לקבצי טסט
  roots: ["<rootDir>/src"],             // ✅ מצמצם את הסריקה
};
