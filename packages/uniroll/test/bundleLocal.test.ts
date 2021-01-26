import "isomorphic-unfetch";
import type { ResolveIdFallback } from "rollup-plugin-http-resolve";
import { bundleLocal } from "../src/bundleLocal";
const files = {
  "/index.tsx": `/* @jsx h */
import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
function App () {
  useEffect(() => {
    console.log('xxx');
  }, []);
  return <div>xxx</div>
}
render(<App />, document.body);
`,
};
jest.setTimeout(150000);

test("buildLocal", async () => {
  try {
    const warned: any = [];
    const bundled = await bundleLocal({
      input: "/index.tsx",
      files,
      rollupOptions: {
        onwarn(warnings, defaultHandler) {
          warned.push(warnings);
          defaultHandler(warnings);
        },
      },
    });
    expect(warned).toHaveLength(0);
    const out = await bundled.generate({ format: "es" });
    expect(out.output[0].code).toContain("https://cdn.skypack.dev/preact");
    expect(out.output[0]).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw Error("uniroll build failed");
  }
});
