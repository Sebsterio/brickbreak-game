/*--- set up ---*/

const BRICK_W = 80;
const BRICK_H = 20;
const GAP = 2;
const BRICK_COLS = 8;
const BRICK_ROWS = 12;

var bricksCounter, bricksLimit, brickGrid;
var currentGrid = 0;

var brickDensity = .4;

const BRICK_GRIDS = [
	/*[	0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		1,1,1,1,0,0,4,4
	],*/
	[	0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		1,1,0,0,0,0,0,0,
		1,0,0,0,0,1,1,1,
		1,0,0,0,1,1,1,4,
		1,0,0,1,1,0,0,1,
		1,0,0,1,0,0,0,0,
		1,0,0,0,0,1,1,1,
		1,0,0,0,1,1,1,4,
		1,0,0,1,1,0,0,1,
		1,0,0,1,0,0,0,0,
		1,1,2,2,3,3,4,4
	],
]

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYER = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;


/*--- build phase ---*/

function resetBricks() {

	bricksCounter = 0;
	bricksLimit = 0;

	if (BRICK_GRIDS[currentGrid]) {
		brickGrid = BRICK_GRIDS[currentGrid].slice(0);
		currentGrid++;
	} else {
		makeRandomBrickGrid(); 
		if (brickDensity<1) brickDensity += .1;
	}
	countBricks();
};

function countBricks() {
	for (var i=0; i<brickGrid.length; i++){
		if( 0 < brickGrid[i] && brickGrid[i] < 4) bricksLimit++;
	}
}

function makeRandomBrickGrid() {
	brickGrid = new Array(BRICK_COLS * BRICK_ROWS)
	for (var i=0; i<brickGrid.length; i++){
		if (i <= BRICK_COLS*2){
			brickGrid[i] = 0;
		} else if (Math.random() < brickDensity/30) {
			brickGrid[i] = 4;
		} else if (Math.random() < brickDensity/20) {
			brickGrid[i] = 3;
		} else if (Math.random() < brickDensity/10) {
			brickGrid[i] = 2;
		} else if (Math.random() < brickDensity) {
			brickGrid[i] = 1;
		}
		else brickGrid[i] = 0;
	}
};


/*---move phase---*/

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
			newBonus(pointIndex);
			bricksCounter++;
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