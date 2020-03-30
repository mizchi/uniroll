import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";

try {
  ReactDOM.render(<App />, document.querySelector("#root"));
} catch (err) {
  document.body.textContent = err.message;
  console.error(err);
}
