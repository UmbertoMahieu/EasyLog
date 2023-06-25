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



if (document.readyState !== 'loading') {
    setTimeout(function(){
        console.log("test")
        // Create the "Call" button element
        const callButton = document.createElement("button");
        callButton.id = "callButton";
        callButton.classList.add("btn", "btn-secondary");
        callButton.setAttribute("data-tooltip", "Call");
        callButton.title = "";
        callButton.innerHTML = "<span>Call</span>";
        
        // Function to be executed when the "Call" button is clicked
        function callButtonClick() {
            // Your code here
            console.log("Call button clicked");
        }
        
        // Attaching an event listener to the "Call" button
        callButton.addEventListener("click", callButtonClick);
        
        // Find the status bar container
        const statusBar = document.querySelector(".o_statusbar_buttons");
        
        // Insert the "Call" button at the end of the status bar
        statusBar.appendChild(callButton);
    }, 2000)
    
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        // myInitCode();
    });
}