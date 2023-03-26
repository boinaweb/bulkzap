/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
var numeroJanela = -1;
var whatsapp_tab_id = -1;
var telefones_permitidos = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("\n\n\n------------------------------------init-----------------------------------------------");

	switch(request.type){
		case "button_sendAutoAll":
			sendToAllContactsAuto(request);
			break;
		case "button_sendManualAll":
			sendToAllContactsManual(request);
			break;
		case "button_openTabWhatsapp":
			abrirAbaWhatsapp();
			break;
	}
});

chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'js/wapi.js'
	});
});




chrome.runtime.onStartup.addListener(function () {
	console.log("Plugin Startup");			

});

chrome.runtime.onInstalled.addListener(function () {
	console.log("Plugin installed");
	 inicializarTabs();
});


function inicializarTabs() {
	whatsapp_tab_id = -1;
	numeroJanela = -1;
	var abas = new Array();

	chrome.windows.getCurrent(function(win) {
    	chrome.tabs.getAllInWindow(win.id, function(tabs) {
	        abas = tabs;
			console.debug(abas);

			var i;
			for (i = 0; i < abas.length; i++) {
				var aba = abas[i];
			    if (~aba.url.indexOf("web.whatsapp.com")) {
			    	whatsapp_tab_id = aba.id;
			    }
		  	}

			if (whatsapp_tab_id == -1) {
				chrome.tabs.create({ url: 'https://web.whatsapp.com/', index : 1});
			} else {
				chrome.tabs.update(whatsapp_tab_id,{url:"https://web.whatsapp.com"});
			}

		});
	});
}

chrome.webNavigation.onCompleted.addListener(function(details) {
	if (~details.url.indexOf("https://web.whatsapp.com/")) {
		console.log("Open page - web.whatsapp.com");	
		whatsapp_tab_id = details.tabId;
		chrome.tabs.executeScript(details.tabId, {file: "js/content.js"});
	}
});


function clientMessage(data, funcPre = () => {}) {
	funcPre();
	chrome.tabs.sendMessage(whatsapp_tab_id, data);
}

chrome.runtime.onMessage.addListener(function(data, sender) {
	if (sender.tab) {
		switch(data.type) {
		  case "init":
		    console.log('Init received on page whatsapp');
		    init();
		    break;
		  case "logout":
		    console.log('Logout received on page whatsapp');
		    logout();
		    break;
		  case "start":
		  	console.log('Start received on page whatsapp');
		    start();
		    break;
		  case "pause":
		    console.log('Pause received on page whatsapp');
		    pause();
		    break;
		  default:
		}
	}
});

function cheksIsNotNull(obj) {
  return obj !== null && obj !== undefined;
}

function sendToAllContactsManual(data){
	const {message, image} = data;
	data.typestart = 'sendToAllContactsManual';
	console.log('sendToAllContactsMBackground', message, image);
	clientMessage(data);
}

function sendToAllContactsAuto(data){
	const {message, image} = data;
	data.typestart = 'sendToAllContactsAuto';
	console.log('sendToAllContactsABackground', message, image);
	clientMessage(data);
}

function sendMessage(message, remetente){
	var json = {"type" : "text", "numberPhone" : remetente, "message" : message};
	clientMessage(json);
}

function sendMidia(message, remetente, base64){
	var json = {"type" : "media", "numberPhone" : remetente, "message" : message, "image":base64};
	clientMessage(json);
}

function init() {
	if (localStorage.getItem('pause')) {
		pause();
	} else{
		start();
		setTimeout(sendWaitMessage,5000);
	}
}

function sendWaitMessage() {
	clientMessage({typestart : "waitformessage"});
}

function start() {
	console.log("logged");
	clientMessage({typestart : "logged"}, () => localStorage.removeItem('pause'));
}

function pause() {
	clientMessage({typestart : "paused"}, () => localStorage.setItem('pause', true));
}

function logout() {
	console.log("logout")
}



function abrirAbaWhatsapp(){
	whatsapp_tab_id = -1;
	var abas = new Array();
	chrome.windows.getCurrent(function(win) {
    	chrome.tabs.getAllInWindow(win.id, function(tabs) {
	        abas = tabs;
			console.debug(abas);
			var i;
			for (i = 0; i < abas.length; i++) {
				var aba = abas[i];
			    if (~aba.url.indexOf("web.whatsapp.com")) {
			    	whatsapp_tab_id = aba.id;
			    }
			  }
		  	if (whatsapp_tab_id == -1) {
				chrome.tabs.create({ url: 'https://web.whatsapp.com/', index : 1}, function(abaId) {whatsapp_tab_id = abaId;});		
			} else {
				chrome.tabs.get(whatsapp_tab_id, function(tab) {
					chrome.tabs.highlight({'tabs': tab.index}, function() {});
				})
			}

		});
	});
}





/******/ })()
;
//# sourceMappingURL=background.js.map