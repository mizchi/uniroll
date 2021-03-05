import { execSync } from "child_process";
import path from "path";
import fs from "fs";
test("simple", () => {
  execSync(`node ../../../bin/uniroll index.ts -o out`, {
    cwd: path.join(__dirname, "fixtures/simple"),
  });

  const exsited = fs.existsSync(
    path.join(__dirname, "fixtures/simple/out/index.js")
  );

  expect(exsited).toBeTruthy();
});

test("chunks", () => {
  execSync(`node ../../../bin/uniroll index.ts -o out`, {
    cwd: path.join(__dirname, "fixtures/chunks"),
  });

  const paths = fs.readdirSync(path.join(__dirname, "fixtures/chunks/out"));
  expect(paths[0].startsWith("foo-")).toBeTruthy();
  expect(paths[1]).toBe("index.js");
});

test("with-config", () => {
  execSync(`node ../../../bin/uniroll index.ts -o out -t es5`, {
    cwd: path.join(__dirname, "fixtures/with-config"),
  });
  const exsited = fs.existsSync(
    path.join(__dirname, "fixtures/with-config/out/index.js")
  );
  expect(exsited).toBeTruthy();
});
