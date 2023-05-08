window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("inject-script").addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "injectScript"});
    });
  });

  document.getElementById("test-script").addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "testingfct"});
    });
  });
});

