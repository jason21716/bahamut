function checkForValidUrl(tabId, changeInfo, tab) {
	var urls = getDomainFromUrl(tab.url);
	if(urls[0].toLowerCase()=="guild.gamer.com.tw"){
          chrome.pageAction.show(tabId);
	}
};


function receiveMessage(request, sender, sendResponse) {
	if (request.greeting == "nofity"){
		chrome.notifications.create(
			request.rid, 
			{
				type: 'basic',
				iconUrl: 'baha128.png',
				title: '有串更新了！!',
				message: request.text+'(#'+request.num+')'
			},
			function(notificationId) {}
		);
	}
}


function receiveCommend(command) {
	switch(command){
		case 'fastResponce_1':
			sendFastResponse(1);
			break;
		case 'fastResponce_2':
			sendFastResponse(2);
			break;
		case 'fastResponce_3':
			sendFastResponse(3);
			break;
		case 'fastResponce_4':
			sendFastResponse(4);
			break;
	}
	
}

function sendFastResponse(num){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.storage.local.get({fastResponse1:'',fastResponse2:'',fastResponse3:'',fastResponse4:''},function(item){
			var responseText = new Array();
			responseText[1] = item['fastResponse1'];
			responseText[2] = item['fastResponse2'];
			responseText[3] = item['fastResponse3'];
			responseText[4] = item['fastResponse4'];
			chrome.tabs.sendMessage(tabs[0].id, {message: 'fastResponse',text: responseText[num]}, function(response) {
					console.log('message send.');
			});
		});
	});
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.runtime.onMessage.addListener(receiveMessage);
chrome.commands.onCommand.addListener(receiveCommend);