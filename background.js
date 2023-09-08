
chrome.webRequest.onCompleted.addListener(
	function(details) {
		if(details.url == "https://www.odoo.com/mail/thread/data"){
		console.log('Request details:', details);
		chrome.tabs.query({
			active:true,
			currentWindow:true
			}, function (tabs){
					chrome.tabs.sendMessage(tabs[0].id, {message: "data"})
				});
		}

	},
	{ urls: ['https://www.odoo.com/*'],
		types: ["xmlhttprequest"] 
	},
	['responseHeaders']
);

chrome.runtime.onMessage.addListener(data => {
	const {event, activities} = data;
	activity_obj = {};
	Object.assign(activity_obj, activities)
	chrome.storage.local.set({"data" : activity_obj});
	chrome.tabs.reload();
})

