var signed_in = false;
var userToken;
var userInfo;

//listening to page url change/video navigation
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (changeInfo.url.includes("https://www.youtube.com/watch?v=")) {
      chrome.tabs.sendMessage(tabId, { type: "updateTranscript" });
    }
  }
});

setName = async() => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == XMLHttpRequest.DONE) {
        let info = JSON.parse(xhttp.responseText);
        userInfo = info;
      }
    }
  
    let link = "https://www.googleapis.com/oauth2/v1/userinfo?access_token="+userToken;
  
    await xhttp.open("GET", link);
    xhttp.send(null);
  }

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
    if (request.message === "login") {
        chrome.identity.getAuthToken({interactive: true}, function(token) {

            if (Boolean(token)) {
                userToken = token;
                console.log(token);
                chrome.browserAction.setPopup({popup:"popup.html"}, function() {
                    user_signed_in = true;
                })
                setName()
            }
          });
        sendResponse({message:"close"});
    }

    if (request.message === "getName") {
        sendResponse({info: userInfo});
    }

})