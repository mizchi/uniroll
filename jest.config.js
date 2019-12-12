module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json"
    }
  },
  testMatch: ["**/__tests__/*.test.+(ts|tsx|js)"]
  // roots: ["<rootDir>/"],
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest"
  // },
  // testRegex: "(/__tests__/.*tsx?$",
  // moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
