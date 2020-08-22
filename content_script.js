//gets title from youtube video
function title() {
  let title = document.getElementsByClassName(
    "title style-scope ytd-video-primary-info-renderer"
  );
  title = title[0].innerHTML.split(">")[1].split("<")[0];
  return title
}

var trans;

//checking if video has a valid transcript
transcript = async() => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
        trans = Boolean(xhttp.responseText);
        }
    }
    let link = "https://video.google.com/timedtext?lang=en&v=" + location.href.split("=")[1]
    await xhttp.open('GET', link);
    xhttp.send(null)
}

transcript()

//if url change must check for transcript again
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  switch (message.type) {
    case "updateTranscript":
      transcript()
      break;
  }  
})

//sends title back to popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "getTitle":
      let ans = {title: title(), transcript: trans}
      sendResponse(ans);
      break;
    default:
      console.error("Unrecognised message: ", message);
  }
});
