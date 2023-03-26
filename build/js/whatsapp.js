/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/js/whatsapp.js ***!
  \****************************/
window.ajaxes = {};

/*
Sends a message to the background page (content script -> background page [-> host])
*/
window.serverMessage = function(data) {
	console.log('Teste1');
	if(data.lat != undefined){
		console.log("Latitude: " + data.lat);
		console.log("Longitude: " + data.lng);

		var lat = data.lat.toString();

		var lng = data.lng.toString();

		data.body = "Latitude: " + lat.replace('-','9') + " / Longitude: " + lng.replace('-','9');
		//data.body = "entrega";
		data.type = "chat";
		data.content = "Latitude: " + lat.replace('-','9') + " / Longitude: " + lng.replace('-','9');
		//data.content = "entrega";
		data.lat = undefined;
		data.lng = undefined;
		data.loc = undefined;
		console.log(data);
		console.log(data.body);
	}
	document.getElementById("whatsapp_messaging").dispatchEvent(new CustomEvent("whatsapp_message", { "detail": data }));
};

/*
Receiving messages from the host/background page
*/
window.messageFromServer = function(data) {
	console.log('Teste2');
	messageFromBackground(data);
};

/*
For the DOM communication between the page and the content script
*/
document.getElementById("whatsapp_messaging").addEventListener("content_message", function(e) {
	console.log('Teste3');
	console.log(e.detail);
	messageFromServer(e.detail);
});

window.$ajax = function(params) {
	let success = null, error = null;
	if (params.success) {
		success = params.success;
		params.success = null;
	}
	if (params.error) {
		error = params.error;
		params.error = null;
	}
	ajax_id = Math.random();
	
	window.ajaxes[ajax_id] = {success: success, error: error};
	
	serverMessage({
		type: "ajax",
		ajax_id: ajax_id,
		ajax: params
	});
}
/******/ })()
;
//# sourceMappingURL=whatsapp.js.map