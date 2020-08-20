//when popup loads it sends message to content script to fetch video title
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: "getTitle" }, function (
    response
  ) {
    document.getElementsByClassName("currentvideo")[0].innerHTML += response;
  });
});


var slider = document.getElementById("sentences")

slider.onchange = function(event){
    var output = document.getElementById("sentenceValue")
    output.innerHTML = slider.value;
}

sendInfo = async (data) => {
    result = await axios.post("http://localhost:5000/summarize",data).then(response=>{
        console.log(response);
    })
}

//fetches video url to send to backend for NLP summarization
document.getElementById("summarize").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let sentences = slider.value;
    console.log({url:tabs[0].url,sentences:sentences});
    let info = {url:tabs[0].url,sentences:sentences};
    sendInfo(info)


  });
});
