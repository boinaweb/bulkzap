
var varWindow;



(function() {
	
	console.log('Starting...');
	setTimeout(init,6000);

})();

function init() {
	window.serverMessage({ type: "init"});	
}

function numberWhatsloggedIn(){	
	return window.Store.ProfilePicThumb._models[0].__x_id.user;
}
	
const sleep = ms => new Promise(res => setTimeout(res, ms*1000))



function messageFromBackground(data) {
	console.log("mensagemFromBackground -> " + JSON.stringify(data));

	if (data == null || data == undefined) {
		console.log("data is null -> mensagemFromBackground");
		return false;
	}

	switch(data.typestart) {
		  case "logged":
		    createDivLogged();
		    break;
		  case "paused":	  
		  	createDivPaused();
		    break;
		  case "err":
			console.log("err: " + data);
		  	break;
		  case "text":
		  	sendMessageText(data);
		    break;
		  case "media":
			sendMessageMedia(data);
			break;
		  case "script":
		  	executeScript(data);
		    break;
		  case "waitformessage":
			waitformessage();
		  	break;
		  case "sendToAllContactsAuto":
			sendToAllContactsAuto(data);
		  	break;
		  case "sendToAllContactsManual":
			sendToAllContactsManual(data);
			break;
		  default:
		    console.log("others: " + data);
	}
}

async function sendToAllContactsAuto({
	message, 
	image, 
	whichContacts, 
	test, 
	notToday, 
	time, 
	whoWillSend,
	amount,
	buttons
}) {
	injectWP();
	var all = [];
	var contato;
	const ultimoFoiHJ = localStorage.getItem('diaUltimoEnvio') == new Date().getDate();
	
	console.log('ultimoFoiHJ', ultimoFoiHJ);

	if(ultimoFoiHJ == false){

		if(whoWillSend === 'jaConversei'){
			all = window.WAPI.getAllChats();
		}else if(whoWillSend === 'jaConverseiContatoSalvo'){
			all = window.WAPI.getAllContacts();
		}else{
			all = window.WAPI.getAllChats();
		}
		
		console.log('allContacts', all);
		var numeros = [];
		let qtdAdicionada = 0;
		try{
		for (let index = all.length-1; index >= 0; index--) {
			const contato = all[index];
			if( (qtdAdicionada < amount) && contato && contato?.id && contato.id.server === "c.us"){
				const ultimaCv = new Date(new Date(WAPI.getChat(contato.id._serialized)?.msgs?._last?.__x_t).getTime() * 1000)
				if(ultimaCv.getDate() != new Date().getDate() || notToday == false){
					numeros.push(contato.id._serialized);
					console.log("contact add: "+contato.id._serialized)
					qtdAdicionada++;
				}
			}
		}
		}catch(e){
			console.log("Err: "+e);
		}
		console.log("Quantidade: "+numeros);
		localStorage.setItem('diaUltimoEnvio', new Date().getDate());
		localStorage.setItem('contatosEnviar', JSON.stringify(numeros));
	}

	console.log('numeros', all);
	console.log('enviarParaTodosContatosIzza', message, image);

	while(true){
		console.log("passou")
		if(localStorage.getItem('pause')){
			console.log("pausou")
			await sleep(1);
		}else{
			console.log("enviando")
			all = JSON.parse(localStorage.getItem('contatosEnviar'));
			if(all.length == 0){
				break;
			}

			const contato = all.pop();
			localStorage.setItem('contatosEnviar', JSON.stringify(all));
			if(image){
				if(test){
					console.log('enviouImagem', contato);
				}else{
					window.WAPI.sendImage(image, contato ,'media');
				}
				await sleep(3);
			}
			if (buttons?.active) {
				if (test) {
					console.log("sendbutton", contato)
				} else {
					var type = buttons?.type;
					if (type != null) {
						var options = [];
						switch (buttons.type) {
							case "urlvalue-btnsend":
								options.push({ "id": "1", "url": buttons.button2, "text": buttons.button1 });
								break;
							case "phonevalue-btnsend":
								options.push({ "id": "1", "phone": buttons.button2, "text": buttons.button1 });
								break;
							case "responsevalue-btnsend":
								options.push({ "id": "1", "reply": "", "text": buttons.button1 });
								options.push({ "id": "2", "reply": "", "text": buttons.button2 });
								options.push({ "id": "3", "reply": "", "text": buttons.button3 });
								break;
						}
						window.WAPI.sendButtons(number, messagerefactor, options, "");
					}
				}
			}

			if(test){
				console.log('enviouMensagem', contato);
			}else{
				window.WAPI.sendMessageToID(contato, message);
			}
			await sleep(time);
		}
	}
	
   
}



