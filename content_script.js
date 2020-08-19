
window.onload = function () {
    var title = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer");
    title = title[0].innerHTML.split(">")[1].split("<")[0];


    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            switch(message.type) {
                case "getTitle":
                    sendResponse(title);
                    break;
                default:
                    console.error("Unrecognised message: ", message);
            }
        }
    );
}


