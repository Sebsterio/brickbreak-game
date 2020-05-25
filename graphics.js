



/* -- LOAD PICS ---*/

var titlePic = document.createElement("img");
var bgPic = document.createElement("img");
var brickPic = document.createElement("img");
var brickPic2 = document.createElement("img");
var brickPic3 = document.createElement("img");
var brickPic4 = document.createElement("img");
var paddlePic = document.createElement("img");
var cannonPic = document.createElement("img");
var ballPic = document.createElement("img");
var ballStickyPic = document.createElement("img");
var ballFirePic = document.createElement("img");
var lifePic = document.createElement("img");
var bonusPic = document.createElement("img");

var picsToLoad;
var picList = [
	{varName: titlePic, fileName: "titlescreen.jpg"},
	{varName: bgPic, fileName: "bg.jpg"},
	{varName: brickPic, fileName: "brick.png"},
	{varName: brickPic2, fileName: "brick_2.png"},
	{varName: brickPic3, fileName: "brick_3.png"},
	{varName: brickPic4, fileName: "brick_4.png"},
	{varName: paddlePic, fileName: "paddle.png"},
	{varName: cannonPic, fileName: "cannon.png"},
	{varName: ballPic, fileName: "ball.png"},
	{varName: ballStickyPic, fileName: "ball_sticky.png"},
	{varName: ballFirePic, fileName: "ball_fire.png"},
	{varName: lifePic, fileName: "life.png"},
	{varName: bonusPic, fileName: "bonus.png"},
];
var allPicsInitiated = false


function picLoaded() {
	picsToLoad--;
	if (picsToLoad === 0) {
		allPicsInitiated = true;
		game.paused = true;
		game.stopped = true;
	}
}
function loadPic(picVar, fileName) {
	picVar.onload = picLoaded();
	picVar.src = "graphics/" + fileName;
}
function initPics() {
	picsToLoad = picList.length
	for (var i = 0; i< picList.length; i++){
		loadPic(picList[i].varName, picList[i].fileName);
	}
}





/*--- DRAW ---*/

function drawRect(x,y,w,h,color){
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}

function drawCircle (ceterX, centerY, radius, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(ceterX, centerY, radius, 0, Math.PI*2,true);
	ctx.fill();
}

function drawField(whichVar, alpha) {
	drawRect(0,0,canvas.width,canvas.height,"black");

	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.drawImage(whichVar,0,0);
	ctx.restore();
}

function drawBricks() {
	for (var i=0; i<BRICK_ROWS; i++){
		for (var j=0; j<BRICK_COLS; j++){
			var index = i*BRICK_COLS + j;
			if (brickGrid[index] > 0){
				var brickX = j * BRICK_W;
				var brickY = i * BRICK_H;
				switch(brickGrid[index]){
					case 1: ctx.drawImage(brickPic, brickX, brickY); break;
					case 2: ctx.drawImage(brickPic2, brickX, brickY); break;
					case 3: ctx.drawImage(brickPic3, brickX, brickY); break;
					case 4: ctx.drawImage(brickPic4, brickX, brickY); break;
				}
			}
		}
	}
}

function drawPaddle(x,y) {
	ctx.drawImage(paddlePic,x,y);
	if (powerUp.cannon) ctx.drawImage(cannonPic,x,y-16)
}

function drawBall(x, y, alpha) {
	//ctx.save();
	//ctx.globalAlpha = alpha;
	if (powerUp.sticky) ctx.drawImage(ballStickyPic,x,y);
	else if (powerUp.fireball) ctx.drawImage(ballFirePic,x,y)
	else ctx.drawImage(ballPic,x, y);
	//ctx.restore();
}

function drawAllBalls(){
	for (var i=0; i<balls.length; i++){
		if (balls[i]) drawBall(balls[i].ballX-ballRad, balls[i].ballY-ballRad);
	}
}

function drawAllBoni () {
	for (var i=0; i<boni.length; i++){
		if (boni[i].active)	ctx.drawImage(bonusPic, boni[i].x, boni[i].y)
	}
}

function drawScore (current, milestone) {
	ctx.fillStyle =" white";
	const text = current+" / "+milestone;
	ctx.fillText(text, 20, 20)
}

function drawLives (num) {
	for (var i = num; i > 0; i--) {
		ctx.drawImage(lifePic, canvas.width -20*(i)-10, 10)
	}
}

function drawWinScreen () {

	drawField(bgPic, 1)
	if (score.last===0 || game.over) {
		line_1 = "Welcome";
		line_2 = "to the BEST GAME EVER";
		line_3 = "Press SPACE to begin the best moment of your life...";
	} else {
		line_1 = "You won!";
		line_2 = "Your score is "+ String(score.last);
		line_3 = "Press SPACE to continue...";
	}
	ctx.save();

	ctx.font = '40px Arial';
	ctx.fillText(line_1, canvas.width/2 - ctx.measureText(line_1).width/2, canvas.height/2 - 60);

	ctx.font = '20px Arial';
	ctx.fillText(line_2, canvas.width/2 - ctx.measureText(line_2).width/2, canvas.height/2 -20);
	ctx.fillText(line_3, canvas.width/2 - ctx.measureText(line_3).width/2, canvas.height/2 + 80);

	ctx.restore();
}

function drawEverything(){
	drawField(bgPic, 0.5);
	drawBricks();
	drawPaddle(paddleX, paddleY);
	shotL.draw();
	shotR.draw();
	drawAllBalls();
	drawAllBoni();
	drawScore(score.current, score.nextMilestone);
	drawLives(lives.current);
}




/*---*/


/*
function drawBallAndTrail() {
	var alphaDecreaseRate = 1 / (TRAIL_LENGTH+1);
	for (var i = TRAIL_LENGTH-1; i >= 0; i--) {
		var thisAlpha = 1 - alphaDecreaseRate*(i+1);
		drawBall(trail[i].x, trail[i].y, thisAlpha);
	}
	drawBall(ballX-ballRad, ballY-ballRad, 1);
}
*/