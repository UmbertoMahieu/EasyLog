console.log("content loaded");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "executeFunction") {

        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        s.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);

        console.log("scriptinjected")
    }
});

  


    
    