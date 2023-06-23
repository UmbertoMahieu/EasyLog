
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


	console.log("background test")
