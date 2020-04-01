import "jsoneditor/dist/jsoneditor.min.css";
import jsoneditor from "jsoneditor";

import React, { useState } from "react";
import { useEffect } from "react";

export default function JSONEditor(props: {
  value: object;
  onUpdate: (json: any) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<jsoneditor | null>(null);
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (ref.current && !editor) {
      const editor = new jsoneditor(ref.current, {
        theme: "dark",
        onChangeJSON(json) {
          setValue(json);
          props.onUpdate(json);
        }
      });
      setEditor(editor);
      editor.set(props.value);
    }
    if (editor) {
      editor.set(props.value);
    }
  });
  return <div style={{ width: "100%", height: "100%" }} ref={ref}></div>;
}
