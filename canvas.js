const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const restart = document.getElementById("restart");
const start = document.getElementById("start");
const canvasImg = document.getElementById("canvas-img");

function getImg(src) {
  let img = new Image();
  img.src = src;
  return img;
}

const music = new Audio("sfx/music.m4a");
const wind = new Audio("sfx/windslow.m4a");

let cubeTexture = getImg("img/cube.png"); // 50x50
let backgroundImg = getImg("img/sahara.png");
let obstacleTexture = [
  getImg("img/rock-mark.png"), //används ej
  getImg("img/fens.png"), //80x50
  getImg("img/rock-flowers.png"), // 200x100
  getImg("img/bush-appel.png"), //80x100
];

canvas.width = 1000;
canvas.height = 400;

const gravity = 0.2;

class Cube {
  constructor() {
    this.texture = cubeTexture;
    this.height = 50;
    this.width = 50;
    this.rotation = 0;
    this.jumpRotation = 0;

    this.position = {
      x: 60,
      y: canvas.height - this.height,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
  }
  cubeDraw() {
    if (this.velocity.y !== 0) {
      if (this.jumpRotation < Math.PI / 2) {
        this.rotation += Math.PI / 32;
      } else {
        this.jumpRotation = 0;
      }
    } else {
      this.rotation = 0;
    }
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    context.drawImage(
      this.texture,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    context.translate(-this.position.x, -this.position.y);
    context.restore();
  }

  cubeJump() {
    this.cubeDraw();
    this.position.y += this.velocity.y;
    if (this.position.y + this.height / 2 + this.velocity.y <= canvas.height) {
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
  let randomObject = Math.random() * (3 - 1) + 1;
  resultObjekt = Math.round(randomObject);
  console.log(resultObjekt);

  let obstacle = new Obstacle({
    x: canvas.width,
    height: obstacleTexture[resultObjekt].height,
    width: obstacleTexture[resultObjekt].width,
  });
  obstacles.push(obstacle);
  let randomMillisecondTime = Math.random() * (1800 - 1000) + 1000;
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
  if (!gamePlay) {
    music.pause();
    wind.pause();
    context.fillText("You died", 440, 150);
    window.cancelAnimationFrame(currentAnimationRequest);
    restart.style.display = "inline";
    return gamePlay;
  }

  currentAnimationRequest = requestAnimationFrame(render);
  context.fillStyle = "rgb(206, 206, 206)";
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  cube.cubeJump();
  context.font = "30px Arial";
  context.fillStyle = "red";
  context.fillText(`SCORE: ${score}`, 10, 50);

  obstacles.forEach(function (obstacle) {
    obstacle.moveObstacle();
  });

  //crash detection
  obstacles.forEach(function (obstacle) {
    if (
      cube.position.y + cube.height / 2 - 10 <= obstacle.position.y &&
      cube.position.y + cube.height / 2 + cube.velocity.y >=
        obstacle.position.y &&
      cube.position.x + cube.width / 2 >= obstacle.position.x &&
      cube.position.x <= obstacle.position.x + obstacle.width / 2
    ) {
      cube.velocity.y = 0;
    } else if (
      cube.position.x + cube.width / 2 - 10 >= obstacle.position.x &&
      obstacle.width / 2 + obstacle.position.x > cube.position.x &&
      cube.position.y + cube.height / 2 >= obstacle.position.y
    ) {
      gamePlay = false;
      return gamePlay;
    }
  });
}
let doublejump = 0;
window.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "w" || event.key === "ArrowUp") {
    if (cube.velocity.y == 0) {
      cube.velocity.y -= 8;
      doublejump = 1;
      wind.play();
      wind.loop = true;
      wind.volume = 0.3;
    } else if (doublejump == 1) {
      cube.velocity.y -= cube.velocity.y + 6;
      doublejump = 0;
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
  cube.position.y = canvas.height - cube.height / 2;
  cube.velocity.y = 0;
  canvas.style.display = "block";
  canvasImg.style.display = "none";

  currentAnimationRequest = requestAnimationFrame(render);
  spawnObstacle();
  music.play();
  music.loop = true;
  music.volume = 1;
}

restart.addEventListener("click", function () {
  startGame();
});

start.addEventListener("click", function () {
  startGame();
});
