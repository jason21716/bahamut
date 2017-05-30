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

function changePageTitle(){
	var newtitle = prompt("請輸入網頁的新標題",ORGINAL_TITLE)
	if(newtitle){
		document.title = newtitle;
		NEW_TITLE = newtitle;
	}
}

function title_msgChange(title,boolNotice,boolSubscript,boolRecommend){
	var msg_alert = new Array('topBar_light_0','topBar_light_1','topBar_light_2');

	var total_msg = 0;
	var msg_sep = new Array();
	msg_alert.forEach(function(entry){
		if(document.getElementById(entry).firstChild != null){
			var spanText = document.getElementById(entry).children[0].innerHTML;
			var temp_int = parseInt(spanText, 10);
				msg_sep.push(temp_int);
		}else{
			msg_sep.push(0);
		}
	});
	if(boolNotice) total_msg += msg_sep[0];
	if(boolSubscript) total_msg += msg_sep[1];
	if(boolRecommend) total_msg += msg_sep[2];

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

var Util = Util || {};
(function(k) {
    var b = function(l, f) {
        /*$("iframe").each(function(a) {
            0 <= a.src.indexOf("?autoplay=1") && (a.src = a.src.replace(/\?autoplay=1/gi, ""))
        });*/
        var g = document.getElementById(l)
          , a = g.innerHTML
          , c = "src"
          , d = ""
          , h = ""
          , e = "";
        f & b.FLAG_LAZYLOAD && (c = "data-src",
        d = 'class="lazyload" ');
        f & b.FLAG_MAX_SIZE && (h = 'style="max-width:120px;max-height:120px;" ');
        f & b.FLAG_LINE_BREAK && (e = "<br>");
        a = a.replace(/(<[^>]*)h(ttp[s]{0,1}:\/\/[^>]*>)/gi, "$1b$2");
        f & b.FLAG_BALA_PLAYER ? (a = a.replace(/https?:\/\/(m|www|jp|tw).youtube.com\/watch\?v=([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, "<p style=\" display:block; width:138px; height:77px; background:url(bttp://i1.ytimg.com/vi/$2/default.jpg) no-repeat center center;\" onclick=\"$(this).html('<iframe width=450 height=253 src=bttp://www.youtube.com/embed/$2?autoplay=1 frameborder=0 allowfullscreen></iframe>');$(this).css('width','450px');$(this).css('height','253px');\"><img src=\"bttp://i2.bahamut.com.tw/PLAY2.png\" style=\"cursor: Pointer;\"></p>"),
        a = a.replace(/https?:\/\/youtu.be\/([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, "<p style=\" display:block; width:138px; height:77px; background:url(bttp://i1.ytimg.com/vi/$1/default.jpg) no-repeat center center;\" onclick=\"$(this).html('<iframe width=450 height=253 src=bttp://www.youtube.com/embed/$1?autoplay=1 frameborder=0 allowfullscreen></iframe>');$(this).css('width','450px');$(this).css('height','253px');\"><img src=\"bttp://i2.bahamut.com.tw/PLAY2.png\" style=\"cursor: Pointer;\"></p>"),
        a = a.replace(/http:\/\/(?:www|tw)\.nicovideo\.jp\/watch\/((?:sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz)[0-9]{1,14}|[0-9]{10})/g,
        '<p><iframe src="bttp://ext.nicovideo.jp/thumb_watch/$1?thumb_mode=html" style="width:450px; height:253px; border:none;"></iframe></p>')) : (a = a.replace(/https?:\/\/(m|www|jp|tw).youtube.com\/watch\?v=([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, e + "<iframe " + d + c + '="bttp://www.youtube.com/embed/$2" frameborder="0" allowfullscreen></iframe>'),
        a = a.replace(/https?:\/\/youtu.be\/([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, e + "<iframe " + d + c + '="bttp://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'),
        a = a.replace(/http:\/\/(?:www|tw)\.nicovideo\.jp\/watch\/((?:sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz)[0-9]{1,14}|[0-9]{10})/g, e + "<iframe " + d + c + '="bttp://ext.nicovideo.jp/thumb_watch/$1?thumb_mode=html"></iframe>'));
        a = a.replace(/h(ttp[s]{0,1}:\/\/[^:]+\.(jpg|png|gif))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);"><img ' + h + d + c + '="b$1"></a>');
        a = a.replace(/h(ttp[s]{0,1}:\/\/([^ <\[\u2E80-\u9FFF]+))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);">$2</a>');
        a = a.replace(/\[e(\d*)\]/gi, "<img " + d + c + '="http://i2.bahamut.com.tw/editor/emotion/$1.gif">');
        "undefined" != typeof gsn && (a = a.replace(/\[G(1[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.GIF">'),
        a = a.replace(/\[G(2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.JPG">'),
        a = a.replace(/\[G(3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.PNG">'));
        a = a.replace(/\[G([0-9]{1}\/\d*_1[a-z0-9]{3})\]/gi,
        "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.GIF">');
        a = a.replace(/\[G([0-9]{1}\/\d*_2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.JPG">');
        a = a.replace(/\[G([0-9]{1}\/\d*_3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.PNG">');
        a = a.replace(/a>\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, 'a> &gt; <a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '\u3001<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/b(ttp[s]{0,1}:\/\/)/gi, "h$1");
        g.innerHTML = a
    }
    ;
    b.refurl = function(b) {
        "http://ref.gamer" != b.href.substr(0, 16) && (b.href = "http://ref.gamer.com.tw/redir.php?url=" + encodeURIComponent(b.href));
        return !0
    }
    ;
    b.FLAG_LAZYLOAD = 1;
    b.FLAG_MAX_SIZE = 2;
    b.FLAG_LINE_BREAK = 4;
    b.FLAG_BALA_PLAYER = 8;
    b.FLAG_BALA = b.FLAG_LAZYLOAD | b.FLAG_MAX_SIZE | b.FLAG_LINE_BREAK | b.FLAG_BALA_PLAYER;
    k.ChangeText = b
})(Util);

var Util_fix = Util_fix || {};
(function(k) {
    var b = function(l, f) {
        /*$("iframe").each(function(a) {
            0 <= a.src.indexOf("?autoplay=1") && (a.src = a.src.replace(/\?autoplay=1/gi, ""))
        });*/
        var g = document.getElementById(l)
          , a = g.innerHTML
          , c = "src"
          , d = ""
          , h = ""
          , e = "";
        f & b.FLAG_LAZYLOAD && (c = "data-src",
        d = 'class="lazyload" ');
        f & b.FLAG_MAX_SIZE && (h = 'style="max-width:120px;max-height:120px;" ');
        f & b.FLAG_LINE_BREAK && (e = "<br>");
        a = a.replace(/(<[^>]*)h(ttp[s]{0,1}:\/\/[^>]*>)/gi, "$1b$2");
        //a = a.replace(/h(ttp[s]{0,1}:\/\/[^:]+\.(jpg|png|gif))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);"><img ' + h + d + c + '="b$1"></a>');
        a = a.replace(/h(ttp[s]{0,1}:\/\/([^ <\[\u2E80-\u9FFF]+))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);">$2</a>');
        a = a.replace(/\[e(\d*)\]/gi, "<img " + d + c + '="http://i2.bahamut.com.tw/editor/emotion/$1.gif">');
        "undefined" != typeof gsn && (a = a.replace(/\[G(1[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.GIF">'),
        a = a.replace(/\[G(2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.JPG">'),
        a = a.replace(/\[G(3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.PNG">'));
        a = a.replace(/\[G([0-9]{1}\/\d*_1[a-z0-9]{3})\]/gi,
        "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.GIF">');
        a = a.replace(/\[G([0-9]{1}\/\d*_2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.JPG">');
        a = a.replace(/\[G([0-9]{1}\/\d*_3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.PNG">');
        a = a.replace(/a>\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, 'a> &gt; <a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '\u3001<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/b(ttp[s]{0,1}:\/\/)/gi, "h$1");
        g.innerHTML = a
    }
    ;
    b.refurl = function(b) {
        "http://ref.gamer" != b.href.substr(0, 16) && (b.href = "http://ref.gamer.com.tw/redir.php?url=" + encodeURIComponent(b.href));
        return !0
    }
    ;
    b.FLAG_LAZYLOAD = 1;
    b.FLAG_MAX_SIZE = 2;
    b.FLAG_LINE_BREAK = 4;
    b.FLAG_BALA_PLAYER = 8;
    b.FLAG_BALA = b.FLAG_LAZYLOAD | b.FLAG_MAX_SIZE | b.FLAG_LINE_BREAK | b.FLAG_BALA_PLAYER;
    k.ChangeText = b
})(Util_fix);

function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function cuttingMsg(str,length){
	  var targetLength = length*3;
		var strArr = str.match(/[^\r\n]{0,}[\r\n]{0,}/gm);


		console.log(strArr);

		var resultArr = [];
		var tempCount = 0;
		var tempStr = "";
		while(strArr.length > 0){
			var tempPatten = strArr.shift();
			var leng = countLimitFixOnlyNum(tempPatten);
			console.log(leng);
			if(tempCount + leng <= targetLength){
				tempStr += tempPatten;
				tempCount += leng;
			}
			else if(leng <= targetLength){
				resultArr.push(tempStr);
				tempStr = tempPatten;
				tempCount = leng;
			}else{
				if(tempStr.length > 0){
					resultArr.push(tempStr);
					tempStr = "";
					tempCount = 0;
				}
				var strSpiltArr = tempPatten.match(/[^，、。\s]{0,}[，、。\s]{0,1}/gm);
				for(var i = strSpiltArr.length - 1 ; i >= 0 ; i--){
					if(countLimitFixOnlyNum(strSpiltArr[i]) <= targetLength)
						strArr.unshift(strSpiltArr[i]);
					else{
						strArr.unshift(strSpiltArr[i].substr(strSpiltArr[i].length/2+1));
						strArr.unshift(strSpiltArr[i].substr(0,strSpiltArr[i].length/2));
					}
				}
			}
			console.log(strArr);
		}
		resultArr.push(tempStr);
		resultArr.forEach(function(element, index, array){
			resultArr[index] = element.replace(/[\r\n]{1,}$/g,'');
		});
		return resultArr;
}
