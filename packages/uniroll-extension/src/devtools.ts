chrome.devtools.panels.create(
  "Uniroll",
  "", // icon url
  "./panel.html",
  panel => {
    console.log("created", panel);
  }
);
