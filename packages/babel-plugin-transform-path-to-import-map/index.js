module.exports = function transformWithImportMap(
  importMap /*: {
  imports: {
    [libraryName: string]: string | void;
  }; 
} */
) {
  return (_options) => {
    return {
      visitor: {
        CallExpression(path_) {
          if (path_.node.callee.name === "require") {
            const target = path_.node.arguments[0].value;
            const newPath = importMap.imports[target];
            if (newPath) {
              path_.node.arguments[0].value = newPath;
            }
          }
        },
        ImportDeclaration(path_) {
          const target = path_.node.source.value;
          const newPath =
            importMap && importMap.imports && importMap.imports[target];
          if (newPath) {
            path_.node.source.value = newPath;
          }
        },
      },
    };
  };
};
