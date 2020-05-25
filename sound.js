
var	audioFormat;

var hitSound = new SoundOverlapsClass("audio/hit");
var missSound = new SoundOverlapsClass("audio/miss");
var wallSound = new SoundOverlapsClass("audio/wall");


function setFormat() {
	var	audio	= new Audio();
	if	(audio.canPlayType("audio/mp3")) audioFormat = ".mp3";
	else audioFormat = ".ogg";
}

function SoundOverlapsClass(filenameWithPath)	{
		
	setFormat();
	
	var	mainSound	= new Audio(filenameWithPath+audioFormat);
	var	altSound	= new Audio(filenameWithPath+audioFormat);
	var	altSoundTurn	= false;
	
	this.play = function()	{
		if(altSoundTurn)	{
			altSound.currentTime	= 0;
			altSound.play();
		}	else	{
			mainSound.currentTime	= 0;
			mainSound.play();
		}
		altSoundTurn = !altSoundTurn;
	}
}

function playSoundAtInterval (sound, num, timesPerSecond) {
	var i = 0;
	var interv = setInterval(function(){
		sound.play();
		i++;
		if (i>=num) clearInterval(interv);
	}, 1000/timesPerSecond);
}

