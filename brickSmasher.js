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
    let victory = false;

    /* Score, lives, level & header initialization */
    const topMargin = 20;
    let score = 0;
    let lives = 3;
    let level = 1;
    const highestLevel = 6;

    /* Assigns initial ball parameters */
    const ballRadius = 10;
    let x = canvas.width/2;
    let y = canvas.height-30;
    let dx = randomDirection(2);
    let dy = assignDY();

    function randomDirection(num) {
        if (Math.random() < 0.5) {
            return num * -1;
        } else {
            return num;
        }
    }

    function assignDY() {
        switch (level) {
            case 1:
                return -2;
            case 2:
                return -2;
            case 3:
                return -3;
            case 4:
                return -3;
            case 5:
                return -3;
            case 6:
                return -3.5;
        }
    }

    /* Assigns initial paddle parameters */
    const paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width-paddleWidth) / 2;
    let paddleColor = "#0095DD";
    let rightPressed = false;
    let leftPressed = false;

    /* Assigns initial power up parameters */
    let powerUpDropped = false;
    const powerUpSize = 10;
    let powerUps = [];

    /* Assigns initial paddle gun parameters */
    let paddleGun = false;
    let shotCount = 0;
    let activeShots = [];
    const shotRadius = 5;
    let shotSpeed = 2;
    
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
        } else if (level == 3 || level == 4 || level == 5) {
            return 5;
        } else if (level == 6){
            return 4;
        }
    }
    
    function getBrickParameters() {
        let brickParameters = [];
        for (c = 0; c < brickColumnCount; c++) {
            brickParameters[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                brickParameters[c][r] = {x: getBrickX(c), y: getBrickY(r), status: getStatus(c, r), powerUpType: getPowerUpType(c, r)};
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
            case 5:
                if (c == 3 || r == 0) {
                    return 0;
                } else if ((r == 4 || r == 3) && (c != 3)) {
                    return 3;
                } else {
                    return 2;
                }
            case 6:
                return 3;
        }
    }

    function getPowerUpType(c, r) {
        switch (level) {
            case 1:
                if (r == 1 && c == 3) {
                    return 1;
                } else if (r == 0 && c == 4) {
                    return 2;
                } else {
                    return 0;
                }
            case 2:
                if ((r == 1 && c == 3) || (r == 0 && c == 6)) {
                    return 2;
                } else {
                    return 0;
                }
            case 3:
                if (r == 3 && c == 3) {
                    return 1;
                } else if ((r == 4 && (c == 2 || c == 4)) || (r == 1 && c == 3)) {
                    return 2;
                } else {
                    return 0;
                }
            case 4:
                if ((r == 1 && (c == 4 || c == 2)) || (r == 3 && (c == 1 || c == 5))) {
                    return 2;
                } else if (r == 2 && c == 5) {
                    return 3;
                } else {
                    return 0
                }
            case 5:
                if ((r == 4 && (c == 2 || c == 4)) || (r == 1 && (c == 2 || c == 4))) {
                    return 2;
                } else if (r == 3 && c == 5) {
                    return 1;
                } else {
                    return 0;
                }
            case 6:
                if ((r == 3 && c == 3) || (r == 2 && (c == 2 || c == 4)) || (r == 1 && (c == 1 || c == 3 || c ==5)) || (r == 0 && (c == 0 || c == 2 || c == 4 || c == 6))) {
                    return 2;
                } else if (r == 2 && c == 3) {
                    return 3;
                } else {
                    return 0;
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
        } else if ((e.key == "w" || e.key == "ArrowUp" || e.key == "Up") && shotCount != 0 && paddleGun == true) {
            addShot();
            shotCount = shotCount - 1;
            if (shotCount == 0) {
                paddleGun = false;
                paddleColor = "#0095DD";
            }
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
        drawLives();
        drawLevel();
        drawTopBound();
        drawBricks();
        if (powerUpDropped == true) {
            drawPowerUps();
        }
        if (activeShots.length != 0) {
            drawShots();
        }
        ballCollisionDetection();
        if (powerUpDropped == true) {
            powerUpsCollisionDetection();
        }
        if (activeShots.length != 0) {
            shotsCollisionDetection();
        }
        ballMovement();
        paddleMovement();
        if (powerUpDropped == true) {
            powerUpMovement();
        }
        if (activeShots.length != 0) {
            shotsMovement();
        }
        if (gameOver == false) {
            if (checkLevelComplete()) {
                if (level == highestLevel) {
                    victory = true;
                    drawGameOver();
                } else {
                    setUpLevelParameters();
                    requestAnimationFrame(playGame);
                }
            } else {
                requestAnimationFrame(playGame);
            }
        } else {
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
        ctx.fillStyle = paddleColor;
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

    function drawLevel() {
        ctx.beginPath();
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Level " + level, (canvas.width / 2) - 27, 15);
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
                    ctx.fillStyle = getBrickColor();
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    /* Assigns brick color */
    function getBrickColor() {
        switch (bricks[c][r].status) {
            case 1:
                return "yellow";
            case 2:
                return "orange";
            case 3:
                return "red";
        }
    }

    function drawPowerUps() {
        for (i = 0; i < powerUps.length; i++) {
            ctx.beginPath();
            ctx.rect(powerUps[i][0], powerUps[i][1], powerUpSize, powerUpSize);
            ctx.fillStyle = getPowerUpColor(i);
            ctx.fill();
            ctx.closePath();
        }
    }

    function getPowerUpColor(i) {
        switch (powerUps[i][2]) {
            case 1:
                return "#0095DD";
            case 2:
                return "purple";
            case 3:
                return "green";
        }
    }

    function drawShots() {
        for (i = 0; i < activeShots.length; i++) {
            ctx.beginPath();
            ctx.arc(activeShots[i][0], activeShots[i][1], shotRadius, 0, Math.PI*2);
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.closePath();
        }
    }

    /* Detects collisions between the ball and the walls or bricks, causing ball to change direction and remove bricks if applicable */
    function ballCollisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if( b.status > 0) {
                    if (((y - ballRadius <= b.y + brickHeight && y + ballRadius > b.y + brickHeight) || (y + ballRadius >= b.y && y - ballRadius < b.y)) && (x >= b.x && x <= b.x + brickWidth)) {
                        dy = -dy;
                        y = y + dy;
                        x = x + dx;
                        b.status = b.status - 1;
                        score++;
                        if (b.powerUpType != 0) {
                            addPowerUp(b.x, b.y, b.powerUpType);
                            powerUpDropped = true;
                            bricks[c][r].powerUpType = 0;
                        }
                    }
                    if (((x - ballRadius <= b.x + brickWidth && x + ballRadius > b.x + brickWidth) || (x + ballRadius >= b.x && x - ballRadius < b.x)) && (y >= b.y && y <= b.y + brickHeight)) {
                        dx = -dx;
                        x = x + dx;
                        y = y + dy;
                        b.status = b.status - 1;
                        score++;
                        if (b.powerUpType != 0) {
                            addPowerUp(b.x, b.y, b.powerUpType);
                            powerUpDropped = true;
                            bricks[c][r].powerUpType = 0;
                        }
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
                    dx = randomDirection(2);
                    dy = assignDY();
                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }
    }

    function addPowerUp(brickX, brickY, powerUpType) {
        powerUps.push([brickX + (brickWidth / 2) - (powerUpSize / 2), brickY + brickHeight, powerUpType]);
    }

    function addShot() {
        activeShots.push([paddleX + (paddleWidth / 2), canvas.height + paddleHeight + shotRadius]);
    }

    function powerUpsCollisionDetection() {
        for (i = powerUps.length - 1; i >= 0; i--) {
            if (powerUps[i][1] + powerUpSize >= canvas.height -  paddleHeight && (powerUps[i][0] + powerUpSize >= paddleX && powerUps[i][0] <= paddleX + paddleWidth)) {
                applyPowerUp(i);
                powerUps.splice(i, 1);
                if (powerUps.length == 0) {
                    powerUpDropped = false;
                }
            } else if (powerUps[i][1] >= canvas.height) {
                powerUps.splice(i, 1);
                if (powerUps.length == 0) {
                    powerUpDropped = false;
                }
            }
        }
    }

    function applyPowerUp(i) {
        switch (powerUps[i][2]) {
            case 1:
                paddleWidth = 115;
                break;
            case 2:
                paddleGun = true;
                shotCount = shotCount + 5;
                paddleColor = "purple";
                break;
            case 3:
                lives = lives + 1;
                break;
        }
    }

    function shotsCollisionDetection() {
        for (i = activeShots.length - 1; i >= 0; i--) {
            let collisionFound = false;
            for (c = 0; c < brickColumnCount; c++) {
                for (r = 0; r < brickRowCount; r++) {
                    let b = bricks[c][r];
                    if( b.status > 0) {
                        if (activeShots[i] != undefined && activeShots[i][1] - shotRadius <= b.y + brickHeight && ((activeShots[i][0] - shotRadius < b.x + brickWidth && activeShots[i][0] - shotRadius >= b.x) || (activeShots[i][0] + shotRadius > b.x && activeShots[i][0] + shotRadius <= b.x + brickWidth))) {
                            b.status = b.status - 1;
                            score++;
                            collisionFound = true;
                            if (b.powerUpType != 0) {
                                addPowerUp(b.x, b.y, b.powerUpType);
                                powerUpDropped = true;
                                bricks[c][r].powerUpType = 0;
                            }
                        }
                    }
                }
            }
            if (collisionFound || activeShots[i][1] <= topMargin) {
                activeShots.splice(i, 1);
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

    function powerUpMovement() {
        for (i = 0; i < powerUps.length; i++) {
            powerUps[i][1] = powerUps[i][1] + 1;
        }
    }

    function shotsMovement() {
        for (i = 0; i < activeShots.length; i++) {
            activeShots[i][1] = activeShots[i][1] - shotSpeed;
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
        dx = randomDirection(2);
        dy = assignDY();
        paddleX = (canvas.width-paddleWidth)/2
        paddleWidth = 75;
        paddleColor = "#0095DD";
        brickRowCount = getBrickRowCount();
        bricks = getBrickParameters();
        powerUpDropped = false;
        powerUps = [];
        paddleGun = false;
        shotCount = 0;
        shotLoaded = false;
        activeShots = [];
    }
    
    /* Creates the game over screen */
    function drawGameOver() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        drawLives()
        drawTopBound();
        if (victory == false) {
            ctx.beginPath();
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER", (canvas.width / 2) - 138, 200);
            ctx.closePath();
            ctx.beginPath();
            ctx.font = "25px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Final Score: " + score, (canvas.width / 2) - 70, 250);
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = "green";
            ctx.fillText("VICTORY!", (canvas.width / 2) - 100, 200);
            ctx.closePath();
            ctx.beginPath();
            ctx.font = "25px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Final Score: " + score, (canvas.width / 2) - 70, 250);
            ctx.closePath();
        }
        addPlayAgainButton();
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