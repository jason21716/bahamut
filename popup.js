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
document.getElementById('btnSetting').addEventListener('click',function(event){
	if (chrome.runtime.openOptionsPage) {
		// New way to open options pages, if supported (Chrome 42+).
		chrome.runtime.openOptionsPage();
	} else {
		// Reasonable fallback.
		window.open(chrome.runtime.getURL('options.html'));
	}
});

chrome.storage.local.get(null,function(item){	
	for (i = 0; i < item['bookMarkIndex'].length; i++) {
		var indexStr = item['bookMarkIndex'][i];
		var Msgid = indexStr.split('-')[0];
		var gid = indexStr.split('-')[1];
		var trStr = '<tr id="'+indexStr+'"><td>'+item['bookmarkName-'+Msgid]+'</td><td>'+
					'<button type="button" class="btn btn-primary btn-sm" id="'+'link'+Msgid+'-'+gid+'" hrf="http://guild.gamer.com.tw/singleACMsg.php?sn='+Msgid+'&gsn='+gid+'">移至該頁</button>'+
					'<button type="button" class="btn btn-danger btn-sm" id="'+'delete'+Msgid+'-'+gid+'" gid="'+gid+'" msgid="'+Msgid+'">刪除書籤</button>'+
					'</td></tr>';
		document.getElementById('bookMarkContent').innerHTML += trStr;
	}
	
	for(i = 0; i < item['bookMarkIndex'].length; i++){
		var indexStr = item['bookMarkIndex'][i];
		var Msgid = indexStr.split('-')[0];
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

