/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
window.onload = function() {
	// document.getElementById("verspan").innerHTML = chrome.runtime.getManifest().version;
	console.log('eventos definidos');
	if(document.getElementById('desconectar')  != null){
		document.getElementById('desconectar').addEventListener('click', logout());
	}
	if(document.getElementById('conectar') != null){
		document.getElementById('conectar').addEventListener('click', login());
	}
};

/////////---///////////
document.querySelectorAll("input[name='sendratio']").forEach((input) => {
	input.addEventListener('change', checkbuttonsratio);
});
document.querySelectorAll("input[name='sendratiomodesend']").forEach((input) => {
	input.addEventListener('change', checkbuttonsratiomodesend);
});

document.getElementById("select-type-button-send").addEventListener('change', selectvalue_send_type);
function handleFiles(evt) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
		var f = evt.target.files[0];
        getAsText(f);
    } else {
        alert('FileReader are not supported in this browser.');
    }
  }

  function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
  }

  function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
	document.getElementById("numberslist").value = csv;
  }

  function processData(csv) {
      var allTextLines = csv.split(/\r\n|\n/);
      var lines = [];
      for (var i=0; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
              var tarr = [];
              for (var j=0; j<data.length; j++) {
                  tarr.push(data[j]);
              }
              lines.push(tarr);
              tarr.push('\n');
      }
	  sessionStorage.setItem("walistprepare", JSON.stringify(lines));
  }

  function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
  }
document.getElementById('inputCSV').addEventListener("change", handleFiles);
//////////////////

function checkbuttonsratio(valueBtn){
	if(valueBtn.target.id === "ativeautosend"){
		document.getElementById('autosend').style.display = 'block';
		document.getElementById('manualsend').style.display = 'none';
	}else{
		document.getElementById('autosend').style.display = 'none';
		document.getElementById('manualsend').style.display = 'block';
	}
}

function checkbuttonsratiomodesend(valueBtn){
	if(valueBtn.target.id === "mediaframe"){
		document.getElementById('frame-media-visible').style.display = 'block';
		document.getElementById('frame-button-visible').style.display = 'none';
	}else{
		document.getElementById('frame-media-visible').style.display = 'none';
		document.getElementById('frame-button-visible').style.display = 'block';
	}
}

function selectvalue_send_type(valueType){
	var button1 = document.getElementById("buttonsd1");
	var button2 = document.getElementById("buttonsd2");
	var button3 = document.getElementById("buttonsd3");
	switch(valueType.target.value){
		case "urlvalue-btnsend":
			button1.placeholder = "Enter the text";
			button2.placeholder = "Enter the URL";
			button3.hidden = true;
			break;
		case "phonevalue-btnsend":
			button1.placeholder = "Enter the text";
			button2.placeholder = "Enter the phone";
			button3.hidden = true;
			break;
		case "responsevalue-btnsend":
			button1.placeholder = "Enter the text";
			button2.placeholder = "Enter the text (optional)";
			button3.hidden = false;
			button3.placeholder = "Enter the text (optional)";
			break;
	}
}


function login() {
	console.log('login');
	document.getElementById('loginTxt').disabled = true;
	document.getElementById('senhaTxt').disabled = true;
	document.getElementById('conectar').style.display = 'none';
	document.getElementById('desconectar').style.display = 'block';
	window.href = window.href;
}

function logout() {
	console.log('logout');
	document.getElementById('loginTxt').disabled = false;
	document.getElementById('senhaTxt').disabled = false;
	document.getElementById('conectar').style.display = 'block';
	document.getElementById('desconectar').style.display = 'none';
	window.href = window.href;
	
}
function sendMessageManual(){
	processData(document.getElementById('numberslist')?.value);
	var listanumbercsv = sessionStorage.getItem("walistprepare", "");
	chrome.runtime.sendMessage({
		type: "button_sendManualAll",
		message: document.getElementById('msgToSend')?.value, 
		image: document.getElementById('base64')?.value,
		buttons: {
			active: document.getElementById('frame-button-visible').style.display == "block",
			type: document.getElementById("select-type-button-send")?.value,
			button1:document.getElementById("buttonsd1")?.value,
			button2:document.getElementById("buttonsd2")?.value,
			button3:document.getElementById("buttonsd3")?.value,
		},
		test: document.querySelector('#teste')?.checked,
		listanumber: listanumbercsv,
		time: document.getElementById('my-slider').value,
	});
}

