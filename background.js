chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
      file: "macro.js"
    });
  });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
if (message.runScript) {
    chrome.tabs.executeScript({
    file: "macro.js"
    });
}
});