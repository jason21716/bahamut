var configArr;
ORGINAL_TITLE = document.title;
NEW_TITLE = document.title;

function addBtnEditTitle(){
	//增加修改網頁標題功能
	var BH_menuE_appendDOM_link = document.createElement("a");
	BH_menuE_appendDOM_link.innerHTML = "更改網頁標題";
	var BH_menuE_appendDOM = document.createElement("li");
	BH_menuE_appendDOM.appendChild(BH_menuE_appendDOM_link);
	document.getElementsByClassName('BH-menuE')[0].appendChild(BH_menuE_appendDOM);
	BH_menuE_appendDOM_link.addEventListener("click", changePageTitle);
}

chrome.storage.local.get(null,function(item){
	configArr = item;





	//Message alert on title
	if(item['titleNumbers'] === true){
		title_msgChange(NEW_TITLE,configArr['titleNumbersCheckNotice']
					,configArr['titleNumbersCheckSubscript'],configArr['titleNumbersCheckRecommend']);
		document.getElementById('BH-top-data').addEventListener("DOMSubtreeModified", function(event){
			title_msgChange(NEW_TITLE,configArr['titleNumbersCheckNotice']
					,configArr['titleNumbersCheckSubscript'],configArr['titleNumbersCheckRecommend']);
		});
	}

	//who are you?
	var selfDOM = document.getElementsByClassName('TOP-my')[0].getElementsByTagName('li')[3].childNodes[0];
	var selfDOMMatch = selfDOM.href.match(/https\:\/\/home\.gamer\.com\.tw\/([a-z A-Z 0-9]*)/);
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
		addBtnEditTitle();

		//抓取MsgId、guildId
		var singleACMsgParme = getSingleACMsgParmeString(pageName[1]);
		var MsgId = singleACMsgParme[0];
		var guildId = singleACMsgParme[1];
		configArr['MsgId'] = MsgId;
		configArr['guildId'] = guildId;

		//增加JSON上傳功能
		if(configArr['uploadJsonKey'] !== null && configArr['uploadJsonKey']!== ""){
			var BH_menuE_appendDOM_uploadJson_link = document.createElement("a");
			BH_menuE_appendDOM_uploadJson_link.innerHTML = "上傳至暫存空間(活動組專用)";
			var BH_menuE_appendDOM_uploadJson = document.createElement("li");
			BH_menuE_appendDOM_uploadJson.appendChild(BH_menuE_appendDOM_uploadJson_link);
			document.getElementsByClassName('BH-menuE')[0].appendChild(BH_menuE_appendDOM_uploadJson);
			BH_menuE_appendDOM_uploadJson_link.addEventListener("click", uploadJsonFunt);
		}
		//新增右側部分檢視區塊
		addRightContent();


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

			if(configArr['replyDivCutting']===true){
				var funBtn = function(id,gid){ return function(){ checkReplyLongTextFix(id,'#GID'+gid);}; };
				var funMsg = function(e,a,id,gid){ return function(){ enterkeyLongTextFix(e,a,'reply',id,'#GID'+gid);}; };
			}else{
				var funBtn = function(id,gid){ return function(){ checkReplyFix(id,'#GID'+gid);}; };
				var funMsg = function(e,a,id,gid){ return function(){ enterkeyFix(e,a,'reply',id,'#GID'+gid);}; };
			}

			//重建replyMsg，清除先前的onkeypress事件
			document.getElementById('replyDiv'+MsgId).removeChild(document.getElementById('replyMsg'+MsgId));
			var BH_replyDiv_DOM = document.createElement("textarea");
			BH_replyDiv_DOM.id = 'replyMsg'+MsgId;
			BH_replyDiv_DOM.setAttribute("rows", "1");
			document.getElementById('replyDiv'+MsgId).insertBefore(BH_replyDiv_DOM,document.getElementById('emo'+MsgId));

			document.getElementById('bahaext-replyBtn'+MsgId).addEventListener("click", funBtn(MsgId,guildId));
			document.getElementById('replyMsg'+MsgId).addEventListener("keypress", funMsg(event,document.getElementById('replyMsg'+MsgId),MsgId,guildId));
		}

		//新增監聽Mmessage事件
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log('message received:' +request.message +' /' + request.text);
			if (request.message == "fastResponse"){
				fastResponseFunt(MsgId,request.text);
			}
		});

		//修改右鍵選單
		document.getElementById('replyDiv'+MsgId).className = 'context-menu-replyDiv';
		$(function() {
			$.contextMenu({
				selector: '.context-menu-replyDiv',
				callback: function(key, options) {
					fastResponseFunt(MsgId,configArr[key]);
				},
				items: {
					"clean":{
						"name": "清空內容",
						"icon": function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; },
						"callback":function(key, options) {
							document.getElementById('replyMsg'+MsgId).value='';
							document.getElementById('replyMsg'+MsgId).focus();
						}
					},
					"fastResponse": {
						"name": "快速回覆...",
						"icon": "edit",
						"items": {
							"fastResponse1": {"name": configArr['fastResponse1name']},
							"fastResponse2": {"name": configArr['fastResponse2name']},
							"fastResponse3": {"name": configArr['fastResponse3name']},
							"fastResponse4": {"name": configArr['fastResponse4name']},
							"fastResponse5": {"name": configArr['fastResponse5name']},
							"fastResponse6": {"name": configArr['fastResponse6name']},
							"fastResponse7": {"name": configArr['fastResponse7name']},
							"fastResponse8": {"name": configArr['fastResponse8name']}
						}
					}
				}
			});
		});

		//增加字數提示訊息，新增監聽事件
		if(configArr['replyDivWordCount'] === true ){
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
					if(configArr['replyDivCutting']===false){
						msgBox.style.borderColor = 'red';
						msgBox.style.borderWidths = '2pt';
						msgBox.style.backgroundColor = '#D2B7B7';
						document.getElementById('bahaext-wordCount').innerHTML = '  已超過字數限制';
					}else{
						msgBox.style.borderColor = 'red';
						msgBox.style.borderWidths = '2pt';
						document.getElementById('bahaext-wordCount').innerHTML = '  已超過一串之字數，將會切串後發送';
					}

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
			setAllBookMarkBtn();
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

			//確認是否為該串擁有者
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
			var autoRefreshInput2Dom = document.createElement('input');
			autoRefreshInput2Dom.id = 'baha-autoRefreshCheck';
			autoRefreshInput2Dom.type = 'checkbox';
			var autoRefreshStr3Dom = document.createElement('p');
			autoRefreshStr3Dom.innerHTML = '啟動桌面通知功能';
			autoRefreshStr3Dom.style.display = 'inline';
			var autoRefreshInput3Dom = document.createElement('input');
			autoRefreshInput3Dom.id = 'baha-autoRefreshHiSpeedCheck';
			autoRefreshInput3Dom.type = 'checkbox';
			var autoRefreshStr4Dom = document.createElement('p');
			autoRefreshStr4Dom.innerHTML = '啟動長串更新機制';
			autoRefreshStr4Dom.style.display = 'inline';
			var autoRefreshBtn2Dom = document.createElement('button');
			autoRefreshBtn2Dom.innerHTML = '整串手動重整';
			autoRefreshBtn2Dom.id = 'baha-manuelRefreshBtn';
			autoRefreshBtn2Dom.setAttribute('Msgid',MsgId);
			autoRefreshBtn2Dom.style.width='100px';
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStrDom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInputDom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshBtnDom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr2Dom);
			document.getElementById('baha-autoRefreshDiv').appendChild(document.createElement('br'));
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInput2Dom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr3Dom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInput3Dom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr4Dom);
			document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshBtn2Dom);
			document.getElementById('baha-autoRefreshBtn').addEventListener('click',setAutoRefresh);
			document.getElementById('baha-manuelRefreshBtn').addEventListener('click',function(){
				reGenerateReply(true,new Array(),new Array());
			});
		}

		$('#allReply'+MsgId).on('click','.baha-boonMarkBtn',function(event){
			console.log('bookmark clicked.')
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
	else if(pageName[0] == "guild"){
		addBtnEditTitle();

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
