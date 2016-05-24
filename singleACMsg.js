function getSingleACMsgParmeString(s){
	var host = null;
	
	var regex = /\?sn=([^\/]*)\&gsn\=([^\/]*)/;
	var match = s.match(regex);
	if(typeof match != "undefined" && null != match){
		host = new Array(match[1],match[2]);
	}
    return host;
}

function copyReply(id){
	var replyDOM = document.getElementById('allReply'+id);
	
	var replyObj = replyDOM.children;
	var replyArr = Array.prototype.slice.call(replyObj);
	
	return replyArr;
}

function reverseReply(arr,id){
	arr.reverse();
	var replyArray = copyReply(id);
	//清空reply內部
	document.getElementById('allReply'+id).innerHTML = '';
	//貼入reply陣列
	arr.forEach(function(entry){
		document.getElementById('allReply'+id).appendChild(entry);
	});
	//調整allReply位置
	var allReplyDOM = document.getElementById('allReply'+id);
	var replyDivDOM = document.getElementById('replyDiv'+id);
	document.getElementsByClassName('msgright')[0].removeChild(allReplyDOM);
	document.getElementsByClassName('msgright')[0].appendChild(allReplyDOM);
}

function countLimitFix(a, b) {
    var c = a.value
      , c = c.replace(/&/g, "&amp;")
      , c = c.replace(/'/g, "&#039;")
      , c = c.replace(/"/g, "&quot;")
      , c = c.replace(/</g, "&lt;")
      , c = c.replace(/>/g, "&gt;")
      , c = c.replace(/\r/g, "")
      , c = c.replace(/\n/g, "<br />");
    return utf8LengthFix(c) > 3 * b ? -1 : utf8LengthFix(c);
}

function countLimitFix2(a, b) {
    var c = a.value
      , c = c.replace(/&/g, "&amp;")
      , c = c.replace(/'/g, "&#039;")
      , c = c.replace(/"/g, "&quot;")
      , c = c.replace(/</g, "&lt;")
      , c = c.replace(/>/g, "&gt;")
      , c = c.replace(/\r/g, "")
      , c = c.replace(/\n/g, "<br />");
    return utf8LengthFix(c) > 3 * b ? true : false;
}

function utf8LengthFix(letter) {
    var b = letter.match(/[^\x00-\xff]/ig);
    return null  === b ? letter.length : letter.length + 2 * b.length;
}

function enterkeyFix(a, b, c, d, f) {
    a = window.event || a;
    var g = (navigator.appName == "Microsoft Internet Explorer") ? a.keyCode : a.which
      , e = "main" == c ? 600 : 85;
    13 != g || a.shiftKey ? (countLimitFix2(b, e),
    b.clientHeight < b.scrollHeight && (b.style.height = b.scrollHeight + "px")) : ("main" == c ? checkMsg() : checkReplyFix(d, f),
    a.preventDefault ? a.preventDefault() : a.returnValue = !1)
}

function checkReplyFix(a, b) {
    var c = document.getElementById("replyMsg" + a)
      , d = c.value;  
    countLimitFix2(c, 85) || ("" == d.replace(/(^\s*)|(\s*$)/g, "") ? (alert("\u8acb\u8f38\u5165\u7559\u8a00"),
    c.focus()) : document.getElementById("bahaext-replyBtn" + a).disabled ? alert("\u8655\u7406\u4e2d\uff0c\u8acb\u7a0d\u5019") : (document.getElementById("bahaext-replyBtn" + a).disabled = !0,
    $.ajax({
		type: "POST",
		url: "/ajax/comment.php",
		data: {a: 'A', s: a , c: c.value , u:b},
		success: function(b) {
            showActiveDivFix("allReply" + a, b);
        }
	})))
}

function showActiveDivFix(a, b) {
	if ("allReply" == a.substr(0, 8) || "MSG-box2" == a || "readMore" == a)
		var d = b.getElementsByTagName("sn")[0].textContent
		  , f = b.getElementsByTagName("author")[0].textContent
		  , g = b.getElementsByTagName("nick")[0].textContent
		  , e = b.getElementsByTagName("date")[0].textContent
		  , n = b.getElementsByTagName("content")[0].textContent
		  , l = "undefined" !== typeof avatarUpdate ? avatarUpdate : "";
	if ("allReply" == a.substr(0, 8))
		c = "" == document.getElementById(a).innerHTML ? c = 1 : parseInt(document.getElementById(a).firstChild.lastChild.lastChild.innerHTML.substr(1)) + 1,
		document.getElementById(a).innerHTML = buildReplyFix(d, f, g, n, e, 1, a.substr(8), c, l) + document.getElementById(a).innerHTML,
		document.getElementById("replyMsg" + a.substr(8)).value = "",
		Util.ChangeText("r-" + d, Util.ChangeText.FLAG_BALA),
		document.getElementById("bahaext-replyBtn" + a.substr(8)).disabled = !1;
}

function buildReplyFix(a, b, c, d, f, g, e, n, l) {
    var h = ""
      , h = '<div id="r-' + a + '" name="r-' + a + '" class="msgreport BC2">';
    1 == g ? h += '<a href="javascript:delReplyMsg(' + a + ')" class="msgdel AB1">\u522a\u9664</a>' : 3 == g && (h += '<a href="javascript:" onClick="delMsg_guild(3,' + a + '); return false;" class="msgdel AB1">\u522a\u9664</a>');
    h += '<a href="http://home.gamer.com.tw/home.php?owner=' + b + '" target="_blank"><img src="' + getAvatarPic(b, l) + '" class="msghead" /></a><div><a href="http://home.gamer.com.tw/home.php?owner=' + b + 
    '" class="msgname AT1">' + c + "</a>\uff1a" + d + '<span><a href="javascript:void(0)" onclick="iWantReply(' + e + ",1,'" + b + "','" + c + '\')" title="\u56de\u8986\u4ed6"><img src="http://i2.bahamut.com.tw/spacer.gif" class="IMG-E26" /></a></span><span class="ST1">' + f + '</span><span class="ST1">#' + n + "</span></div>";
    return h + "</div>"
}

function getAvatarPic(e, t) {
    if (t = t ? "?v=" + t : "",
    uidlow = e.toLowerCase(),
    "#" != e.substr(0, 1))
        return "http://avatar2.bahamut.com.tw/avataruserpic/" + uidlow.substr(0, 1) + "/" + uidlow.substr(1, 1) + "/" + uidlow + "/" + uidlow + "_s.png" + t;
    if ("#acg" == uidlow.substr(0, 4)) {
        var o = e.split("_")
          , a = new Array
          , n = new Array;
        return a[1] = "acg-game.gif",
        a[2] = "acg-comic.gif",
        a[4] = "acg-anime.gif",
        a[8] = "acg-novel.gif",
        n[1] = "acg-olg.gif",
        n[8] = "acg-ps3.gif",
        n[32] = "acg-xbox360.gif",
        n[128] = "acg-wii.gif",
        n[512] = "acg-psp.gif",
        n[1024] = "acg-nds.gif",
        n[262144] = "acg-pc.gif",
        n[524288] = "acg-web.gif",
        14 & o[1] ? "http://i2.bahamut.com.tw/acg/" + a[o[1]] : void 0 == n[o[2]] ? "http://i2.bahamut.com.tw/acg/" + a[o[1]] : "http://i2.bahamut.com.tw/acg/" + n[o[2]]
    }
    return "#gid" == uidlow.substr(0, 4) ? "http://p2.bahamut.com.tw/S/GUILD/c/" + e.substr(4) % 10 + "/" + $.sprintf("%010d", e.substr(4)) + ".PNG" : "http://i2.bahamut.com.tw/none.gif"
}

function setBookMarkBtn(){
	var replyMsgHistoryArr = document.getElementsByClassName('msgreport');
	for (i = 0; i < replyMsgHistoryArr.length; i++) {
		var newItem = document.createElement("div");
		var MsgReid = replyMsgHistoryArr[i].id;
		newItem.id = 'baha-bookMark-'+MsgReid;
		newItem.className = 'baha-boonMarkBtn';
		newItem.innerHTML = '設為書籤';
		newItem.setAttribute('guildId',configArr['guildId']);
		newItem.setAttribute('Msgid',configArr['MsgId']);
		newItem.setAttribute('replyid',MsgReid);
		
		replyMsgHistoryArr[i].insertBefore(newItem, replyMsgHistoryArr[i].childNodes[0]);
		replyMsgHistoryArr[i].addEventListener('mouseover',function(){
			this.childNodes[0].style.display='block';
			this.style.width='570px';
		});
		replyMsgHistoryArr[i].addEventListener('mouseout',function(){
			this.childNodes[0].style.display='none';
			this.style.width='500px';
		});
		document.getElementById('baha-bookMark-'+MsgReid).addEventListener('click',function(event){
			var chromeBookMarkNameStr = '{"bookmarkName-'+event.target.getAttribute('Msgid')+'":"'+document.getElementsByClassName('msgright')[0].textContent.substr(0,30)+'"}';
			var chromeBookMarkStr = '{"bookmark-'+event.target.getAttribute('Msgid')+'":"'+event.target.getAttribute('replyid')+'"}';
			var chromeBookMarkArr = JSON.parse(chromeBookMarkStr);
			var chromeBookMarkNameArr = JSON.parse(chromeBookMarkNameStr);
			chrome.storage.local.set(chromeBookMarkArr,function(){});
			chrome.storage.local.set(chromeBookMarkNameArr,function(){
				alert('書籤記錄完成!!');
				document.getElementById(event.target.getAttribute('replyid')).style.backgroundColor='#D0B7C5';
				configArr['bookmark-'+event.target.getAttribute('Msgid')] = event.target.getAttribute('replyid');
			});
			var configBookMarkArr = configArr['bookMarkIndex'];
			if(isEmpty(configBookMarkArr)){
				bookMarkIndexArr = new Array(event.target.getAttribute('Msgid')+'-'+event.target.getAttribute('guildId'));
				chrome.storage.local.set({bookMarkIndex:bookMarkIndexArr});
			}else if(configBookMarkArr.indexOf(event.target.getAttribute('Msgid')+'-'+event.target.getAttribute('guildId')) == -1){
				configBookMarkArr.push(event.target.getAttribute('Msgid')+'-'+event.target.getAttribute('guildId'));
				chrome.storage.local.set({bookMarkIndex:configBookMarkArr});
				configArr['bookMarkIndex'] = configBookMarkArr;
				
			}
			
		});
	}
}

function setAutoRefresh(){
	var timeStr = document.getElementById('baha-autoRefreshInput').value;
	var timeValue = parseInt(timeStr);
	var setIntervalNumber = 0;
	if(!isNaN(timeValue)){
		if(timeValue > 0){
			var cancelNumber = parseInt( document.getElementById('baha-autoRefreshBtn').getAttribute('cancelNumber') );
			if(!isNaN(cancelNumber)){
				window.clearInterval(cancelNumber);
				document.getElementById('baha-autoRefreshStr').innerHTML = '';
			}
			setIntervalNumber = window.setInterval(autoRefreshFunt,timeValue*1000);
			document.getElementById('baha-autoRefreshBtn').setAttribute('cancelNumber',setIntervalNumber);
			document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...';
		}else{
			var cancelNumber = parseInt( document.getElementById('baha-autoRefreshBtn').getAttribute('cancelNumber') );
			if(!isNaN(cancelNumber)){
				window.clearInterval(cancelNumber);
				document.getElementById('baha-autoRefreshStr').innerHTML = '';
			}
		}
	}
	
}

function autoRefreshFunt(){
	var msgId = configArr['MsgId'];
	var guildId = configArr['guildId'];
	
	$.ajax({
		type: "GET",
		url: "http://guild.gamer.com.tw/singleACMsg.php",
		data: {sn: msgId , gsn: guildId},
		success: function(b) {
			
			var replySnIdArr = new Array();
			var replyArr = new Array();
			var replyArrTemp = b.match(/buildReply\([0-9]+\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,[^\,]+\,[0-9]+\,[0-9]+\,\'[^\']*\'\)\;/g);
			
			var stopFlag = false;
			
			$.each(replyArrTemp, function(i, item) {
				var temp = item.match(/buildReply\(([0-9]+)\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,([^\,]+)\,([0-9]+)\,([0-9]+)\,\'[^\']*\'\)\;/);
				var snID = RegExp.$1;
				var userID = RegExp.$2;
				var user = RegExp.$3;
				var content = RegExp.$4;
				var time = RegExp.$5;
				var isSelf = RegExp.$6;
				var msgID = RegExp.$7;
				var replyCount = RegExp.$8;
				content = content.replace(/\&ensp/g,' ');
				content = content.replace(/\&emsp/g,'　');
				if(content.indexOf('[[STOP-AUTO-REFRESH]]') != -1){
					stopFlag = true;
				}

				var singleReply = buildReplyFix(snID, userID, user, content, time, isSelf, msgID, replyCount, '');
				replyArr.push(singleReply);
				replySnIdArr.push(snID);
			});
			
			if(configArr['singleACMsgReverse']){
				replyArr.reverse();
			}
			var tempAllReplyHTML = '';
			for(i = 0; i < replyArr.length; i++){
				tempAllReplyHTML += replyArr[i];
			}
			document.getElementById('allReply'+configArr['MsgId']).innerHTML = tempAllReplyHTML;
			for(i = 0; i < replySnIdArr.length; i++){
				Util.ChangeText("r-" + replySnIdArr[i], Util.ChangeText.FLAG_BALA);
			}
			if(configArr['bookMarkBtn']){
				setBookMarkBtn();
			}
			
			if(configArr['bookmark-'+configArr['MsgId']] !== undefined){
				 bookMarkChangeColor(configArr['bookmark-'+configArr['MsgId']]);
			}
			
			if(stopFlag && !configArr['isOwner']){
				document.getElementById('baha-autoRefreshInput').value = 0;
				setAutoRefresh();
				document.getElementById('baha-autoRefreshStr').innerHTML = '自動更新已被開串者要求關閉';
			}
        }
	})
}

function bookMarkChangeColor(snid){
	document.getElementById(snid).style.backgroundColor='#D0B7C5';
}