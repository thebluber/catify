var _catAPI = 'http://thecatapi.com/api/images/get?format=xml';
var _xmlParser = new DOMParser();

HTMLCollection.prototype.sort = Array.prototype.sort;
NodeList.prototype.filter = Array.prototype.filter;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "catify") {
    var imgs = document.getElementsByTagName("img").sort(byVisability);
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].src = message.cats[i];
    }

    var backgroundImgs = document.querySelectorAll("*[style]").filter(function(tag){
      return tag.style.backgroundImage != "";
    });
    for (var i = 0; i < backgroundImgs.length; i++) {
      backgroundImgs[i].style.backgroundImage = 'url("' + message.cats[i % imgs.length] + '")';
    }

  }
});

function byVisability(a, b) {
  if (isElementVisible(a) && !isElementVisible(b))
    return -1;
  if (isElementVisible(b) && !isElementVisible(a))
    return 1;
  return 0;
};

function isElementVisible(el) {
  var rect = el.getBoundingClientRect(),
      vWidth = window.innerWidth || doc.documentElement.clientWidth,
      vHeight = window.innerHeight || doc.documentElement.clientHeight,
      efp = function (x, y) { return document.elementFromPoint(x, y) };

  //Return false if it's not in the viewport
  if (rect.right < 0 || rect.bottom < 0
      || rect.left > vWidth || rect.top > vHeight)
    return false;

  // Return true if any of its four corners are visible
  return (
      el.contains(efp(rect.left,  rect.top))
      ||  el.contains(efp(rect.right, rect.top))
      ||  el.contains(efp(rect.right, rect.bottom))
      ||  el.contains(efp(rect.left,  rect.bottom))
      );
}
