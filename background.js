var signed_in = false;
var userToken;



//listening to page url change/video navigation
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (changeInfo.url.includes("https://www.youtube.com/watch?v=")) {
      chrome.tabs.sendMessage(tabId, { type: "updateTranscript" });
    }
  }
});

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
    if (request.message === "login") {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            console.log(token);
            userToken = token
            chrome.browserAction.setPopup({popup:"popup.html"}, function() {
                user_signed_in = true;
            })
          });
        sendResponse({message:"close"});
    }

})