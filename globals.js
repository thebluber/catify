var _debug = true;
var _apiUrl = "https://api.test.io";
var _clusterUrl = "https://cluster.test.io";
if (!_debug) {
    _apiUrl = "https://api.test.io";
    _clusterUrl = "https://cluster.test.io";
}
var _token = "";

function requestData(params, headers, url, success, error) {
    try {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(params ? "POST" : "GET", url, true);
        for (var k in headers) {
            xmlHttp.setRequestHeader(k, headers[k]);
        }     
        xmlHttp.onreadystatechange = function (e) {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200 || xmlHttp.status === 201) {
                    _debug && console.log(url + " request succeeded");
                    if (typeof success !== "undefined")
                        success(xmlHttp.responseText);
                }
                else {
                    _debug && console.log(url + " request failed");
                    if (typeof error !== "undefined")
                        error(xmlHttp.statusText);
                }
            }
        };
        xmlHttp.send(params ? JSON.stringify(params) : null);
    }
    catch (e) {
        _debug && console.log(e.message);
    }
}
