var configArr;

chrome.storage.local.get(null,function(item){
	configArr = item;
	
	//Message alert on title
	if(item['titleNumbers'] === true){
		var title = document.title;
		title_msgChange(title,configArr['titleNumbersCheckNotice']
					,configArr['titleNumbersCheckSubscript'],configArr['titleNumbersCheckRecommend']);
		document.getElementById('BH-top-data').addEventListener("DOMSubtreeModified", function(event){
			title_msgChange(title,configArr['titleNumbersCheckNotice']
					,configArr['titleNumbersCheckSubscript'],configArr['titleNumbersCheckRecommend']);
		});
	}

	//who are you?
	var selfDOM = document.getElementsByClassName('TOP-my')[0].getElementsByTagName('li')[3].childNodes[0];
	var selfDOMMatch = selfDOM.href.match(/http\:\/\/home\.gamer\.com\.tw\/([a-z A-Z 0-9]*)/); 
	configArr['controller'] = selfDOMMatch[1];
	console.log(configArr['controller']);
	//
	
	//網址解析
	var urls = getDomainFromUrl(window.location.href);
	var pageName = getPHPFileNameString(urls[1]);
	console.log(urls[0]+" "+urls[1]);
	console.log(pageName[0]+" "+pageName[1]);

	//singleACMsg頁面行為
	if(pageName[0] == "singleACMsg"){
		//抓取MsgId、guildId
		var singleACMsgParme = getSingleACMsgParmeString(pageName[1]);
		var MsgId = singleACMsgParme[0];
		var guildId = singleACMsgParme[1];
		configArr['MsgId'] = MsgId;
		configArr['guildId'] = guildId;

		//倒轉replyAll與調整replyDiv位置
		if(configArr['singleACMsgReverse'] === true){			
			var replyArr = copyReply(MsgId);
			reverseReply(replyArr,MsgId);
			
			//改寫送出按鍵與replyMsg中keypress事件，解決疊樓異常問題
			var replyBtnDOM = document.createElement("button");
			replyBtnDOM.id = 'bahaext-replyBtn'+MsgId;
			replyBtnDOM.innerHTML = '叭啦';
			document.getElementById('replyDiv'+MsgId).removeChild(document.getElementById('replyBtn'+MsgId));
			document.getElementById('replyDiv'+MsgId).appendChild(replyBtnDOM);
			var funBtn = function(id,gid){ return function(){ checkReplyFix(id,'#GID'+gid);}; };
			var funMsg = function(e,a,id,gid){ return function(){ enterkeyFix(e,a,'reply',id,'#GID'+gid);}; };
			document.getElementById('bahaext-replyBtn'+MsgId).addEventListener("click", funBtn(MsgId,guildId));
			document.getElementById('replyMsg'+MsgId).addEventListener("keypress", funMsg(event,this,MsgId,guildId));
		}
		
		
		//增加字數提示訊息，新增監聽事件
		if(configArr['replyDivWordCount'] === true){
			var wordCountDOM = document.createElement("span");
			wordCountDOM.id = 'bahaext-wordCount';
			wordCountDOM.style.color = 'red';
			if(configArr['singleACMsgReverse'] === true)
				document.getElementsByClassName('msgitembar')[0].appendChild(wordCountDOM);
			else
				document.getElementById('replyDiv'+MsgId).appendChild(wordCountDOM);
			document.getElementById('replyMsg'+MsgId).addEventListener("input", function(){
				var msgBox = document.getElementById('replyMsg'+MsgId);
				if(countLimitFix(msgBox,85) < 0){
					msgBox.style.borderColor = 'red';
					msgBox.style.borderWidths = '2pt';
					msgBox.style.backgroundColor = '#D2B7B7';
					document.getElementById('bahaext-wordCount').innerHTML = '  已超過字數限制';
				}else{
					msgBox.style.borderColor = '';
					msgBox.style.borderWidths = '';
					msgBox.style.backgroundColor = '';
					var leftWord = Math.round((255-countLimitFix(msgBox,85))/3);
					document.getElementById('bahaext-wordCount').innerHTML = '  剩餘'+leftWord+'字元';
				}
			});
			
			
		}
		
		//新增書籤標記按鈕
		if(configArr['bookMarkBtn'] === true){
			setBookMarkBtn();
			var sheet = document.createElement('style');
			sheet.innerHTML = ".baha-boonMarkBtn {float:right; border-width:1px; border-color:black;border-style: inset;background-color: #ffffff;padding: 3px; display:none; margin-left: 10px !important; width: 50px; height: 30px;text-align: center; line-height: 30px !important;} .baha-boonMarkBtn:hover {color:red;}";
			document.body.appendChild(sheet);
		}
		//回朔書籤位置
		if(configArr['bookmark-'+MsgId] !== undefined){
			bookMarkChangeColor(configArr['bookmark-'+MsgId]);
		}
		//增加定時更新設定欄
		var autoRefreshDivDom = document.createElement('div');
		autoRefreshDivDom.id = 'baha-autoRefreshDiv';
		if(configArr['singleACMsgReverse'] === true){
			document.getElementsByClassName('msgright')[0].insertBefore(autoRefreshDivDom, document.getElementById('allReply'+MsgId));
		}else{
			document.getElementsByClassName('msgright')[0].appendChild(autoRefreshDivDom);
		}
		
		var msgrightDOM = document.getElementsByClassName('msgright')[0];
		var msgControllerDOM = msgrightDOM.getElementsByTagName('a')[0];
		var isOwner;
		if(msgControllerDOM.textContent == '刪除'){
			isOwner = true;
			configArr['isOwner'] = isOwner;
		}
		else{
			var msgControllerDOMMatch = msgControllerDOM.href.match(/https\:\/\/home\.gamer\.com\.tw\/home\.php\?owner\=([a-z A-Z 0-9]*)/); 
			var msgController = msgControllerDOMMatch[1];
			console.log(msgController);
			console.log(msgController);
			isOwner = false;
		}
		configArr['isOwner'] = isOwner;
		
		var mainText = msgrightDOM.textContent;
		if(mainText.indexOf('[[STOP-AUTO-REFRESH]]') == -1 || configArr['isOwner']){
			var autoRefreshStrDom = document.createElement('p');
			autoRefreshStrDom.innerHTML = '設定自動更新時間(秒，0為取消)：';
			autoRefreshStrDom.style.display = 'inline';
			var autoRefreshInputDom = document.createElement('input');
			autoRefreshInputDom.type = 'text';
			autoRefreshInputDom.id = 'baha-autoRefreshInput';
			autoRefreshInputDom.style.width = '50px';
			autoRefreshInputDom.style.fontSize = '14px';
			autoRefreshInputDom.style.marginLeft = '5px';
			autoRefreshInputDom.style.marginRight = '5px';
			var autoRefreshBtnDom = document.createElement('button');
			autoRefreshBtnDom.innerHTML = '送出';
			autoRefreshBtnDom.id = 'baha-autoRefreshBtn';
			autoRefreshBtnDom.setAttribute('Msgid',MsgId);
			var autoRefreshStr2Dom = document.createElement('p');
			autoRefreshStr2Dom.id = 'baha-autoRefreshStr';
			autoRefreshStr2Dom.innerHTML = '';
			autoRefreshStr2Dom.style.display = 'inline';
			autoRefreshStr2Dom.style.color = 'red';
			autoRefreshStr2Dom.style.marginLeft = '5px';
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStrDom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInputDom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshBtnDom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr2Dom);
			document.getElementById('baha-autoRefreshBtn').addEventListener('click',setAutoRefresh);
		}
	}
	else if(pageName[0] == "guild"){
		//增加字數提示訊息，新增監聽事件
		if(configArr['replyDivWordCount'] === true){
			var msgWordCountDOM = document.createElement("span");
			msgWordCountDOM.id = 'bahaext-msgWordCount';
			msgWordCountDOM.className = 'ST3';
			msgWordCountDOM.style.color = 'red';
			document.getElementById('msgbox1sel').appendChild(msgWordCountDOM);
			document.getElementById('msgtalk').addEventListener("input", function(){
				var msgBox = document.getElementById('msgtalk');
				if(countLimitFix(msgBox,600) < 0){
					msgBox.style.borderColor = 'red';
					msgBox.style.borderWidths = '2pt';
					msgBox.style.backgroundColor = '#D2B7B7';
					document.getElementById('bahaext-msgWordCount').innerHTML = '  已超過字數限制';
				}else{
					msgBox.style.borderColor = '';
					msgBox.style.borderWidths = '';
					msgBox.style.backgroundColor = '';
					var leftWord = Math.round((1800-countLimitFix(msgBox,600))/3);
					document.getElementById('bahaext-msgWordCount').innerHTML = '  剩餘'+leftWord+'字元';
				}
			});
		
		}
	}

});

