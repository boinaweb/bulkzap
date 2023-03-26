/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/js/content.js ***!
  \***************************/
(function() {	
	
	try {
		// For receiving messages from WhatsApp
		var messageFromClient = function(data) {
			try {
				console.log(data);
				//console.log('Teste6');
				chrome.runtime.sendMessage(data);
			} catch(e) {
				console.log(e);
				window.location.href = window.location.href;
			}
		};
		
		// Constructing a new messaging DOM element
		var messaging = document.createElement("div");
		messaging.id = "whatsapp_messaging";
		
		// Attaching a listener for messages from WhatsApp
		messaging.addEventListener("whatsapp_message", function(e) {
			//console.log('Teste8');
			//console.log(e);
			messageFromClient(e.detail);
		});
		
		// Injecting the element
		(document.head || document.documentElement).appendChild(messaging);
		
		// For sending messages to WhatsApp
		var clientMessage = function(data) {
			document.getElementById("whatsapp_messaging").dispatchEvent(new CustomEvent("content_message", { "detail": data }));
			//console.log('Teste7');
			//console.log(data);
		};
		
		// Listening for messages from background script
		chrome.runtime.onMessage.addListener(function(request, sender) {
			if (!sender.tab) {
				// Message from background script
				//console.log('Teste9');
				//console.log(JSON.stringify(request));
				clientMessage(request);			
			}
		});
		
		// Loading the API
		/*var el = document.createElement("script");
		el.src = chrome.extension.getURL("js/api.js");
		(document.head || document.documentElement).appendChild(el);*/

		console.log('Connecting....');

		var appDiv = document.querySelector("#app")
		appDiv.style.top = "25px"
		appDiv.style.height = "calc(100% - 25px)"
		//Create div indicating connected whatsapp
		//var windowWhatsapp = document.getElementById("app")
		var div = document.createElement( 'div' );
		//set attributes for div
		div.id = 'divIzza';
		div.style.position = 'fixed';
		div.style.top = '0';
		div.style.left = '0';
		div.style.width = '100%';   
		div.style.height = '30px';
	    div.style.lineHeight = '30px';
		//div.style.padding = '10px 0';
		div.style.backgroundColor = '#e74a3b';
		div.style.color = 'white';
		div.style.zIndex = '99999999999999999999999999';
		div.innerHTML = 'Connecting....'	
		div.style.textAlign = 'center';
		div.style.fontSize = '15px';
		//telaWhatsapp.style.top = "40px";
		

		//append all elements
		document.body.appendChild(div);

		// Loading the WhatsBot script
		var el = document.createElement("script");
		el.src = chrome.extension.getURL("js/whatsapp.js");
		(document.head || document.documentElement).appendChild(el);
			
		var el = document.createElement("script");
		el.src = chrome.extension.getURL("js/wapi.js");
		(document.head || document.documentElement).appendChild(el);

		var el = document.createElement("script");
		el.src = chrome.extension.getURL("js/dom.js");
		(document.head || document.documentElement).appendChild(el);
	
	} catch(e) {
		console.log("Error starting izza script - content.js");
		window.location.href = window.location.href;
	}
})();
/******/ })()
;
//# sourceMappingURL=content.js.map