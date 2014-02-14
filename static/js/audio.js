navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

var	timeHandler;
var context = new webkitAudioContext;
var overCount = 0;
var passCount = 0;
var hasStop   = true;
var hasListen = false;

function hasYell(){
	var yell = false;;
	if(passCount){
		yell = true;
		passCount = false;
	};
	return yell;
};

function displayWave (waveByteData) {
	for (var offset = 0; offset < waveByteData.length; ++offset) {

		var	height	= (0 - (waveByteData[offset] / 255 * 100));
		if(Math.abs(height)>70){
			++overCount;
		};
	}

	if(overCount>0){
		passCount = true;
		soundShow();
	}
	else{
		passCount = false;
	}
	overCount=0;
}

function soundShow (){
	document.getElementsByClassName("soundShow")[0].style.opacity = 1;
	var count = 100;
	var t = setInterval(function(){
		if(count<0){
			clearInterval(t);
		}
		else{
			document.getElementsByClassName("soundShow")[0].style.opacity = count/100.0;
		}
		--count;
	},1);
};

navigator.webkitGetUserMedia({audio: true}, function(stream) {
	hasListen = true;
  	var source = context.createMediaStreamSource(stream);
 	var	analyser		= context.createAnalyser();
	  // microphone -> filter -> destination.
  	source.connect(analyser);;
  	analyser.smoothingTimeConstant	= 0.85;
	analyser.connect(context.destination);
	var	timeHandler		= setInterval(function () {
		var	waveByteData	= new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteTimeDomainData(waveByteData);
		displayWave(waveByteData);
	}, 5);
}, onFailSoHard);