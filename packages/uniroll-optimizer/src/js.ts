import terser from "terser";

export function optimize(js: string) {
  return terser.minify(js, { module: true }).code;
}

function main() {
  const code = optimize(`const a = 1 + 1;\nexport default a`);
  console.log(code);
}

main();
