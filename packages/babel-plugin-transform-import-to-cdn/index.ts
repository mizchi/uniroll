export function transformImportPathToCdn(versions: { [k: string]: string }) {
  return (_options: any) => {
    return {
      visitor: {
        CallExpression(path: any) {
          if (path.node.callee.name === "require") {
            const target = path.node.arguments[0].value;
            if (!target.startsWith(".") && !target.startsWith("/")) {
              const v = versions[target];
              const newTarget = v
                ? `https://cdn.pika.dev/${target}/${v}`
                : `https://cdn.pika.dev/${target}`;
              path.node.arguments[0].value = newTarget;
            }
          }
        },
        ImportDeclaration(path: any) {
          const target = path.node.source.value;
          if (!target.startsWith(".") && !target.startsWith("/")) {
            const v = versions[target];
            const newTarget = v
              ? `https://cdn.pika.dev/${target}/${v}`
              : `https://cdn.pika.dev/${target}`;
            path.node.source.value = newTarget;
          }
        }
      }
    };
  };
}
