export function evalCodeInActiveTab(code: string, inputJson: object) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    var activeTab = tabs[0];
    var activeTabId = activeTab.id; // or do whatever you need

    const encoded = btoa(code);
    const url = `data:text/javascript;base64,${encoded}`;
    const codeWithWrap = `
      import('${url}')
      .then(module => {
        if (module.default) {
          module.default(${JSON.stringify(inputJson)});
        }
      })
      .catch((err) => {
        alert(err.message)
      });
    `;
    chrome.tabs.executeScript(activeTabId as number, {
      code: codeWithWrap
    });
  });
}
