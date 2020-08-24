//when popup loads it sends message to content script to fetch video title
chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
  if (tabs[0].url.includes("https://www.youtube.com/watch?v=")) {
    chrome.tabs.sendMessage(tabs[0].id, {type:"getTitle"}, function (response) {
      document.getElementsByClassName("currentvideo")[0].innerHTML += response.title;

      if (response.transcript === false) {
        //removing functionality if transcript doesnt exist
        document.getElementById("sentences").remove();
        document.getElementById("summarize").remove();
        document.getElementById("sentenceValue").remove();

        //displaying error message
        document.getElementById("sentenceAmount").innerHTML = "TRANSCRIPT UNAVAILABLE"
    }

    })
  } else {
    document.getElementById("main").innerHTML = "<h1>QuickTube</h1>" + "<h3>Please Navigate to a Youtube Video</h3>"
  }
})


var slider = document.getElementById("sentences")

slider.onchange = function(event){
    var output = document.getElementById("sentenceValue")

    if (slider.value >= 10 && slider.value < 15) {
      output.innerHTML = "Less Text";
    } else {
      output.innerHTML = "More Text";
    } 

}

sendInfo = async (data) => {
    result = await axios.post("http://localhost:5000/summarize",data).then(response=>{
        console.log(response);
        let result = response.data.summary;
        document.getElementById("summarizedText").innerHTML = result;

        chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {type:"getSummary", summary:result})
        })

    })
}

function reverser(n) {
  if (n < 15) {
    return ((15-n) + 15)
  } else if (n > 15) {
    return (15 - (n-15))
  } else {
    return 15
  }
} 

//fetches video url to send to backend for NLP summarization
document.getElementById("summarize").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let sentences = parseInt(slider.value);
    sentences = reverser(sentences)

    console.log({url:tabs[0].url,sentences:sentences});
    let info = {url:tabs[0].url,sentences:sentences};
    sendInfo(info)


  });
});
