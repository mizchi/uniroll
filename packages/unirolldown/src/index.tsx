export { parse } from "./parser";
export { compile } from "./compiler";

export function run({ target }: { target: HTMLElement }) {
  Array.from(target.querySelectorAll(".js-unirolldown-iframe")).forEach(
    (dom) => {
      runInIframe(dom as HTMLIFrameElement);
    }
  );
}

export function init({
  target,
  autoRun = false,
}: {
  target: HTMLElement;
  autoRun?: boolean;
}) {
  target.addEventListener("click", (ev) => {
    const clickTarget = ev.target as HTMLElement;
    if (clickTarget.classList.contains("js-unirolldown-run-button")) {
      const iframe = document.querySelector(
        `iframe[data-id="${clickTarget.dataset.id}"]`
      ) as HTMLIFrameElement;
      if (iframe) runInIframe(iframe);
    }
  });

  if (autoRun) {
    run({ target });
  }
}

function runInIframe(iframe: HTMLIFrameElement) {
  if (iframe.dataset.env === "@dom") {
    runAsDom(iframe);
  } else if (iframe.dataset.env === "@console") {
    runAsConsole(iframe);
  }
}

function runAsDom(iframe: HTMLIFrameElement) {
  const encoded = iframe.dataset.encoded;
  const blob = new Blob(
    [
      `<!DOCTYPE html>
<html>
<head>
</head>
<body>
<script type=module>import("data:text/javascript;base64,${encoded}");</script>
</body>
</html>`,
    ],
    { type: "text/html" }
  );

  iframe.src = URL.createObjectURL(blob);
}

function runAsConsole(iframe: HTMLIFrameElement) {
  const encoded = iframe.dataset.encoded;
  const blob = new Blob(
    [
      `<!DOCTYPE html>
<html>
<head>
<style>
html,body {margin: 0; background: #222; color: white;}
</style>
</head>
<body>
<ul id="terminal"></ul>
<script type=module>
const mes = (color, ...args) => {
  const el = document.createElement("li");
  el.textContent = args.map(a=>JSON.stringify(a)).join(" ");
  el.style.color = color;
  terminal.appendChild(el);
}

console.log = (...args) => mes("rgb(90,255,90)", ...args);
console.warn = (...args) => mes("rgb(255,255,0)", ...args);
console.error = (...args) => mes("rgb(255,90,90)", ...args);


import("data:text/javascript;base64,${encoded}");
</script>
</body>
</html>`,
    ],
    { type: "text/html" }
  );

  iframe.src = URL.createObjectURL(blob);
}
