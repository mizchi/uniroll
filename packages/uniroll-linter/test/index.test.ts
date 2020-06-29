// Example
import { lint } from "../src/index";

test("run", () => {
  const code = `
  export default () => {
    const foo = someFunction();
    const bar = a + 1;
    console.log("Xxx");
  };
  `;

  const messages = lint(code);
  console.log(messages);
});
