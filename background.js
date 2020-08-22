//listening to page url change/video navigation
chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
    
      if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {type:"updateTranscript"})
  
      }
    }
  );