(function() {
  chrome.runtime.sendMessage(
    "request message",
    function(response) { console.log("receiving: " + response); }
  );
})()
