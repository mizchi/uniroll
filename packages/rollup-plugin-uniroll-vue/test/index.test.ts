import { SourceDescription } from "rollup";
import { unirollVue } from "../src/";

test("rollup-plugin-vue parsed style query", async () => {
  const transform = unirollVue().transform as (
    code: string,
    id: string
  ) => Promise<SourceDescription>;
  const id = "/App.vue?vue&type=style&index=0&id=72300062&scoped=true&lang.css";
  const code = `p[data-v-72300062] { color: red; }`;
  const { code: genCode } = await transform(code, id);

  expect(genCode).toMatchSnapshot();
});

test("rollup-plugin-vue not parsed query", async () => {
  const transform = unirollVue().transform as (
    code: string,
    id: string
  ) => Promise<string>;
  const id = "/index.js";
  const code = `export default 1;`;
  const genCode = await transform(code, id);

  expect(genCode).toEqual(`export default 1;`);
});
