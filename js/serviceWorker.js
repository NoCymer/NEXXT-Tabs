chrome.action.onClicked.addListener(function(activeTab) {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
});