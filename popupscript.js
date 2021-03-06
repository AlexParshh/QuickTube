//when popup loads it sends message to content script to fetch video title
var url;

//get and sets user name via oauth from backend
function setName() {
  chrome.runtime.sendMessage({message:"getName"}, function(response) {
    let name = response.info.given_name;
    document.getElementById("welcome").innerHTML += (", "+name+"!");
  })
}

setName();


//checks internal chrome storage if current video has already been summarized
function checkForSummary(){
  let k = url.split("=")[1].slice(0,11);
  chrome.storage.local.get([k], function(result){
    if (result[k]) {
      document.getElementById("summarizedText").innerHTML = result[k]
      document.getElementById("summaryTag").style.display = "block"
    } 
  })
}


//gets title of youtube video
chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
  if (tabs[0].url.includes("https://www.youtube.com/watch?v=")) {
    chrome.tabs.sendMessage(tabs[0].id, {type:"getTitle"}, function (response) {
      document.getElementById("currentVideo").innerHTML += response.title;
      url = response.url;
      checkForSummary();

      if (response.transcript === false) {
        //removing functionality if transcript doesnt exist
        document.getElementById("sentences").remove();
        document.getElementById("summarize").remove();
        document.getElementById("sentenceValue").remove();

        //displaying error message
        document.getElementById("sentenceAmount").innerHTML = "TRANSCRIPT UNAVAILABLE";
        document.getElementById("sentenceAmount").style = "background-color:lightgray;color:red;margin-top:10px";

    } 

    })
  } else {
    document.getElementById("main").innerHTML = `<div style="background:rgb(173,173,173);margin-bottom: 10px;">
    <img src = "/headerLogo.png" width="200px" height="70px" alt = "QuickTube" >
    </div>` + "<h3 style='background-color:lightgray;color:red;margin-top:10px'>Please Navigate to a Youtube Video</h3>"
  }
})

//hides summarize button to prevent spam clicking during request processing
axios.interceptors.request.use(function(config){
  let btn = document.getElementById("summarize");
  let load = document.getElementById("loadingImg");
  let para = document.getElementById("summarizedText");

  document.getElementById("summaryTag").style.display = "none"

  btn.style.display = "none"
  para.style.display = "none"
  load.style.display = "block"
  load.style.margin = "auto"

  return config
}, function(error) {
  return Promise.reject(error);
})

axios.interceptors.response.use(function(response) {
  let btn = document.getElementById("summarize");
  let load = document.getElementById("loadingImg");
  let para = document.getElementById("summarizedText");
  
  document.getElementById("summaryTag").style.display = "block"

  btn.style.display = ""
  para.style.display = "block"
  btn.style.margin = "auto"
  load.style.display = "none"
  btn.style.marginBottom = "10px"
  return response
}, function(error) {
  return Promise.reject(error);
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

function storeSummary(summary) {
  let urlKey = url.split("=")[1].slice(0,11);
  chrome.storage.local.set({[urlKey]:summary}, function() {
  })
}

sendInfo = async (data) => {
    result = await axios.post("https://quicktube-backend.herokuapp.com/summarize",data).then(response=>{
        console.log(response);
        let result = response.data.summary;
        document.getElementById("summarizedText").innerHTML = result;
        document.getElementById("summaryTag").style.display = "block"
        storeSummary(result)
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
