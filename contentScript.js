console.log("content loaded");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "injectScript") {

        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        console.log("scriptinjected")

        s.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    }
    else if (request.action == "testingfct") {
        document.querySelector(".o_ChatterTopbar_button").click()
    }
});

  


    
    