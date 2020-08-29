//listens for login from user
window.onload = function() {
    document.getElementById("login").addEventListener("click", function() {
        chrome.runtime.sendMessage({message:'login'}, function(response) {
            if (response.message === "close") {
                window.close();
            }
        })
    })
}