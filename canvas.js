const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 400;

const gravity = 0.2;
class Cube {
  constructor() {
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
    context.fillStyle = "orange";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
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
    this.speed = {
      x: 0.005,
      y: 0,
    };
  }

  obstaclesDraw() {
    context.fillStyle = "darkblue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  moveObstacle() {
    this.obstaclesDraw();

    this.acceleration.x += this.speed.x;
    this.position.x -= this.acceleration.x;
  }
}

const cube = new Cube();
const obstacles = [];

function spawnObstacle() {
  let randomHeight = Math.random() * (130 - cube.height) + cube.height;
  let randomWidth = Math.random() * (200 - cube.width) + cube.width;
  let obstacle = new Obstacle({
    x: canvas.width,
    height: randomHeight,
    width: randomWidth,
  });
  obstacles.push(obstacle);
  let randomMillisecondTime = Math.random() * (2500 - 1500) + 1500;
  setTimeout(spawnObstacle, randomMillisecondTime);
}

spawnObstacle();

let gamePlay = true;
let score = 0;

setInterval(() => {
  score += 1;
}, 500);

function render() {
  if (!gamePlay) {
    context.fillText("You died", 440, 220)
    return gamePlay
  }
// Restart game (Skapa en funktion som clearar array of obstacles)

  requestAnimationFrame(render);
  context.fillStyle = "rgb(206, 206, 206)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  cube.cubeJump();
  console.log(score);
  context.font = "30px Arial";
  context.fillText(`SCORE: ${score}`, 10, 50)
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
      cube.velocity.y = 0; // ändra till att man dör vid nud istället för att åka på objekt
      console.log("Nuddar toppen");
    } else if (
      cube.position.x + cube.width - 10 >= obstacle.position.x &&
      obstacle.width + obstacle.position.x > cube.position.x &&
      cube.position.y + cube.height >= obstacle.position.y
    ) {
      console.log("nuddar front");
      obstacle.acceleration.x = 0; //ändra till att man dör vid nud istället för att åka på objekt
      gamePlay = false;
      return gamePlay;
    }
  });
}

render();

window.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "w" || event.key === "ArrowUp") {
    if (cube.velocity.y == 0) {
      cube.velocity.y -= 8;
    }
  }
});
