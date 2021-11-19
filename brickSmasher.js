/**/
/* Game Setup */
/**/ 
/* Canvas & draw initialization */
const canvas = document.getElementById("brickSmasherCanvas");
const ctx = canvas.getContext("2d");

/* Initializes variable controlling if the game has ended */
let gameOver = false;

/* Score, lives & header initialization */
const topMargin = 20;
let score = 0;
let lives = 3;

/* Assigns initial ball parameters */
const ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;

/* Assigns initial paddle parameters */
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

/* Assigns initial brick parameters */
const brickRowCount = 6;
const brickColumnCount = 7;
const brickPadding = 5;
const brickWidth = (canvas.width - ((brickColumnCount + 1) * brickPadding)) / brickColumnCount;
const brickHeight = 20;
let bricks = generateBrickArray();
function generateBrickArray() {
    let brickArray = []
    for (c = 0; c < brickColumnCount; c++) {
        brickArray[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            brickArray[c][r] = {x: 0, y: 0, status: 1};
        }
    }
    return brickArray
}

/* Adds event listeners for left/right key press (paddle control) */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/* Defines event listener functions */
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "D") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "A") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if( e.key == "Right" || e.key == "ArrowRight" || e.key == "D") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "A") {
        leftPressed = false;
    }
}


/**/
/* Play Game */
/**/
/* Starts game */
playGame();

/* Recursive function which continuously updates and allows the game to run */
function playGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawLives()
    drawTopBound();
    drawBricks();
    collisionDetection();
    ballMovement();
    paddleMovement();
    if (gameOver == false) {
        requestAnimationFrame(playGame);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        drawLives()
        drawTopBound();
        drawGameOver();
    }
}

/* Draws ball on canvas given parameters */
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

/* Draws paddle on canvas given parameters */
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

/* Draws score on canvas given parameters */
function drawScore() {
    ctx.beginPath();
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 8, 15);
    ctx.closePath();
}

/* Draws lives on canvas given parameters */
function drawLives() {
    ctx.beginPath();
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 15);
    ctx.closePath();
}

/* Draws the top boundary line on canvas */
function drawTopBound() {
    ctx.beginPath();
    ctx.rect(0, topMargin - 2, canvas.width, 2);
    ctx.fillStyle = "black";
    ctx.fill();
}

/* Draws bricks on canvas given parameters */
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding) + brickPadding);
                let brickY = (r * (brickHeight + brickPadding) + brickPadding + topMargin);
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawGameOver() {
    ctx.beginPath();
    ctx.font = "bold 45px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", (canvas.width / 2) - 135, 200);
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "25px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Final Score: " + score, (canvas.width / 2) - 70, 250);
    ctx.closePath();
}

/* Detects collisions between the ball and the walls or bricks, causing ball to change direction and remove bricks if applicable */
function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if( b.status == 1) {
                if (((y - ballRadius <= b.y + brickHeight && y + ballRadius > b.y + brickHeight) || (y + ballRadius >= b.y && y - ballRadius < b.y)) && (x >= b.x && x <= b.x + brickWidth)) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                }
                if (((x - ballRadius <= b.x + brickWidth && x + ballRadius > b.x + brickWidth) || (x + ballRadius >= b.x && x - ballRadius < b.x)) && (y >= b.y && y <= b.y + brickHeight)) {
                    dx = -dx;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
    if (x + ballRadius + dx > canvas.width || x - ballRadius + dx < 0) {
        dx = -dx;
    }
    if (y - ballRadius + dy <= topMargin) {
        dy = -dy;
    } else if (y + ballRadius + dy + paddleHeight > canvas.height) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (lives <= 0) {
                gameOver = true;
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
}

/* Moves the ball each frame */
function ballMovement() {
    x += dx;
    y += dy;
}

/* Moves the paddle depending on user input */
function paddleMovement() {
    if (rightPressed) {
        paddleX += 4;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed) {
        paddleX -= 4;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
}