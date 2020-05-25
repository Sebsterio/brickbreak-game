var paddleX, paddleY;
var paddleHeight = 10;
var paddleWidth = 100;

function resetPaddles(){
	paddleX = (canvas.width/2) - (paddleWidth/2);
	paddleY = canvas.height - paddleHeight - 10;
};

function calculateMousePos(e){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = e.clientX - rect.left - root.scrollLeft;
	var mouseY = e.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	};
}