function sendMessageAuto(){
	chrome.runtime.sendMessage({
		type: "button_sendAutoAll", 
		message: document.getElementById('msgToSend')?.value, 
		image: document.getElementById('base64')?.value,
		buttons: {
			type: document.getElementById("select-type-button-send")?.value,
			button1:document.getElementById("buttonsd1")?.value,
			button2:document.getElementById("buttonsd2")?.value,
			button3:document.getElementById("buttonsd3")?.value,
		},
		whichContacts: 'chats',
		test: document.querySelector('#teste')?.checked ? true : false,
		notToday: document.getElementById('naoHoje')?.checked,
		whoWillSend: document.getElementById('quemVouMandar')?.value,
		time: document.getElementById('my-slider').value,
		amount: document.getElementById('quant').value,
	});
}


document.getElementById("buttonAlls").addEventListener("click",function(){
	const valueidauto = document.getElementById('autosend');
	const displayAuto = window.getComputedStyle(valueidauto).display;
	const valueidmanual = document.getElementById('manualsend');
	const displayManual = window.getComputedStyle(valueidmanual).display;
	console.log("value display auto:"+displayAuto)
	switch(displayAuto+"="+displayManual) {
		case 'block=none':
			console.log("autoactive");
			sendMessageAuto();
			break;
		case 'none=block':
			console.log("manualactive");
			sendMessageManual();
			break;
	}
});



document.getElementById("buttonWhatsapp").addEventListener("click",function(){
	chrome.runtime.sendMessage({type: "button_openTabWhatsapp",value:1});
});



if (window.File && window.FileReader && window.FileList && window.Blob) {
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
  } else {
	
  }
  
  /*function handleFileSelect(evt) {
	var f = evt.target.files[0]; // FileList object
	var reader = new FileReader();
	// Closure to capture the file information.
	reader.onload = (function(theFile) {
	  return function(e) {
		var binaryData = e.target.result;
		//Converting Binary Data to base 64
		var base64String = window.btoa(binaryData);
		console.log('base64String', base64String)
		//showing file converted to base64
		var base = "data:image/jpeg;base64,"+base64String;
		document.getElementById('base64').value = base
		document.getElementById('imagemPronta').src = base
		alert('File converted to base64 successfuly!\nCheck in Textarea');
	  };
	})(f);
	// Read in the image file as a data URL.
	reader.readAsBinaryString(f);
  }*/
  
  if (window.File && window.FileReader && window.FileList && window.Blob) {
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
  } else {
	
  }
  
  function handleFileSelect(evt) {
	var f = evt.target.files[0]; // FileList object
	var reader = new FileReader();
	// Closure to capture the file information.
	reader.onload = (function(theFile) {
	  return function(e) {
		var binaryData = e.target.result;
		//Converting Binary Data to base 64
		var base64String = window.btoa(binaryData);
		//showing file converted to base64
		var base = "data:"+f.type+";base64,"+base64String;
		document.getElementById('base64').value = base;
		if(f.type == "video/mp4"){
			document.getElementById('videoPronto').src = base;
			document.getElementById('videoPronto').style.display = 'block';
			document.getElementById('imagemPronta').style.display = 'none';
		}else{
			document.getElementById('imagemPronta').src = base;
			document.getElementById('imagemPronta').style.display = 'block';
			document.getElementById('videoPronto').style.display = 'none';
		}

	  };
	})(f);
	// Read in the image file as a data URL.
	reader.readAsBinaryString(f);
  }

  function tipoArquivo(){

  }
  

  document.getElementById("my-slider").addEventListener("change",function(){
	console.log("Change range");
	const mySlider = document.getElementById("my-slider");
	const sliderValue = document.getElementById("slider-value");
	mySlider.style.background = `linear-gradient(to right, #3264fe ${mySlider.value}%, #d5d5d5 ${mySlider.value}%)`;
	sliderValue.textContent = mySlider.value;
});
/******/ })()
;
//# sourceMappingURL=popup.js.map