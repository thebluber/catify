var _catAPI = 'http://thecatapi.com/api/images/get?format=xml';
var _xmlParser = new DOMParser();
var _isActive = localStorage.catify == 'true';

HTMLCollection.prototype.map = Array.prototype.map;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "toggleActive") {
    _isActive = message.active;
    var iconName = _isActive ? 'active' : 'inactive';

    chrome.browserAction.setIcon({
      path: {
        "19": iconName + "-19.png",
        "38": iconName + "-38.png"
      }
    });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && _isActive) {
    var jsCode = 'document.getElementsByTagName("img").length';
    var callback = function(result) {
      if (result[0] > 0)
        catifyDOM(tabId, result[0]);
    }
    chrome.tabs.executeScript(tabId, { 'code': jsCode }, callback);
  }
})

function catifyDOM(tabId, imgCount) {
  var msg = {
    action: 'catify',
    cats: getCatImages(imgCount)
  };
  chrome.tabs.sendMessage(tabId, msg);
}

function getCatImages(n) {
  var xhr = new XMLHttpRequest();
  var url;

  if (n > 100) {
    var diff = Math.floor(n / 100);
    var remainder = n % 100;

    url = _catAPI + "&results_per_page=" + remainder;
    xhr.open("GET", url, false);
    xhr.send();

    var xmlDoc = _xmlParser.parseFromString(xhr.response, 'text/xml');
    var images = xmlDoc.getElementsByTagName('url').map(function(url) { return url.textContent.replace('http:', 'https:') });

    // Fetch diff x 100 images
    url = _catAPI + "&results_per_page=100";
    for (var i = 0; i < diff; i++) {
      xhr.open("GET", url, false);
      xhr.send();
      xmlDoc = _xmlParser.parseFromString(xhr.response, 'text/xml');
      images = images.concat(xmlDoc.getElementsByTagName('url').map(function(url) { return url.textContent.replace('http:', 'https:') }));
    }
    return images;

  } else {
    url = _catAPI + "&results_per_page=" + n;
    xhr.open("GET", url, false);
    xhr.send();

    var xmlDoc = _xmlParser.parseFromString(xhr.response, 'text/xml')
    return xmlDoc.getElementsByTagName('url').map(function(url) { return url.textContent.replace('http:', 'https:') });
  }
}
