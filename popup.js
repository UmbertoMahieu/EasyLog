document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("run-script").addEventListener("click", function() {
    chrome.runtime.sendMessage({runScript: true});
  });
});