function startGame() {
    /**/
    /* Game Setup */
    /**/ 

    /* Removes start screen and start button if present */
    if (!!document.querySelector("#startScreenContainer")) {
        document.querySelector("#startScreenContainer").remove();
    }

    /* Canvas & drawer initialization */
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "brickSmasherCanvas");
    canvas.setAttribute("width", "575");
    canvas.setAttribute("height", "540");
    let brickSmasherDisplay = document.getElementById("brickSmasher");
    brickSmasherDisplay.append(canvas);
    const ctx = canvas.getContext("2d");

    /* Initializes variable controlling if the game has ended */
    let gameOver = false;

    /* Score, lives, level & header initialization */
    const topMargin = 20;
    let score = 0;
    let lives = 3;
    let level = 1;

    /* Assigns initial ball parameters */
    const ballRadius = 10;
    let x = canvas.width/2;
    let y = canvas.height-30;
    let dx = assignDX();
    let dy = assignDY();

    function assignDX() {
        switch (level) {
            case 1:
                return randomDirection(2);
            case 2:
                return randomDirection(2);
            case 3:
                return randomDirection(2);
            case 4:
                return randomDirection(3);
        }
    }

    function assignDY() {
        switch (level) {
            case 1:
                return 2;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 3;
        }
    }

    function randomDirection(num) {
        if (Math.random() < 0.5) {
            return num * -1;
        } else {
            return num;
        }
    }

    /* Assigns initial paddle parameters */
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width-paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    
    /* Assigns initial brick parameters */
    let brickRowCount = getBrickRowCount();
    let brickColumnCount = 7;
    const brickPadding = 5;
    const brickWidth = (canvas.width - ((brickColumnCount + 1) * brickPadding)) / brickColumnCount;
    const brickHeight = 20;
    let bricks = getBrickParameters();

    function getBrickRowCount() {
        if (level == 1){
            return 2;
        } else if (level == 2) {
            return 2;
        } else if (level == 3 || level == 4) {
            return 5;
        }
    }
    
    function getBrickParameters() {
        let brickParameters = [];
        for (c = 0; c < brickColumnCount; c++) {
            brickParameters[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                brickParameters[c][r] = {x: getBrickX(c), y: getBrickY(r), status: getStatus(c, r)};
            }
        }
        return brickParameters;
    }

    function getBrickX(c) {
        return (c * (brickWidth + brickPadding) + brickPadding);
    }

    function getBrickY(r) {
        return (r * (brickHeight + brickPadding) + brickPadding + topMargin);
    }

    function getStatus(c, r) {
        switch (level) {
            case 1:
                return 1;
            case 2:
                if (r == 0) {
                    return 2;
                } else {
                    return 1;
                }
            case 3:
                if (r == 2) {
                    return 3;
                } else if (r == 1 || r == 3) {
                    return 2;
                } else {
                    return 1;
                }
            case 4:
                if (c == 3 || r == 0) {
                    return 0;
                } else if (r == 4 && c != 3) {
                    return 3;
                } else if (r == 3 && c != 3) {
                    return 2;
                } else {
                    return 1;
                }
        }
    }

    /* Adds event listeners for left/right key press (paddle control) */
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    /* Defines event listener functions */
    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if( e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
            rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
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
            if (checkLevelComplete()) {
                level = level + 1;
                setUpLevelParameters();
                requestAnimationFrame(playGame);
            } else {
                requestAnimationFrame(playGame);
            }
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawScore();
            drawLives()
            drawTopBound();
            drawGameOver();
            addPlayAgainButton();
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
                if (bricks[c][r].status > 0) {
                    ctx.beginPath();
                    ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                    ctx.fillStyle = getColor();
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    /* Assigns brick color */
    function getColor() {
        switch (bricks[c][r].status) {
            case 1:
                return "yellow";
            case 2:
                return "orange";
            case 3:
                return "red";
        }
    }

    /* Detects collisions between the ball and the walls or bricks, causing ball to change direction and remove bricks if applicable */
    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if( b.status > 0) {
                    if (((y - ballRadius <= b.y + brickHeight && y + ballRadius > b.y + brickHeight) || (y + ballRadius >= b.y && y - ballRadius < b.y)) && (x >= b.x && x <= b.x + brickWidth)) {
                        dy = -dy;
                        b.status = b.status - 1;
                        score++;
                    }
                    if (((x - ballRadius <= b.x + brickWidth && x + ballRadius > b.x + brickWidth) || (x + ballRadius >= b.x && x - ballRadius < b.x)) && (y >= b.y && y <= b.y + brickHeight)) {
                        dx = -dx;
                        b.status = b.status - 1;
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
                    dx = assignDX();
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

    function checkLevelComplete() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function setUpLevelParameters() {
        x = canvas.width/2;
        y = canvas.height-30;
        paddleX = (canvas.width-paddleWidth)/2
        dx = assignDX();
        dy = assignDY();
        brickRowCount = getBrickRowCount();
        bricks = getBrickParameters();
    }
    
    /* Creates the game over screen */
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

    /* Creates and adds the play again button */
    function addPlayAgainButton() {
        let playAgain = document.createElement("button");
        playAgain.setAttribute("id", "brickSmasherPlayAgainButton");
        playAgain.textContent= "Play Again";
        playAgain.setAttribute("onclick", "playAgain()");
        brickSmasherDisplay.append(playAgain);
    }

}

/* Removes previous game canvas and play again button, restarts game */
function playAgain() {
    document.querySelector("#brickSmasherCanvas").remove();
    document.querySelector("#brickSmasherPlayAgainButton").remove();
    startGame();
}