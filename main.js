//p.437
// sometimes a ball disappears from board but is still in array

var canvas, ctx;
var FPS = 60;

var InputIsSetUp = false;
var debuggingMode = true;

var game = {
	paused: false,
	stopped: true,
	over: false,
	reset(){
		if (!InputIsSetUp) setUpInput();
		if (!allPicsInitiated) initPics();
		score.reset();
		lives.reset();
	}
}

var round = {
	reset(){
		score.save();
		resetPaddles();
		resetBalls();
		resetBricks();
		resetBoni();
		game.stopped = true;
		balls[0].ballIsFrozen = true;
	},
	cleared(){
		playSoundAtInterval(hitSound, 12, 15)
		this.reset();
	},
	lost(){
		game.over = true;
		currentGrid = 0;
		this.reset();
		game.reset();
	}
}

var score = {
	current: 0,
	last: 0,
	best: 0,
	milestones: [3000,5000,8000,12000],
	nextMilestone: 0,
	getNextMilestone() {
		for (let i=0; i<this.milestones.length; i++){
			if (this.current < this.milestones[i]) {
				this.nextMilestone = this.milestones[i];
				return;
			}
		}
	},
	add(num) {
		this.current += num;
		if (this.current == this.nextMilestone) {
			lives.add_1();
			this.getNextMilestone();
		}
	},
	save() {
		this.last = this.current;
	},
	reset() {
		if (this.current > this.best) this.best = this.current;
		log("last: "+this.current+"  , best: "+this.best)
	    this.current = 0;
	    this.getNextMilestone();    
	}
}

var lives = {
	initial: 3,
	current: 3,
	add_1() {
		this.current++;
		playSoundAtInterval(hitSound, 6, 15)
	},
	remove() { 
		this.current--;
		this.check();
	},
	check() {
		if(this.current <= 0) round.lost();
	},
	reset() {
		this.current = this.initial;
	},
}


function setUpInput () {

	canvas.addEventListener("mousemove", function(e){
		var mousePos = calculateMousePos(e);
		paddleX = mousePos.x - (paddleWidth/2);
	});

	canvas.addEventListener("mousedown", function(e){
		if (!game.stopped){
			for (var i=0; i<balls.length; i++){
				if (balls[i] && balls[i].ballIsFrozen) {
					balls[i].unfreeze();
				}
			}
			if (powerUp.cannon) {
				cannonFire(shotL);
				cannonFire(shotR);
			}
		}
	});

	document.body.onkeydown = function(e){
	    if (e.keyCode == 32){
	    	if (game.stopped) {
	    		game.over = false;
	    		game.stopped = false;
	    		game.paused = false;
	    		/*  unfreeze? */
	    	}
	    	else game.paused = !game.paused;
	    }
	    if (debuggingMode){
	    	if (48 <= e.keyCode && e.keyCode <= 52) {
	    		for (var key in powerUp) { powerUp[key] = false };
	    	}
	    	if (e.keyCode == 49) powerUp.fireball = !powerUp.fireball;
	    	if (e.keyCode == 50) powerUp.cannon = !powerUp.cannon;
	    	if (e.keyCode == 51) powerUp.sticky = !powerUp.sticky;
	    	
	    	if (e.keyCode == 53) newBall();
	    }
	}
}


function log(msg){
	document.getElementById("js-log").innerHTML = msg;
}


window.onload = function() {

	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	
	round.reset();
	game.reset();

	setInterval(function(){
		if (!game.paused && !game.stopped){
			moveAllBalls();
			shotL.move();
			shotR.move();
			moveAllBoni();
			drawEverything();
		}
		if (game.stopped) {
			drawWinScreen();
		}
	}, 1000/FPS);

}





