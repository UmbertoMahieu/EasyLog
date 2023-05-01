chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        chrome.tabs.sendMessage(tabId, {
            type: "NEW"
        })
        console.log("test")
    }
});