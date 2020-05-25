
var ballRad = 6;
var balls, ballsInGame;

function newBall () {
	var newBall = new ballClass(balls.length);
	newBall.resetBall();  
	balls.push(newBall);
	ballsInGame++;
}

function removeBall (i) {
	balls[i] = null;
	ballsInGame--;
}

function resetBalls () {
	balls = [];
	ballsInGame = 0
	newBall();
}

function moveAllBalls(){
	for (var i=0; i<balls.length; i++){
		if (balls[i]) balls[i].moveBall();
	}
}

function ballClass(i){

	this.index = i;
	this.ballIsFrozen = true;

	this.ballX;
	this.ballY;
	this.ballSpeedX;
	this.ballSpeedY;
	this.ballSpeedX_mem;
	this.ballSpeedY_mem;
	this.ballOffsetX_mem;

	this.unfreeze = function() {
		this.ballIsFrozen = false;
		this.ballSpeedX = this.ballSpeedX_mem;
		this.ballSpeedY = this.ballSpeedY_mem;
		this.ballOffsetX_mem = 0;
	}

	this.resetBall = function() {
		this.ballIsFrozen = true;
		this.ballOffsetX_mem = 0;
		this.ballSpeedX_mem = 0;
		this.ballSpeedY_mem = -5;
	}

	this.moveBall = function(){

		if (this.ballIsFrozen){

			this.ballX = paddleX + paddleWidth/2 + this.ballOffsetX_mem;
			this.ballY = paddleY - ballRad;

		} else {

			this.ballX += this.ballSpeedX;
			this.ballY += this.ballSpeedY;

			/* bounce off walls */
			if ( this.ballX-ballRad <= 0 ){
				wallSound.play();
				this.ballSpeedX = Math.abs(this.ballSpeedX);
			}
			if ( this.ballX+ballRad >= canvas.width){
				wallSound.play();
				this.ballSpeedX = -Math.abs(this.ballSpeedX);
			}

			/* paddle bounce and miss */
			if (this.ballY+ballRad >= paddleY){

				if (this.ballY >= canvas.height)	{
					missSound.play();
					if (ballsInGame > 1) {
						removeBall(this.index);
					}
					else {
						resetBalls();
						lives.remove();						
					}

				} else if (
					this.ballX+ballRad >= paddleX &&
					this.ballX-ballRad <= paddleX+paddleWidth &&
					this.ballSpeedY > 0
				) {

					this.ballOffsetX_mem = this.ballX - (paddleX+paddleWidth/2);

					if (!powerUp.sticky){
						this.ballSpeedX += this.ballOffsetX_mem*0.1;
						this.ballSpeedY *= -1.05;

					} else {
						this.ballSpeedX_mem = this.ballOffsetX_mem * .1;
						this.ballSpeedY_mem = this.ballSpeedY * -1.05;
						this.ballIsFrozen = true;
					}

				}  

			/* bounce off ceiling */
			} else if (this.ballY <= 0){
				wallSound.play();
				this.ballSpeedY *= -1;
			}/* --- */

			else this.checkCollisions();

		}
	}

	this.checkCollisions = function(x,y){

		if (this.ballY >= BRICK_ROWS*BRICK_H) return;
		else {
			var ballEdges = {
				Top: { name: "top",	x: this.ballX, y: this.ballY - ballRad },
				Right: { name: "right", x: this.ballX + ballRad, y: this.ballY },
				Bottom: { name: "bottom", x: this.ballX, y: this.ballY + ballRad },
				Left: { name: "left", x: this.ballX - ballRad, y: this.ballY }
			}
			var pointsCollided = 0;
			var whichEdgeCollided_1 = null;
			var whichEdgeCollided_2 = null;
			var brickDamageProcessed = false;

			for (var edge in ballEdges) {

				var collisionCoords = collisionDetected (ballEdges[edge].x, ballEdges[edge].y)
				if ( collisionCoords ) {
					pointsCollided ++;
					if (!brickDamageProcessed) {
						damageBrick(collisionCoords.i);
						brickDamageProcessed = true;
					}
					if (!whichEdgeCollided_1) whichEdgeCollided_1 = ballEdges[edge].name;
					else if (!whichEdgeCollided_2) whichEdgeCollided_2 = ballEdges[edge].name;
				}

			}
			if (powerUp.fireball) return;

			if (pointsCollided <= 2) {
				if (whichEdgeCollided_1) this.simpleBounce(whichEdgeCollided_1);
				if (whichEdgeCollided_2) this.simpleBounce(whichEdgeCollided_2);
			}
			else {
				var ballGridCoords = collisionDetected(this.ballX, this.ballY);
				this.complexBounce( ballGridCoords.x, ballGridCoords.y)
			}
		}
	}

	this.simpleBounce = function (whichEdge){
		if (whichEdge == "top" && this.ballSpeedY < 0) this.ballSpeedY *= -1;
		if (whichEdge == "bottom" && this.ballSpeedY > 0) this.ballSpeedY *= -1;
		if (whichEdge == "left" && this.ballSpeedX < 0) this.ballSpeedX *= -1;	
		if (whichEdge == "right" && this.ballSpeedX > 0) this.ballSpeedX *= -1;
	}

	this.complexBounce = function (ballGridX, ballGridY) {

		var prevBallX = this.ballX - this.ballSpeedX;
		var prevBallY = this.ballY - this.ballSpeedY;
		var prevBallCol = Math.floor(prevBallX / BRICK_W);
		var prevBallRow = Math.floor(prevBallY / BRICK_H);
		var armpitBounce = true;

		if (prevBallCol != ballGridX) {
			var adjacentBrickIndex = prevBallCol*BRICK_ROWS + ballGridY;
			//console.log(adjacentBrickIndex);
			if (brickGrid[adjacentBrickIndex] === 0){
				this.ballSpeedX *= -1;
				armpitBounce = false;
			}
		}
		if (prevBallRow != ballGridY) {
			var adjacentBrickIndex = ballGridX * BRICK_ROWS + prevBallRow;
			//console.log(adjacentBrickIndex);
			if (brickGrid[adjacentBrickIndex] === 0){
				this.ballSpeedY *= -1;
				armpitBounce = false;
			}
		}
		if (armpitBounce){
			this.ballSpeedY *= -1;
			this.ballSpeedX *= -1;
		}
	}

}









