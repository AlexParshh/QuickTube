//gets title from youtube video
function title() {
  let title = document.getElementsByClassName(
    "title style-scope ytd-video-primary-info-renderer"
  );
  title = title[0].innerHTML.split(">")[1].split("<")[0];
  return title;
}

var trans;
var token;

chrome.runtime.sendMessage({message:"askToken"}, function(response){
  token = response.token;
})

//checking if video has a valid transcript
transcript = async () => {
  if (token) {
    if (location.href.includes("https://www.youtube.com/watch?v=")) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
          trans = JSON.parse(xhttp.responseText);
          trans = Boolean(trans.items.length)
        }
      };
      let link =
        "https://www.googleapis.com/youtube/v3/captions?videoId=" +
        location.href.split("=")[1]+ "&part=id&access_token=" + token;
      await xhttp.open("GET", link);
      xhttp.send(null);
    }
  }

};


transcript();


//sends title back to popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  switch (message.type) {
    case "getTitle":
      let url = location.href;
      let ans = { title: title(), transcript: trans, url: url };
      sendResponse(ans);
      break;
    case "updateTranscript":
      token = message.token;
      //if url change must check for transcript again
      transcript();
      break;
    default:
      console.error("Unrecognised message: ", message);
  }
});
