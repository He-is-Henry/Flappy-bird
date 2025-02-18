// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeigth = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeigth,
};

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

// physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

function loadPage() {
  board = document.querySelector(".board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // context.fillStyle = "green";
  //  context.fillRect(bird.x, bird.y, bird.width, bird.height);
  birdImage = new Image();
  birdImage.src = "./images/flappybird.png";
  birdImage.onload = function () {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImage = new Image();
  topPipeImage.src = "./images/toppipe.png";

  bottomPipeImage = new Image();
  bottomPipeImage.src = "./images/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);

  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird);
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, boardHeight);
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) gameOver = true;

  pipeArray.forEach((pipe) => {
    pipe.x += velocityX;

    context.drawImage(pipe.image, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  });

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "white";
  context.font = "45px sans serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
    context.font = "15px sans serif";
    context.fillText("CLICK OR PRESS ANYWHERE TO CONTINUE", 5, 130);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

  let toppipe = {
    image: topPipeImage,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(toppipe);
  let openingSpace = board.height / 4;
  let bottomPipe = {
    image: bottomPipeImage,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (!gameOver) {
    velocityY = -6;
    return;
  }

  if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
  velocityY = -6;
}

loadPage();

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
