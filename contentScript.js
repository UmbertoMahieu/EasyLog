// Listen to backgroundPage XHR Hookup to create button and datefield inside page
chrome.runtime.onMessage.addListener(function (msg){
	if(msg.message == "data" && document.getElementsByName("send_email_button").length == 0){
        if(document.querySelector('[data-tooltip="Mark as lost"]') != null){
			addButton();
            addDateField();
        }
        else{
            setTimeout(() => {
                addButton();
                addDateField();
            }, 1000)
        }
    }
});

function addDateField() {
    // Create the input field
    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'o_datepicker_input o_input datetimepicker-input';
    dateInput.setAttribute('autocomplete', 'off');
    dateInput.id = 'date_input';

    // Calculate the date for display (today + 3 days)
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    var formattedDate = currentDate.toISOString().split('T')[0];
    dateInput.value = formattedDate;

    // Get the reference to the button element
    var referenceButton = document.querySelector('button[name="send_email_button"]');

    // Insert the input field after the reference button
    referenceButton.parentNode.insertBefore(dateInput, referenceButton.nextSibling);
}

// Function that create the button and the listener on it
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
async function injectScript(){
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        console.log("scriptinjected")

        const d = document.createElement('div');
        d.style.display = "none";
        d.setAttribute("id", "Dre");
        d.innerText = JSON.stringify(await chrome.storage.local.get(["data"]));
        
        
        s.onload = function() {
            this.remove();
        };
        document.body.appendChild(d);

        (document.head || document.documentElement).appendChild(s);
    }





    
    
