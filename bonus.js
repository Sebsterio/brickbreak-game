const BONUS_SIZE = 50;
const BONUS_SPEED = 5;
const CHANCE_OF_BONUS = .05

var boni = [];

function getCoordsOfIndex (i) {
	gridX = i%BRICK_COLS
	gridY = Math.ceil(i/BRICK_ROWS)
	return {
		x: (gridX + 1/2) * BRICK_W+GAP,
		y: (gridY + 5/2) * BRICK_H+GAP
	};
}

function newBonus (i) {
	if (Math.random() < CHANCE_OF_BONUS){
		var thisBonus = new bonusClass();
		thisBonus.spawn(getCoordsOfIndex(i));
		boni.push(thisBonus);
	}
}

function moveAllBoni () {
	for (var i=0; i<boni.length; i++) { boni[i].move(); }
	if (powerUpLife){
		powerUpLife--;
		if (powerUpLife <= 0) {
			for (var key in powerUp) { powerUp[key] = false };
			powerUpLife = null;
		}
	}
}

function resetBoni () {
	for (var i=0; i<boni.length; i++){
		delete boni[i];
	}
	boni = [];
}

function bonusClass () {

	this.x;
	this.y;
	this.active;

	this.spawn = function (coords) {
		this.x = coords.x - BONUS_SIZE/2;
		this.y = coords.y - BONUS_SIZE/2;
		this.active = true;
	}

	this.kill = function () {
		this.active = false;
	}

	this.move = function () {
		if (this.active){

			this.y += BONUS_SPEED;

			if (this.y + BONUS_SIZE >= paddleY) {

				if (this.y >= canvas.height) this.kill();

				/* paddle collision */
				else if (
					this.x+BONUS_SIZE >= paddleX &&
					this.x <= paddleX+paddleWidth &&
					this.y <= paddleY+paddleHeight
				) {
					newPowerUp();
					this.kill();
				}
			}
		
		
		}
	}

}
function newPowerUp () {

	for (var key in powerUp) { powerUp[key] = false };
	var d100 = Math.random()*100;

	if (d100 >= 80) {		 powerUp.fireball = true;
							 powerUpLife = 300;
	} else if (d100 >= 60) { powerUp.cannon = true;
							 powerUpLife = 300;
	} else if (d100 >= 40) { powerUp.sticky = true;
							 powerUpLife = 900;
	} else 					 newBall();
}

var powerUpLife;

var powerUp = {
	fireball: false,
	cannon: false,
	sticky: false,
}