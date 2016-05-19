

chrome.storage.local.get(null,function(item){

	//Message alert on title
	if(item['titleNumbers'] === true){
		var title = document.title;
		title_msgChange(title,item['titleNumbersCheckNotice']
					,item['titleNumbersCheckSubscript'],item['titleNumbersCheckRecommend']);
		document.getElementById('BH-top-data').addEventListener("DOMSubtreeModified", function(event){
			title_msgChange(title,item['titleNumbersCheckNotice']
					,item['titleNumbersCheckSubscript'],item['titleNumbersCheckRecommend']);
		});
	}

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
		
		
		//倒轉replyAll與調整replyDiv位置
		if(item['singleACMsgReverse'] === true){
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
		if(item['replyDivWordCount'] === true){
			var wordCountDOM = document.createElement("span");
			wordCountDOM.id = 'bahaext-wordCount';
			wordCountDOM.style.color = 'red';
			document.getElementsByClassName('msgitembar')[0].appendChild(wordCountDOM);
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
		if(item['bookMarkBtn'] === true){
			var replyMsgHistoryArr = document.getElementsByClassName('msgreport');
			for (i = 0; i < replyMsgHistoryArr.length; i++) {
				var newItem = document.createElement("div");
				var MsgReid = replyMsgHistoryArr[i].id;
				newItem.id = 'baha-bookMark-'+MsgReid;
				newItem.className = 'baha-boonMarkBtn';
				newItem.innerHTML = '設為書籤';
				newItem.setAttribute('guildId',guildId);
				newItem.setAttribute('Msgid',MsgId);
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
					});
					if(isEmpty(item['bookMarkIndex'])){
						bookMarkIndexArr = new Array(event.target.getAttribute('Msgid')+'-'+event.target.getAttribute('guildId'));
						chrome.storage.local.set({bookMarkIndex:bookMarkIndexArr});
					}else if(item['bookMarkIndex'].indexOf(event.target.getAttribute('Msgid')+'-'+event.target.getAttribute('guildId')) == -1){
						item['bookMarkIndex'].push(event.target.getAttribute('Msgid')+'-'+event.target.getAttribute('guildId'));
						chrome.storage.local.set({bookMarkIndex:item['bookMarkIndex']});
					}
					
				});
			}
			var sheet = document.createElement('style')
			sheet.innerHTML = ".baha-boonMarkBtn {float:right; border-width:1px; border-color:black;border-style: inset;background-color: #ffffff;padding: 3px; display:none; margin-left: 10px !important; width: 50px; height: 30px;text-align: center; line-height: 30px !important;} .baha-boonMarkBtn:hover {color:red;}";
			document.body.appendChild(sheet);
		}
		//回朔書籤位置
		if(item['bookmark-'+MsgId] !== undefined){
			document.getElementById(item['bookmark-'+MsgId]).style.backgroundColor='#D0B7C5';
		}
	}
	else if(pageName[0] == "guild"){
		//增加字數提示訊息，新增監聽事件
		if(item['replyDivWordCount'] === true){
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

