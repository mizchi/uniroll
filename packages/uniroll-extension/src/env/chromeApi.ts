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

export type SavedState = {
  files: { [k: string]: string };
};

const SAVE_KEY = "$current";

export function load(): Promise<SavedState> {
  return new Promise(r => {
    chrome.storage.sync.get([SAVE_KEY], result => {
      const savedState = result.$current;
      if (savedState != null) {
        try {
          const data = JSON.parse(savedState) as SavedState;
          return data;
        } catch (err) {
          throw err;
        }
      }
    });
  });
}

export function save(savedState: SavedState): Promise<void> {
  return new Promise(r => {
    chrome.storage.sync.set(
      {
        [SAVE_KEY]: JSON.stringify(savedState)
      },
      r
    );
  });
}
