//listening to page url change/video navigation
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (changeInfo.url.includes("https://www.youtube.com/watch?v=")) {
      chrome.tabs.sendMessage(tabId, { type: "updateTranscript" });
    }
  }
});
