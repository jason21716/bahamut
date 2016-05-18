function checkForValidUrl(tabId, changeInfo, tab) {
	var urls = getDomainFromUrl(tab.url);
	if(urls[0].toLowerCase()=="guild.gamer.com.tw"){
          chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);