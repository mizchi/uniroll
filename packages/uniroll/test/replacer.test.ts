import "isomorphic-unfetch";
import assert from "assert";
import { bundle } from "../src/bundle";

test("replace", async () => {
  const files = {
    "/foo.tsx": "export default 'foo'",
    "/bar.tsx": "export default 'bar'",
    "/index.tsx": `
import Foo from "./foo";
import Bar from "./bar";

declare const props: {
  useFoo: boolean;
};

let x;
if (props.useFoo) {
  x = Foo;
} else {
  x = Bar;
}

console.log(x);
console.log(props.selector);
  `,
  };
  try {
    const bundled = await bundle({
      define: {
        "props.selector": JSON.stringify(".selector"),
        "props.useFoo": JSON.stringify(false),
      },
      files,
      input: "/index.tsx",
      rollupOptions: {
        onwarn: (message) => {
          console.log("onwarn", message);
        },
      },
      // cssPostprocess: (t) => t,
    });
    const out = await bundled.generate({ format: "es" });

    const code = out.output[0].code;

    // dose not include foo by DCE
    expect(code).not.toContain("foo");
    expect(code).toContain("bar");

    expect(code).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

test("replace object", async () => {
  const files = {
    "/index.tsx": `
declare const props: {
  obj: {
    foo: 1,
    bar: 2
  };
};

console.log(props.obj.foo);
  `,
  };
  try {
    const bundled = await bundle({
      define: {
        "props.obj": JSON.stringify({ foo: 1, bar: 2 }),
      },
      files,
      input: "/index.tsx",
    });
    const out = await bundled.generate({ format: "es" });
    const code = out.output[0].code;
    // console.log(code);
    assert.ok(!code.includes("obj.foo"));
    // expect {...}.foo
    assert.ok(code.includes("}.foo"));

    expect(code).toMatchSnapshot();
  } catch (err) {
    console.log(err);
    throw err;
  }
});
