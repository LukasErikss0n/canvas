let startButton = document.getElementById("start-button");
let canvas = document.getElementById("mycanvas");

let cubeSize = 20;
let xPosCube = 30;
let yPosCube = canvas.height - cubeSize;

function startGame() {
  let cube = canvas.getContext("2d");
  cube.fillStyle = "green";
  cube.fillRect(xPosCube, yPosCube, cubeSize, cubeSize);
  cube.gravity = 0.05;
}

document.onkeydown = function (event) {
  const key = event.key;
  if (key === " ") {
    console.log("space");
    jump();
  }
};

function jump() {
  //hopp funktion
}

startGame();
