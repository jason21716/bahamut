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

function countLimitFixOnlyNum(a) {
    var c = a
      , c = c.replace(/&/g, "&amp;")
      , c = c.replace(/'/g, "&#039;")
      , c = c.replace(/"/g, "&quot;")
      , c = c.replace(/</g, "&lt;")
      , c = c.replace(/>/g, "&gt;")
      , c = c.replace(/\r/g, "")
      , c = c.replace(/\n/g, "<br />");
    return utf8LengthFix(c);
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

function enterkeyLongTextFix(a, b, c, d, f) {
    a = window.event || a;
    var g = (navigator.appName == "Microsoft Internet Explorer") ? a.keyCode : a.which
      , e = "main" == c ? 600 : 85;
    (13 == g )
			? ( ( a.shiftKey )
				? (countLimitFix2(b, e),
    			b.clientHeight < b.scrollHeight && (b.style.height = b.scrollHeight + "px")
				)
				: ("main" == c ? checkMsg() : checkReplyLongTextFix(d, f),
	    		a.preventDefault ? a.preventDefault() : a.returnValue = !1) )
			: (countLimitFix2(b, e),
				b.clientHeight < b.scrollHeight && (b.style.height = b.scrollHeight + "px")
			);
}

function checkReplyFix(a, b) {
    var c = document.getElementById("replyMsg" + a)
      , d = c.value;
		var letterCount = countLimitFix2(c, 85);
		if(letterCount)
			alert("\u5b57\u6578\u8d85\u904e85\u500b\u5b57\u4e86\u5594\uff5e");
    countLimitFix2(c, 85) || ("" == d.replace(/(^\s*)|(\s*$)/g, "") ? (alert("\u8acb\u8f38\u5165\u7559\u8a00"),
    c.focus()) : document.getElementById("bahaext-replyBtn" + a).disabled ? alert("\u8655\u7406\u4e2d\uff0c\u8acb\u7a0d\u5019") : (document.getElementById("bahaext-replyBtn" + a).disabled = !0,
    $.ajax({
		type: "POST",
		url: "/ajax/comment.php",
		data: {a: 'A', s: a , c: c.value , u:b},
		success: function(bb) {
            showActiveDivFix("allReply" + a, bb);
        }
	})))
}

function checkReplyLongTextFix(a, b) {
    var c = document.getElementById("replyMsg" + a)
      , d = c.value;
		var letterCount = countLimitFix2(c, 85);
		var postArr = [];
		if(letterCount)
			postArr = cuttingMsg(c.value,85);
		else
			postArr.push(d);

		console.log(postArr);
    ("" == d.replace(/(^\s*)|(\s*$)/g, "") ? (alert("\u8acb\u8f38\u5165\u7559\u8a00"),
    c.focus()) : document.getElementById("bahaext-replyBtn" + a).disabled ? alert("\u8655\u7406\u4e2d\uff0c\u8acb\u7a0d\u5019") : (document.getElementById("bahaext-replyBtn" + a).disabled = !0,
			uploadRecursion(postArr,0,a,b)
		))
}

function uploadRecursion(arr,index,a,b){
	if(arr.length == index)
		return;
	$.ajax({
		type: "POST",
		url: "/ajax/comment.php",
		data: {a: 'A', s: a , c: arr[index] , u:b},
		success: function(t) {
			showActiveDivFix("allReply" + a, t);
			uploadRecursion(arr,index+1,a,b);
			}
	});
}

function showActiveDivFix(a, b) {
	if ("allReply" == a.substr(0, 8) || "MSG-box2" == a || "readMore" == a)
		var d = b.getElementsByTagName("sn")[0].textContent
		  , f = b.getElementsByTagName("author")[0].textContent
		  , g = b.getElementsByTagName("nick")[0].textContent
		  , e = b.getElementsByTagName("date")[0].textContent
		  , n = b.getElementsByTagName("content")[0].textContent
		  , l = "undefined" !== typeof avatarUpdate ? avatarUpdate : "";
	if ("allReply" == a.substr(0, 8)){
		c = "" == document.getElementById(a).innerHTML ? c = 1 : parseInt(document.getElementById(a).firstChild.lastChild.lastChild.innerHTML.substr(1)) + 1;
		if(configArr['singleACMsgReverse'] === true)
			document.getElementById(a).innerHTML = buildReplyFix(d, f, g, n, e, 1, a.substr(8), c, l) + document.getElementById(a).innerHTML;
		else {
			document.getElementById(a).innerHTML = document.getElementById(a).innerHTML + buildReplyFix(d, f, g, n, e, 1, a.substr(8), c, l);
		}
		document.getElementById("replyMsg" + a.substr(8)).value = "";
		Util.ChangeText("r-" + d, Util.ChangeText.FLAG_BALA);
		document.getElementById("bahaext-replyBtn" + a.substr(8)).disabled = !1;
	}

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

function cleanBookMarkBtn(replyId){
	var tempDom = document.getElementById('r-'+replyId);
	tempDom.removeChild(tempDom.childNodes[0]);
}

function setAllBookMarkBtn(){
	var replyMsgHistoryArr = document.getElementsByClassName('msgreport');
	for (i = 0; i < replyMsgHistoryArr.length; i++) {
		setBookMarkBtn(replyMsgHistoryArr[i].id);
	}
}

function setBookMarkBtn(MsgReid){
	console.log(MsgReid);
	var newItem = document.createElement("div");
	newItem.id = 'baha-bookMark-'+MsgReid;
	newItem.className = 'baha-boonMarkBtn';
	newItem.innerHTML = '設為書籤';
	newItem.setAttribute('guildId',configArr['guildId']);
	newItem.setAttribute('Msgid',configArr['MsgId']);
	newItem.setAttribute('replyid',MsgReid);

	var tempCurrentDom = document.getElementById(MsgReid);
	tempCurrentDom.insertBefore(newItem, tempCurrentDom.childNodes[0]);
	tempCurrentDom.addEventListener('mouseover',function(){
		this.childNodes[0].style.display='block';
		this.style.width='570px';
	});
	tempCurrentDom.addEventListener('mouseout',function(){
		this.childNodes[0].style.display='none';
		this.style.width='500px';
	});
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

			MSGRE_MAX = -1;
			if(document.getElementById('baha-autoRefreshCheck').checked){
				MSGRE_NOTIFYID = '';
				MSGRE_MAX = document.getElementById('allReply'+configArr['MsgId']).childElementCount;
				document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...(通知已啟動)';
			}
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
		url: "https://guild.gamer.com.tw/singleACMsg.php",
		data: {sn: msgId , gsn: guildId},
		success: function(b) {

			var replySnIdArr = new Array();
			var replyArr = new Array();
			var replyObjArr = new Array();
			var replyArrTemp = b.match(/buildReply\([0-9]+\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,[^\,]+\,[0-9]+\,[0-9]+\,\'[^\']*\'\)\;/g);

			var stopFlag = false;
			var lastResponseUserId;
			$.each(replyArrTemp, function(i, item) {
				var replyObj = new Array();
				var temp = item.match(/buildReply\(([0-9]+)\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,([^\,]+)\,([0-9]+)\,([0-9]+)\,\'[^\']*\'\)\;/);
				replyObj.snID = temp[1];
				replyObj.userID = temp[2];
				replyObj.user = temp[3];
				replyObj.content = temp[4];
				replyObj.time = temp[5];
				replyObj.isSelf = temp[6];
				replyObj.msgID = temp[7];
				replyObj.replyCount = temp[8];
				replyObj.content = replyObj.content.replace(/\&ensp/g,' ');
				replyObj.content = replyObj.content.replace(/\&emsp/g,'　');
				if(replyObj.content.indexOf('[[STOP-AUTO-REFRESH]]') != -1){
					stopFlag = true;
				}

				replyObjArr.push(replyObj);
				lastResponseUserId = replyObj.userID;
			});
			configArr['lastReplyArr'] = replyObjArr;
			reGenerateReply(false,replyArr,replySnIdArr);

			if(stopFlag && !configArr['isOwner']){
				document.getElementById('baha-autoRefreshInput').value = 0;
				setAutoRefresh();
				document.getElementById('baha-autoRefreshStr').innerHTML = '自動更新已被開串者要求關閉';
			}

			if(document.getElementById('baha-autoRefreshCheck').checked){
				var last_check = 0;
				last_check = document.getElementById('allReply'+configArr['MsgId']).childElementCount;

				if(MSGRE_MAX < last_check && lastResponseUserId != configArr['controller']){
					var text = (NEW_TITLE != ORGINAL_TITLE)
						? '分頁：' + NEW_TITLE
						: document.getElementsByClassName('msgright')[0].textContent.substr(0,20);
					var number = last_check
					chrome.runtime.sendMessage(
						{
							greeting: "nofity",
							rid: configArr['MsgId']+last_check,
							text: text,
							num: number
						}
					)
					MSGRE_MAX = last_check;
				}
				document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...(通知已啟動)';
			}else{
				document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...';
			}
        }
	})
}

function bookMarkChangeColor(snid){
	document.getElementById(snid).style.backgroundColor='#D0B7C5';
}

function fastResponseFunt(snid,text){
	document.getElementById('replyMsg'+ snid).value += text;
	document.getElementById('replyMsg'+ snid).focus();
}

function addRightContent(){
	var domRightTitle = document.createElement("h5");
	domRightTitle.innerHTML = '部分顯示選項';
	domRightTitle.id= 'baha-rightTitle';

	var domRightContent = document.createElement("div");
	domRightContent.className = 'BH-rbox MSG-list5';
	domRightContent.id = 'baha-rightContent';

	var rightContentHeader = document.createElement("p");
	rightContentHeader.innerHTML = '目前狀態：正常';
	rightContentHeader.id = 'baha-rightContentStatus';

	var rightContentDiv = document.createElement("div");

	var rightContentlabel1 = document.createElement("span");
	rightContentlabel1.innerHTML = '只顯示書籤後的訊息：';

	var rightContentChoose1 = document.createElement("select");
	rightContentChoose1.id = 'baha-rightContentChoosebookMark';
	var option01 = document.createElement("option");
	option01.text = "關閉";
	rightContentChoose1.add(option01);
	var option02 = document.createElement("option");
	option02.text = "開啟";
	rightContentChoose1.add(option02);

	var rightContentlabel2 = document.createElement("span");
	rightContentlabel2.innerHTML = '顯示選項：';

	var rightContentChoose2 = document.createElement("select");
	rightContentChoose2.id = 'baha-rightContentChooseType';
	var option1 = document.createElement("option");
	option1.text = "全部顯示";
	rightContentChoose2.add(option1);
	var option2 = document.createElement("option");
	option2.text = "顯示部分對象";
	rightContentChoose2.add(option2);
	rightContentChoose2.addEventListener("change", function(e){
		if(document.getElementById('baha-rightContentChooseType').selectedIndex == 0){
			var nameList = document.getElementsByName("baha-userList");
			$.each(nameList, function(i, item) {
				$(item).prop("checked", true);
			});
		}
	});

	var rightContentUserDiv = document.createElement("div");
	rightContentUserDiv.id = 'baha-rightContentUserDiv';

	var nowContentArr = generateReplyObjArr(document.documentElement.innerHTML);
	configArr['lastReplyArr'] = nowContentArr;

	var rightContentBtn = document.createElement("button");
	rightContentBtn.innerHTML = '套用';

	var rightContentBtnClean = document.createElement("button");
	rightContentBtnClean.innerHTML = '全部清除';

	var pageSetting = new Array();
	pageSetting.onlyAfterBookMrak = 0;
	pageSetting.showType = 0;
	pageSetting.showUser = new Array();
	configArr['displaySetting'] = pageSetting;

	rightContentBtn.addEventListener("click", function(e){

		var pageSetting = new Array();
		pageSetting.onlyAfterBookMrak = document.getElementById('baha-rightContentChoosebookMark').selectedIndex;
		pageSetting.showType = document.getElementById('baha-rightContentChooseType').selectedIndex;

		if(pageSetting.onlyAfterBookMrak + pageSetting.showType !== 0){
			document.getElementById('baha-rightContentStatus').innerHTML = '目前狀態：部分顯示中';
		}else{
			document.getElementById('baha-rightContentStatus').innerHTML = '目前狀態：正常';
		}
		pageSetting.showUser = new Array();
		if(pageSetting.showType == 1){
			var nameList = document.getElementsByName("baha-userList");
			$.each(nameList, function(i, item) {
				if($(item).prop("checked"))
					pageSetting.showUser.push(item.value);
			});
		}

		configArr['displaySetting'] = pageSetting;

		reGenerateReply(true, new Array(),new Array());
	});

	rightContentBtnClean.addEventListener("click", function(e){
		var nameList = document.getElementsByName("baha-userList");
		$.each(nameList, function(i, item) {
			$(item).prop("checked", false);
		});
	});

	domRightContent.appendChild(rightContentHeader);
	domRightContent.appendChild(rightContentlabel1);
	domRightContent.appendChild(rightContentChoose1);
	domRightContent.appendChild(document.createElement('br'));
	domRightContent.appendChild(rightContentlabel2);
	domRightContent.appendChild(rightContentChoose2);
	domRightContent.appendChild(rightContentUserDiv);
	domRightContent.appendChild(rightContentBtnClean);
	domRightContent.appendChild(rightContentBtn);
	$(document.getElementById('BH-slave')).prepend(domRightContent);
	$(document.getElementById('BH-slave')).prepend(domRightTitle);
	resetUserList(nowContentArr);
}

function generateReplyObjArr(html){
	var replyArrTemp = html.match(/buildReply\([0-9]+\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,[^\,]+\,[0-9]+\,[0-9]+\,\'[^\']*\'\)\;/g);
	var replyArr = new Array();
	var stopFlag = false;
	var lastResponseUserId;
	try {
		if(replyArrTemp.length != 0)
			$.each(replyArrTemp, function(i, item) {
				var replyObj = new Array();
				var temp = item.match(/buildReply\(([0-9]+)\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,([^\,]+)\,([0-9]+)\,([0-9]+)\,\'[^\']*\'\)\;/);
				replyObj.snID = temp[1];
				replyObj.userID = temp[2];
				replyObj.user = temp[3];
				replyObj.content = temp[4];
				replyObj.time = temp[5];
				replyObj.isSelf = temp[6];
				replyObj.msgID = temp[7];
				replyObj.replyCount = temp[8];
				replyObj.content = replyObj.content.replace(/\&ensp/g,' ');
				replyObj.content = replyObj.content.replace(/\&emsp/g,'　');
				replyArr.push(replyObj);
			});
	} catch (e) {

	} finally {

	}
	return replyArr;
}

function resetUserList(arr){
	var userArr = new Array();
	var userNameArr = new Array();
	$.each(arr, function(i, item) {
		if( userArr.indexOf(item.userID) == -1){
			userArr.push(item.userID);
			userNameArr.push(item.user);
		}
	});

	var rightContentUserDiv = document.getElementById('baha-rightContentUserDiv');
	rightContentUserDiv.innerHTML = '';
	$.each(userArr, function(i, item) {
		var userInput = document.createElement('input');
		userInput.type = 'checkbox';
		userInput.name = 'baha-userList';
		userInput.value = item;
		var userInputLabel = document.createElement('span');
		userInputLabel.innerHTML = userNameArr[i];
		userInputLabel.id = 'baha-userList-'+item;
		userInputLabel.className = 'baha-userlist-Label';
		$(userInput).prop("checked", true);

		rightContentUserDiv.appendChild(userInput);
		rightContentUserDiv.appendChild(userInputLabel);
		rightContentUserDiv.appendChild(document.createElement('br'));
	});
}

function reGenerateReply(flag,replyArr,replySnIdArr){
	var hispeed = document.getElementById('baha-autoRefreshHiSpeedCheck').checked;

	var domUserList =  document.getElementsByClassName('baha-userlist-Label');

	var bookMarkLocation = -1;
	if(configArr['bookmark-'+configArr['MsgId']] !== undefined && configArr['displaySetting'].onlyAfterBookMrak != 0){
		for(var i = 0; i < configArr['lastReplyArr'].length ;i++ ){
			if(('r-' + configArr['lastReplyArr'][i].snID) === configArr['bookmark-'+configArr['MsgId']]){
				bookMarkLocation = i;
				break;
			}
		}
	}


	$.each(domUserList,function(i, item) {
		item.style.fontWeight = 'regular';
		item.style.color = 'black';
	});

	$.each(configArr['lastReplyArr'], function(i, item) {
		var printFlag = true;
		if(i < bookMarkLocation)
			printFlag = false;
		if(printFlag && configArr['displaySetting'].showType == 1)
			if(configArr['displaySetting'].showUser.indexOf(item.userID) == -1)
				printFlag = false;
		if(printFlag){
			replyArr.push(item);
			replySnIdArr.push(item.snID);
			try {
				document.getElementById('baha-userList-'+item.userID).style.fontWeight = 'bold';
				document.getElementById('baha-userList-'+item.userID).style.color = 'blue';
			} catch (e) {
				resetUserList(configArr['lastReplyArr']);
				document.getElementById('baha-userList-'+item.userID).style.fontWeight = 'bold';
				document.getElementById('baha-userList-'+item.userID).style.color = 'blue';
			}

		}
	});

	if(flag){
		if(configArr['singleACMsgReverse']){
			replyArr.reverse();
		}
		var tempAllReplyHTML = '';
		for(i = 0; i < replyArr.length; i++){
			var singleReply = buildReplyFix(replyArr[i].snID, replyArr[i].userID, replyArr[i].user, replyArr[i].content, (hispeed) ? changeTime(replyArr[i].time) : replyArr[i].time, replyArr[i].isSelf, replyArr[i].msgID, replyArr[i].replyCount, '');
			tempAllReplyHTML += singleReply;
		}
		document.getElementById('allReply'+configArr['MsgId']).innerHTML = tempAllReplyHTML;
		for(i = 0; i < replySnIdArr.length; i++){
			Util.ChangeText("r-" + replySnIdArr[i], Util.ChangeText.FLAG_BALA);
		}
		if(configArr['bookMarkBtn']){
			setAllBookMarkBtn();
		}
	}else{
		var tempAllReply = document.getElementById('allReply'+configArr['MsgId']);
		for(i = 0; i < replySnIdArr.length; i++){
			if ($("#r-" + replySnIdArr[i]).length == 0) {
				var singleReply = buildReplyFix(replyArr[i].snID, replyArr[i].userID, replyArr[i].user, replyArr[i].content, (hispeed) ? changeTime(replyArr[i].time) : replyArr[i].time, replyArr[i].isSelf, replyArr[i].msgID, replyArr[i].replyCount, '');
				if(configArr['singleACMsgReverse']){
					tempAllReply.insertBefore(htmlToElement(singleReply), tempAllReply.firstChild);
				}else{
					tempAllReply.appendChild(htmlToElement(singleReply));
				}
				if(configArr['bookMarkBtn']){
					setBookMarkBtn("r-" + replySnIdArr[i]);
				}
				Util.ChangeText("r-" + replySnIdArr[i], Util.ChangeText.FLAG_BALA);
			}
		}

		var replyMsgHistoryArr = document.getElementsByClassName('msgreport');
		for (i = 0; i < replyMsgHistoryArr.length; i++) {
			var checkingReplyId = replyMsgHistoryArr[i].id.substr(2);
			var replyIndex = replySnIdArr.indexOf(checkingReplyId)
			if ( replyIndex == -1) {
				document.getElementById('allReply'+configArr['MsgId']).removeChild(document.getElementById('r-'+checkingReplyId));
			}else if(!hispeed){
				var targetObj = replyArr[replyIndex];
				var tempTime = targetObj.time;
				var tempCount = targetObj.replyCount;
				$('#r-'+checkingReplyId+' .ST1:eq(0)').html(tempTime);
				$('#r-'+checkingReplyId+' .ST1:eq(1)').html('#'+tempCount);
			}
		}
	}

	if(configArr['bookmark-'+configArr['MsgId']] !== undefined){
		 bookMarkChangeColor(configArr['bookmark-'+configArr['MsgId']]);
	}
}

function uploadJsonFunt(){
	var uploadObj = new Object();
	var msgMatch = document.documentElement.innerHTML.match(/buildMsg\(([0-9]+),\'#GID([0-9]+)\',\'([^\']*)\',\'([^\']*)\',\'[^\']*owner=([^\"]*)[^\']*<img[^>]*> ([^<]*)<\/a>：([^']*)\',\'([^\']*)\',([0-9]+),([0-9]+),([0-9]+),\'([^\']*)\',([0-9]+),([0-9]+),([0-9]+),\'([^\']*)\',\'([^\']*)\'\)/);
	uploadObj.sn = msgMatch[1];
	uploadObj.gsn = msgMatch[2];
  uploadObj.uid = msgMatch[5];
  uploadObj.nick = msgMatch[6];
	uploadObj.content = msgMatch[7];
  uploadObj.gp = msgMatch[9];
  uploadObj.bp = msgMatch[10];
  uploadObj.priv = msgMatch[11];
	uploadObj.date = changeTime(msgMatch[8]);
  uploadObj.replynum = configArr['lastReplyArr'].length;
	uploadObj.reply = new Array();

	$.each(configArr['lastReplyArr'],function(i, item) {
		var replyObj = new Object();
		replyObj.sn = item.snID;
	  replyObj.uid = item.userID;
	  replyObj.nick = item.user;
		replyObj.date = changeTime(item.time);
		replyObj.comment = item.content;

		uploadObj.reply.push(replyObj);
	});

	var myJsonString = JSON.stringify(uploadObj);
	console.log(myJsonString);

	$.ajax({
		dataType: "json",
	  url: "https://php-isaka.rhcloud.com/History/uploadJson.php",
	  data: {
			data: myJsonString,
			key: configArr['uploadJsonKey']
		},
		method: "POST",
	  success: function(e){
			alert("上傳完成！"+" ("+e.code+") "+e.descirbe);
		},
		error: function(j,s,e){
			alert("上傳失敗！"+e);
		}
	});
}

function changeTime(str){
	var calender = new Date();
	if(str.indexOf("昨天") !== -1){
		calender.setDate(calender.getDate()-1);
		str = str.replace("昨天",calender.format("yyyy-mm-dd"));
	}
	else if(str.indexOf("前天") !== -1){
		calender.setDate(calender.getDate()-2);
		str = str.replace("前天",calender.format("yyyy-mm-dd"));
	}
	else if(str.indexOf("分前") !== -1){
		var matchs = str.match(/([0-9]+)分前/);
		calender.setMinutes(calender.getMinutes()-matchs[1]);
		str = calender.format("yyyy-mm-dd HH:MM");
	}
	else if(str.indexOf("1分內") !== -1){
	  str = calender.format("yyyy-mm-dd HH:MM");
	}
	else if(str.indexOf("小時前") !== -1){
		var matchs = str.match(/([0-9]+)小時前/);
		calender.setHours(calender.getHours()-matchs[1]);
		str = calender.format("yyyy-mm-dd HH:MM");
	}
	else{
		var matchs = str.match(/([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)/);

		var newDate = new Date(calender.getYear(),matchs[1],matchs[2],matchs[3],matchs[4],0,0);
    	if(newDate > calender )
    		calender.setYear(calender.getYear()-1);
			str = calender.format("yyyy-mm-dd HH:MM");
	}
	return str;

}
