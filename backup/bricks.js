const BRICK_W = 80;
const BRICK_H = 20;
const GAP = 2;
const BRICK_COLS = 8;
const BRICK_ROWS = 12;

var bricksCounter, bricksLimit, brickGrid;
var currentGrid = 0;

var brickDensity = .4;

const BRICK_GRIDS = [
	[	0,0,0,0,0,0,0,0,
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
	],
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

function resetBricks() {

	bricksCounter = 0;
	bricksLimit = 0;

	if (BRICK_GRIDS[currentGrid]) {
		brickGrid = BRICK_GRIDS[currentGrid];
		currentGrid++;
	} else {
		makeRandomBrickGrid(); 
		if (brickDensity<1)brickDensity += .1;
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
		} else if (Math.random() < brickDensity) {
			brickGrid[i] = 1;
		}
		else brickGrid[i] = 0;
	}
};