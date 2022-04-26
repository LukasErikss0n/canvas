let startButton = document.getElementById("start-button");

let cubeSize = 20
let xPosCube = 30
let yPosCube = canvas.height - cubeSize
let cube

var gameArea = {
  canvas: document.createElement("canvas"),
  start: function(){
    this.canvas.width = 1000
    this.canvas.height = 400
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0
    updateGameArea()
  },
  clear: function(){
    this.context,clearRect(0,0, this.canvas.width, this.canvas.height)
  }
}

function startGame() {
  cube.fillStyle = "green";
  cube.fillRect(xPosCube, yPosCube, cubeSize, cubeSize);
  cube.gravity = 0.05
  cube.speedX = 0
  cube.speedY = 0
  cube.x = 0
  cube.y = 0
}

document.onkeydown = function (event) {
  const key = event.key;
  if (key === " ") {
    console.log("space");
    jump();
  }
};

function jump() {
  cube.fillRect(xPosCube, yPosCube - 20, cubeSize, cubeSize);
  newPos();
}

newPos = function () {
  gravitySpeed += gravity;
  cube.x += speedX;
  cube.y += speedY + gravitySpeed;
  hitBottom();
};

function updateGameArea(){
  gameArea.clear()
  gameArea.frameNo += 1
  if(gameArea.frameNo == 1){ // lägg till  || everyinterval() för att skapa nya hinder
    x =
  }
}

setInterval(() => {}, interval);

startGame();
