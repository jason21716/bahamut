function getDomainFromUrl(url){
	var host = null;
	
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*)\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match){
		host = new Array(match[1],match[2]);
	}
    return host;
}

function getPHPFileNameString(s){
	var host = null;
	
	var regex = /([^\/]*)\.php([^\/]*)/;
	var match = s.match(regex);
	if(typeof match != "undefined" && null != match){
		host = new Array(match[1],match[2]);
	}
    return host;
}



function title_msgChange(title){
	var msg_alert = new Array('topBar_light_0','topBar_light_1','topBar_light_2');

	var total_msg = 0;
	msg_alert.forEach(function(entry){	
		if(document.getElementById(entry).firstChild != null){
			var spanText = document.getElementById(entry).children[0].innerHTML;
			var temp_int = parseInt(spanText, 10);
			total_msg += temp_int;
		}
	});

	if(total_msg > 0){
		document.title = "(" + total_msg + ") " + title;
	}else{
		document.title = title;
	}
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}