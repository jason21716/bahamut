function changeBtnState(str){
	if(booleanArr[str]){
		document.getElementById(str+'On').setAttribute('disabled','disabled');
		document.getElementById(str+'Off').removeAttribute('disabled');
		document.getElementById(str+'Status').innerHTML='開啟';
	}else{
		document.getElementById(str+'Off').setAttribute('disabled','disabled');
		document.getElementById(str+'On').removeAttribute('disabled');
		document.getElementById(str+'Status').innerHTML='關閉';
	}
}

function changeCheckBoxState(str){
	document.getElementById(str).checked=booleanArr[str];
}

function btnClick(str,stat){
	var booleanStat = (stat == 'On') ? true : false;
	var storgeArr = '{"'+str+'":'+booleanStat+'}';
	booleanArr[str] = booleanStat;
	chrome.storage.local.set(JSON.parse(storgeArr));
	changeBtnState(str);
}

function checkBoxClick(str,stat){
	var storgeArr = '{"'+str+'":'+stat+'}';
	booleanArr[str] = stat;
	chrome.storage.local.set(JSON.parse(storgeArr));
}

function makeFunBtnClick(str,stat){
	return function(){
		btnClick(str,stat);
	}
}

var booleanArr = new Array();
chrome.storage.local.get(null,function(item){
	if(isEmpty(item)){
		chrome.storage.local.set({titleNumbers:false});
		chrome.storage.local.set({titleNumbersCheckNotice:false});
		chrome.storage.local.set({titleNumbersCheckSubscript:false});
		chrome.storage.local.set({titleNumbersCheckRecommend:false});
		chrome.storage.local.set({singleACMsgReverse:false});
		chrome.storage.local.set({replyDivWordCount:false});
		chrome.storage.local.set({bookMarkBtn:false});
		chrome.storage.local.set({bookMarkIndex:new Array()});
		booleanArr['titleNumbers'] = false;
		booleanArr['singleACMsgReverse'] = false;
		booleanArr['replyDivWordCount'] = false;
		booleanArr['bookMarkBtn'] = false;
		booleanArr['titleNumbersCheckNotice'] = false;
		booleanArr['titleNumbersCheckSubscript'] = false;
		booleanArr['titleNumbersCheckRecommend'] = false;
	}else{
		booleanArr['titleNumbers'] = item['titleNumbers'];
		booleanArr['singleACMsgReverse'] = item['singleACMsgReverse'];
		booleanArr['replyDivWordCount'] = item['replyDivWordCount'];
		booleanArr['bookMarkBtn'] = item['bookMarkBtn'];
		booleanArr['titleNumbersCheckNotice'] = item['titleNumbersCheckNotice'];
		booleanArr['titleNumbersCheckSubscript'] = item['titleNumbersCheckSubscript'];
		booleanArr['titleNumbersCheckRecommend'] = item['titleNumbersCheckRecommend'];
	}
	changeBtnState('titleNumbers');
	changeBtnState('singleACMsgReverse');
	changeBtnState('replyDivWordCount');
	changeBtnState('bookMarkBtn');
	changeCheckBoxState('titleNumbersCheckNotice');
	changeCheckBoxState('titleNumbersCheckSubscript');
	changeCheckBoxState('titleNumbersCheckRecommend');
	
	document.getElementById('titleNumbersOn').addEventListener('click',makeFunBtnClick('titleNumbers','On'));
	document.getElementById('singleACMsgReverseOn').addEventListener('click',makeFunBtnClick('singleACMsgReverse','On'));
	document.getElementById('replyDivWordCountOn').addEventListener('click',makeFunBtnClick('replyDivWordCount','On'));
	document.getElementById('bookMarkBtnOn').addEventListener('click',makeFunBtnClick('bookMarkBtn','On'));

	document.getElementById('titleNumbersOff').addEventListener('click',makeFunBtnClick('titleNumbers','Off'));
	document.getElementById('singleACMsgReverseOff').addEventListener('click',makeFunBtnClick('singleACMsgReverse','Off'));
	document.getElementById('replyDivWordCountOff').addEventListener('click',makeFunBtnClick('replyDivWordCount','Off'));
	document.getElementById('bookMarkBtnOff').addEventListener('click',makeFunBtnClick('bookMarkBtn','Off'));
	
	document.getElementById('titleNumbersCheckNotice').addEventListener("change", function(event){
		checkBoxClick('titleNumbersCheckNotice',event.target.checked);
	});
	document.getElementById('titleNumbersCheckSubscript').addEventListener("change", function(event){
		checkBoxClick('titleNumbersCheckSubscript',event.target.checked);
	});
	document.getElementById('titleNumbersCheckRecommend').addEventListener("change", function(event){
		checkBoxClick('titleNumbersCheckRecommend',event.target.checked);
	});
	
	
	for (i = 0; i < item['bookMarkIndex'].length; i++) {
		var indexStr = item['bookMarkIndex'][i];
		var Msgid = indexStr.split('-')[0];
		var gid = indexStr.split('-')[1];
		var trStr = '<tr id="'+indexStr+'"><td>'+item['bookmarkName-'+Msgid]+'</td><td>'+
					'<button type="button" class="btn btn-primary btn-sm" id="'+'link'+Msgid+'-'+gid+'" hrf="http://guild.gamer.com.tw/singleACMsg.php?sn='+Msgid+'&gsn='+gid+'">移至該頁</button>'+
					'<button type="button" class="btn btn-danger btn-sm" id="'+'delete'+Msgid+'-'+gid+'" gid="'+gid+'" msgid="'+Msgid+'">刪除書籤</button>'+
					'</td></tr>';
		document.getElementById('bookMarkContent').innerHTML += trStr;
		document.getElementById('link'+Msgid+'-'+gid).addEventListener('click',function(event){
			chrome.tabs.create({ url: event.target.getAttribute('hrf') });
		});
		document.getElementById('delete'+Msgid+'-'+gid).addEventListener('click',function(event){
			chrome.storage.local.remove('bookmarkName-'+event.target.getAttribute('msgid'));
			chrome.storage.local.remove('bookmark-'+event.target.getAttribute('msgid'));
			var delIndexStr = event.target.getAttribute('msgid') + '-' + event.target.getAttribute('gid');
			item['bookMarkIndex'].splice( item['bookMarkIndex'].indexOf(delIndexStr), 1 );
			document.getElementById(delIndexStr).id = 'delIndex';
			chrome.storage.local.set({bookMarkIndex:item['bookMarkIndex']},function(){
				document.getElementById('bookMarkContent').removeChild(document.getElementById('delIndex'));
			});
		});
	}
	
});

