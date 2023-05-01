window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("run-script").addEventListener("click", function() {
    console.log("click")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("click")
      chrome.tabs.sendMessage(tabs[0].id, {action: "executeFunction"});
    });
  });
});

