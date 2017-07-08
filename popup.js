if (localStorage.catify == undefined)
  localStorage.catify = true;

document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('label').innerHTML = localStorage.catify == 'true' ? 'Deactivate' : 'Activate';
  document.getElementsByTagName('input')[0].checked = localStorage.catify == 'true';

  document.getElementsByTagName('input')[0].onchange = function() {
    document.getElementById('label').innerHTML = this.checked ? 'Deactivate' : 'Activate';
    localStorage.catify = this.checked;
    chrome.runtime.sendMessage({ action: 'toggleActive', active: this.checked });
  }
});
