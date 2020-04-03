import terser from "terser";

export async function optimize(js: string): Promise<string> {
  return terser.minify(js, { module: true }).code as string;
}

// How to use
// function main() {
//   const code = optimize(`const a = 1 + 1;\nexport default a`);
//   console.log(code);
// }

// main();
