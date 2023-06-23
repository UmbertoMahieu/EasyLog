console.log("content loaded");

function addButton() {

    const parentDiv = document.querySelector('.o_statusbar_buttons');

    const sendEmailButton = document.createElement('button');
    sendEmailButton.setAttribute('class', 'btn btn-secondary');
    sendEmailButton.setAttribute('name', 'send_email_button');
    sendEmailButton.setAttribute('type', 'object');	
    sendEmailButton.setAttribute('data-tooltip', 'Send Email');
    sendEmailButton.innerHTML = '<span>Send Email & Log Acti</span>';

    const lostButton = document.querySelector('.o_statusbar_buttons button[name="2502"]');

    parentDiv.insertBefore(sendEmailButton, lostButton.nextSibling);
    
    sendEmailButton.addEventListener('click', function() {
		injectScript();
	});
}

// Function to inject the script
function injectScript(){
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        console.log("scriptinjected")

        s.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    }

chrome.runtime.onMessage.addListener(function (msg){
	if(msg.message == "data" && document.getElementsByName("send_email_button").length == 0){
			addButton();
			console.log(msg);
		}
	});







    
    
