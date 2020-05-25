
const SHOT_SPEED = 15;
const SHOT_LIFE = 30;
const SHOT_RADIUS = 2;

var shotL = new shotClass();
var shotR = new shotClass();
shotL.reset();
shotR.reset();


function cannonFire(shot){
	if (shot.ready()) {
		var cannon = shot === shotL ?
		 {		x: paddleX,
				y: paddleY-16
		} : {	x: paddleX+paddleWidth,
				y: paddleY-16	}

		shot.shootFrom(cannon);
	};
}

function shotClass() {

	this.x;
	this.y;
	this.life;

	this.reset = function() {
		this.life = 0;
	}
	this.ready = function(){
		return (this.life <= 0);
	}

	this.shootFrom = function(source){
		this.x = source.x;
		this.y = source.y;
		this.life = SHOT_LIFE;
	}

	this.hitTest = function(enemy) {
		if (this.life <= 0) {
			return false;
		}
		return enemy.colisionTest(this.x, this.y)
	}

	this.move = function() {
		if (this.life > 0) {
			this.life--;
			this.y -= SHOT_SPEED;
			var collisionCoords = collisionDetected (this.x, this.y)
			if ( collisionCoords ) {
				damageBrick(collisionCoords.i);
				this.reset();
			}
		}
		
	}

	this.draw = function(){
		if (this.life > 0) drawCircle(this.x, this.y, SHOT_RADIUS, "white")
	}
}