async function sendToAllContactsManual({
	message, 
	image,
	time,
	test,
	listanumber,
	buttons
}){
	injectWP();
	localStorage.removeItem('pause');
	console.log("list numbers: "+ listanumber);
	var lista = JSON.parse(listanumber);
	while(true){
		if(localStorage.getItem('pause')){
			console.log("pausou o sistema");
			await sleep(1);
		}else{
			if(lista.length == 0){
				break;
			}
			var item = lista.pop();
			await sleep(time);
			var numberPattern = /\d+/g;
			let number = item[1];
			if(!number.endsWith("@g.us") && !number.endsWith("@c.us")){
				if(number.length > 15){
					number = number.match(numberPattern).join('')+"@g.us";
				}else{
					number = number.match(numberPattern).join('')+"@c.us";
				}
			}
			let name = item[0];
			console.log("number: "+number+" "+"name: "+name);
			let messagerefactor = message.replaceAll("[[name]]", name);
			if(image){
				window.WAPI.sendImage(image, number, "", messagerefactor);
			}else if(buttons.active){
				var type = buttons?.type;
				if(type != null){
					var options = [];
					switch(buttons.type){
						case "urlvalue-btnsend":
							options.push({"id":"1","url":buttons.button2,"text":buttons.button1});
							break;
						case "phonevalue-btnsend":
							options.push({"id":"1","phone":buttons.button2,"text":buttons.button1});
							break;
						case "responsevalue-btnsend":
							options.push({"id":"1","reply":"","text":buttons.button1});
							options.push({"id":"2","reply":"","text":buttons.button2});
							options.push({"id":"3","reply":"","text":buttons.button3});
							break;
					}
					window.WAPI.sendButtons(number, messagerefactor, options, "");
				}
			}else{
				window.WAPI.sendMessageToID(number, messagerefactor);
			}
		}
	}
}

function waitformessage() {
	console.log('waitformessage');
	window.WAPI.waitNewMessages(false,proccessMessage);
}

function executeScript(data) {		
	console.log("Executing script on server." );	
	eval(data.message);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function sendMessageText(data) {
	var phone = data.numberPhone;

	//window.WAPI.sendMessageToID(data.numeroCelular, data.mensagem);
	if(phone.includes("@c.us")){
		window.WAPI.sendMessageToID(data.numberPhone, data.message);
	}else{
		window.WAPI.sendMessage(data.numberPhone, data.message);
	}
	
}

function sendMessageMedia(data) {
	var phone = data.numberPhone;
	var media = data.image;

	//window.WAPI.sendMessageToID(data.numeroCelular, data.mensagem);
	if(phone.includes("@c.us")){
		window.WAPI.sendImage(media, data.numberPhone, "", data.message);
	}else{
		window.WAPI.sendImage(media, data.numberPhone+"@c.us", "", data.message);
	}
	
}

function createDivPaused() {
	localStorage.setItem('pause', true);
	document.getElementById('divIzza').innerHTML = 'Boina Sender paused.&nbsp;&nbsp; ';
	document.getElementById('divIzza').style.backgroundColor = '#f6c23e';
	document.getElementById('divIzza').style.height = '30px';
	document.getElementById('divIzza').style.lineHeight = '30px';
	document.getElementById('divIzza').style.borderColor = '2px dashed #ffffff';
	var button = document.createElement('button');          
	var bText = document.createTextNode('Start');          
	button.appendChild(bText);        
	button.onclick = start;
	document.getElementById('divIzza').appendChild(button);
}

function createDivLogged() {
	localStorage.removeItem('pause');
	document.getElementById('divIzza').innerHTML = 'Boina Sender active.&nbsp;&nbsp; ';
	document.getElementById('divIzza').style.backgroundColor = '#1cc88a';
	document.getElementById('divIzza').style.height = '30px';
	document.getElementById('divIzza').style.lineHeight = '30px';
	document.getElementById('divIzza').style.borderColor = '2px dashed #fffffff';
	var button = document.createElement('button');          
	var bText = document.createTextNode('Pause');          
	button.appendChild(bText);        
	button.onclick = pause;
	document.getElementById('divIzza').appendChild(button);
}


function proccessMessage(data) {
	console.log('Message received: '+ data.length);
	var i;
	for (i = 0; i < data.length; i++) { 	
		window.serverMessage(data[i]);	
	}
}



function start() {
	window.serverMessage({ type: "start"});
}

function pause() {
	window.serverMessage({ type: "pause"});
}

function logout(silent) {
	if (!silent) {
		if (confirm('Tem certeza que deseja desativar o MV Bot?')) {
			alert('Você parou o MV Bot!'); 
			window.serverMessage({type: "logout"});
		}
	} else {
		window.serverMessage({type : "logout"});
	}
}

function shoot() {
	var mensagens = document.getElementById('txtMensagem');
	var numeros = document.getElementById('txtDestinos').value.split(",");

	var len = numeros.length; 
	for (var i = 0; i < len; i++)  {
		window.WAPI.sendMessage(mensagens, numeros[i]+'@c.us');
	}
}