
var ballX, ballY, ballSpeedX, ballSpeedY, ballSpeedX_mem, ballSpeedY_mem, ballOffsetX_mem;
var ballRad = 6;
var ballColor = "white";
var ballIsFrozen = true;


function resetBall () {
	ballIsFrozen = true;
	ballOffsetX_mem = 0;
	ballSpeedX_mem = 0;
	ballSpeedY_mem = -5;
}


function simpleBounce(whichEdge){
	if (whichEdge == "top" && ballSpeedY < 0) ballSpeedY *= -1;
	if (whichEdge == "bottom" && ballSpeedY > 0) ballSpeedY *= -1;
	if (whichEdge == "left" && ballSpeedX < 0) ballSpeedX *= -1;	
	if (whichEdge == "right" && ballSpeedX > 0) ballSpeedX *= -1;
}

function complexBounce(ballGridX, ballGridY) {

	var prevBallX = ballX - ballSpeedX;
	var prevBallY = ballY - ballSpeedY;
	var prevBallCol = Math.floor(prevBallX / BRICK_W);
	var prevBallRow = Math.floor(prevBallY / BRICK_H);
	var armpitBounce = true;

	if (prevBallCol != ballGridX) {
		var adjacentBrickIndex = prevBallCol*BRICK_ROWS + ballGridY;
		//console.log(adjacentBrickIndex);
		if (brickGrid[adjacentBrickIndex] === 0){
			ballSpeedX *= -1;
			armpitBounce = false;
		}
	}
	if (prevBallRow != ballGridY) {
		var adjacentBrickIndex = ballGridX * BRICK_ROWS + prevBallRow;
		//console.log(adjacentBrickIndex);
		if (brickGrid[adjacentBrickIndex] === 0){
			ballSpeedY *= -1;
			armpitBounce = false;
		}
	}
	if (armpitBounce){
		ballSpeedY *= -1;
		ballSpeedX *= -1;
	}
}

function collisionDetected (x, y) {

	var pointGridX = Math.floor(x / BRICK_W);
	var pointGridY = Math.floor(y / BRICK_H);
	var pointIndex = (pointGridY * BRICK_COLS) + pointGridX;

	if (brickGrid[pointIndex] > 0){
		hitSound.play();
		return {
			x: pointGridX,
			y: pointGridY,
			i: pointIndex
		};
	} 
}

function damageBrick (pointIndex) {
	if (brickGrid[pointIndex] != 4) {

		if (brickGrid[pointIndex] == 1) {
			brickGrid[pointIndex] = 0;
			bricksCounter++;
			//console.log(bricksCounter,"/", bricksLimit)
			if (bricksCounter == bricksLimit) round.cleared();
		}
		else if (brickGrid[pointIndex] == 2) {
			brickGrid[pointIndex] = 1;
		}
		else if (brickGrid[pointIndex] == 3) {
			brickGrid[pointIndex] = 2;
		}
		score.add(100);

	} else if (powerUp.fireball) brickGrid[pointIndex] = 0;
}


function checkCollisions(x,y){
	if (ballY >= BRICK_ROWS*BRICK_H) return;
	else {
		var ballEdges = {
			Top: { name: "top",	x: ballX, y: ballY - ballRad },
			Right: { name: "right", x: ballX + ballRad, y: ballY },
			Bottom: { name: "bottom", x: ballX, y: ballY + ballRad },
			Left: { name: "left", x: ballX - ballRad, y: ballY }
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
			if (whichEdgeCollided_1) simpleBounce(whichEdgeCollided_1);
			if (whichEdgeCollided_2) simpleBounce(whichEdgeCollided_2);
		}
		else {
			var ballGridCoords = collisionDetected(ballX, ballY);
			complexBounce( ballGridCoords.x, ballGridCoords.y)
		}
	}
}



function moveBall(){

	if (ballIsFrozen){

		ballX = paddleX + paddleWidth/2 + ballOffsetX_mem;
		ballY = paddleY - (ballRad);

	} else {

		ballX += ballSpeedX;
		ballY += ballSpeedY;

		/* bounce off walls */
		if ( ballX-ballRad <= 0 ){
			wallSound.play();
			ballSpeedX = Math.abs(ballSpeedX);
		}
		if ( ballX+ballRad >= canvas.width){
			wallSound.play();
			ballSpeedX = -Math.abs(ballSpeedX);
		}

		/* paddle bounce and miss */
		if (ballY+ballRad >= paddleY){

			if (ballY >= canvas.height)	{
				missSound.play();
				resetBall();
				lives.remove();

			} else if (ballX+ballRad >= paddleX && ballX-ballRad <= paddleX+paddleWidth && ballSpeedY > 0){

				ballOffsetX_mem = ballX - (paddleX+paddleWidth/2);

				if (!powerUp.sticky){
					ballSpeedX += ballOffsetX_mem*0.1;
					ballSpeedY *= -1.05;

				} else {
					ballSpeedX_mem = ballOffsetX_mem * .1;
					ballSpeedY_mem = ballSpeedY * -1.05;
					ballIsFrozen = true;
				}

			}  

		/* bounce off ceiling */
		} else if (ballY <= 0){
			wallSound.play();
			ballSpeedY *= -1;
		}/* --- */

		else checkCollisions();

	}
}