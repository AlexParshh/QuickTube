chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getTitle"}, function(response) {
        document.getElementsByClassName("currentvideo")[0].innerHTML += response
    });
});