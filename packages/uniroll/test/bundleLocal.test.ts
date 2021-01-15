import "isomorphic-unfetch";
import { bundleLocal } from "../src/bundleLocal";
const files = {
  "/index.tsx": `/* @jsx h */
import { h, render } from 'preact';
render(<h1>hello</h1>, document.body);
`,
};
jest.setTimeout(150000);

test("build", async () => {
  try {
    const warned: any = [];
    const bundled = await bundleLocal({
      input: "/index.tsx",
      files,
      rewriteCdnPrefix: "https://esm.sh/",
      rollupOptions: {
        onwarn(warnings, defaultHandler) {
          warned.push(warnings);
          defaultHandler(warnings);
        },
      },
    });
    expect(warned).toHaveLength(0);
    const out = await bundled.generate({ format: "es" });
    expect(out.output[0].code).toContain("https://esm.sh/preact");
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw Error("uniroll build failed");
  }
});
