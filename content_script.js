//gets title from youtube video
function title() {
  let title = document.getElementsByClassName(
    "title style-scope ytd-video-primary-info-renderer"
  );
  title = title[0].innerHTML.split(">")[1].split("<")[0];
  return title
}
//sends title back to popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "getTitle":
      sendResponse(title());
      break;
    default:
      console.error("Unrecognised message: ", message);
  }
});
