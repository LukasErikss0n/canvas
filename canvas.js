const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const restart = document.getElementById("restart");
const start = document.getElementById("start");

function getImg(src) {
  let img = new Image();
  img.src = src;
  return img;
}

let cubeTexture = getImg("img/cube.png");
let backgroundImg = getImg("img/background-img.png");
let obstacleTexture = [
  getImg("img/rock-mark.png"),
  getImg("img/fens.png"),
  getImg("img/rock-flowers.png"),
  getImg("img/bush-appel.png"),
];

canvas.width = 1000;
canvas.height = 400;

const gravity = 0.2;

class Cube {
  constructor() {
    this.texture = cubeTexture;
    this.height = 50;
    this.width = 50;

    this.position = {
      x: 30,
      y: canvas.height - this.height,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
  }
  cubeDraw() {
    context.drawImage(
      this.texture,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  cubeJump() {
    this.cubeDraw();
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Obstacle {
  constructor({ width, height, x }) {
    this.width = width;
    this.height = height;

    this.position = {
      x: x,
      y: canvas.height - this.height,
    };
    this.acceleration = {
      x: 20,
      y: 0,
    };
  }

  obstaclesDraw() {
    //context.fillStyle = "darkblue";
    //context.fillRect(this.position.x, this.position.y, this.width, this.height);
    context.drawImage(
      obstacleTexture[resultObjekt],
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  moveObstacle() {
    this.obstaclesDraw();

    this.position.x -= this.acceleration.x;
  }
}

const cube = new Cube();
let obstacles = [];
let obstacleTime;

function spawnObstacle() {
  // let randomHeight = Math.random() * (130 - cube.height) + cube.height;
  // let randomWidth = Math.random() * (200 - cube.width) + cube.width;
  let randomObject = Math.random() * (3 - 1) + 1;
  resultObjekt = Math.round(randomObject);

  let obstacle = new Obstacle({
    x: canvas.width,
    height: obstacleTexture[resultObjekt].height, //randomHeigth', problem att bilden är störe en stenen är 200 * 200 även om stenen är 100*30
    width: obstacleTexture[resultObjekt].width, //randomWidth
  });
  obstacles.push(obstacle);
  let randomMillisecondTime = Math.random() * (1800 - 900) + 900;
  obstacleTime = setTimeout(spawnObstacle, randomMillisecondTime);
  return;
}

let gamePlay = true;
let score = 0;

setInterval(() => {
  score += 1;
}, 500);

let currentAnimationRequest;

function render() {
 // console.log("rendering", currentAnimationRequest, gamePlay);
  if (!gamePlay) {
    context.fillText("You died", 440, 150);
    window.cancelAnimationFrame(currentAnimationRequest);
    restart.style.display = "inline";
    return gamePlay;
  }

  currentAnimationRequest = requestAnimationFrame(render);
  context.fillStyle = "rgb(206, 206, 206)";
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height); //context.drawImage(image, x, y, width, height)
  cube.cubeJump();
  context.font = "30px Arial";
  context.fillStyle = "orange";
  context.fillText(`SCORE: ${score}`, 10, 50);

  obstacles.forEach(function (obstacle) {
    obstacle.moveObstacle();
  });

  //crash detection
  obstacles.forEach(function (obstacle) {
    if (
      cube.position.y + cube.height <= obstacle.position.y &&
      cube.position.y + cube.height + cube.velocity.y >= obstacle.position.y &&
      cube.position.x + cube.width >= obstacle.position.x &&
      cube.position.x <= obstacle.position.x + obstacle.width
    ) {
      console.log("top");
      cube.velocity.y = 0;
    } else if (
      cube.position.x + cube.width - 20 >= obstacle.position.x &&
      obstacle.width + obstacle.position.x > cube.position.x &&
      cube.position.y + cube.height >= obstacle.position.y
    ) {
      console.log("front");
      gamePlay = false;
      return gamePlay;
    }
  });
}
let doublejump = 0;
window.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "w" || event.key === "ArrowUp") {
    if (cube.velocity.y == 0 ) {
      cube.velocity.y -= 8;
      doublejump = 1
    } else if (doublejump == 1){
       cube.velocity.y -= cube.velocity.y + 6
      doublejump = 0
    }
  }
});
function startGame() {
  context.fillStyle = "rgb(206, 206, 206)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  clearTimeout(obstacleTime);
  gamePlay = true;
  obstacles = [];
  score = 0;
  restart.style.display = "none";
  start.style.display = "none";
  cube.position.y = canvas.height - cube.height;
  cube.velocity.y = 0;

  currentAnimationRequest = requestAnimationFrame(render);
  spawnObstacle();
}

restart.addEventListener("click", function () {
  startGame();
});

start.addEventListener("click", function () {
  startGame();
});
