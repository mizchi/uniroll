import { TemplateDef } from "uniroll-types/variables";

export async function downloadToLocal(dump: TemplateDef) {
  console.log("download", dump);
  const anchor = document.createElement("a");
  const blob = new Blob([JSON.stringify(dump)], { type: "text/plain" });
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${Date.now()}.json`;
  anchor.click();
}

export async function loadFromLocal(): Promise<TemplateDef> {
  const input = document.createElement("input");
  input.type = "file";
  return new Promise((r) => {
    input.onchange = () => {
      // @ts-ignore
      const file = input.files[0] as File;
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          const result = reader.result as string;
          const encoded = result.replace("data:application/json;base64,", "");
          const json = atob(encoded);
          const data = JSON.parse(json);
          r(data);
        },
        false
      );
      reader.readAsDataURL(file);
    };
    input.click();
  });
}
