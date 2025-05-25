import { Message } from "../message-box.js";
import { startAnimation } from "../speaker/speaker-box.js";

let wasGame2SpeakerPlayed = localStorage.getItem("wasGame2SpeakerPlayed");
        
if (wasGame2SpeakerPlayed != 'true') {
    startAnimation("Na tym etapie musisz wykazać się logicznym myśleniem, ale uwaga, nie wszystko jest takie, jak się wydaje! Uważaj na każdy krok, ponieważ wirtualny świat jest pełen wyłudzeń. Pamiętaj, w internecie może się pojawić wiele tanich, fałszywch ofert związanych z kupnem różnych przedmiotów - myśl świadomie, gdyż w ostateczności może się okazać, że jest to wyłudzenie. Nie zawsze wszystko, co wygląda na bezpieczne, jest naprawdę bezpieczne!", "../speaker/voice/Gra2.wav");
    localStorage.setItem("wasGame2SpeakerPlayed", "true");
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resetButton = document.getElementById("resetButton");

canvas.width = 320;
canvas.height = 480;

let birdY = canvas.height / 2;
let birdVelocity = 0;
let gravity = 0.3;
let lift = -6;
let birdWidth = 40;
let birdHeight = 30;

let isGameOver = false;
let gameStarted = false;

let pipes = [];
let pipeWidth = 60;
let pipeGap = 120;
let pipeSpeed = 2;
let pipeInterval = 150;
let pipeTimer = 0;
let score = 0;

// Load bird image
const birdImage = new Image();
birdImage.src = "bird.png"; // Upewnij się, że masz ten obraz w odpowiedniej ścieżce

// Start the game when clicked or key is pressed
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
    if (!gameStarted) {
        startGame();
    }
});

canvas.addEventListener("click", () => {
    if (!gameStarted) {
        startGame();
    }
    jump();
});

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        resetButton.style.display = "none";
        gameLoop();
    }
}

function jump() {
    if (gameStarted && !isGameOver) {
        birdVelocity = lift;
    }
}

function gameLoop() {
    if (isGameOver) {
        if (score >= 20) {
            if (localStorage.getItem("IsLevelTwoFinished") != "true") {
                Message(1, "info", "Gratulacje wygrania gry! Level 3 odblokowany.");
                localStorage.setItem("IsLevelTwoFinished", "true");
            } else {
                Message(1, "info", "Gratulacje wygrania gry!");
            }
            return;
        } else {
            ctx.font = "30px 'Jersey 15'";
            ctx.fillText("GAME OVER", 80, canvas.height / 2);
            ctx.fillText("SCORE: " + score, 100, canvas.height / 2 + 40);
            resetButton.style.display = "block";
            return;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gravity effect on bird
    birdVelocity += gravity;
    birdY += birdVelocity;
    
    // Draw bird as an image
    ctx.drawImage(birdImage, 50, birdY, birdWidth, birdHeight);
    
    // Handle bird boundaries
    if (birdY <= 0 || birdY + birdHeight >= canvas.height) {
        gameOver();
    }

    // Pipe creation and movement
    pipeTimer++;
    if (pipeTimer >= pipeInterval) {
        createPipe();
        pipeTimer = 0;
    }

    // Move and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Draw pipes
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);

        // Check collision with pipes
        if (
            50 + birdWidth > pipe.x &&
            50 < pipe.x + pipeWidth &&
            (birdY < pipe.top || birdY + birdHeight > pipe.bottom)
        ) {
            gameOver();
        }

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    // Draw score
    ctx.fillStyle = "#fff";
    ctx.font = "30px 'Jersey 15'";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(gameLoop);
}

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap,
    });
}

function gameOver() {
    isGameOver = true;
}

function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    gameStarted = false;
    pipeTimer = 0;
    resetButton.style.display = "none";
    startGame();
}

document.querySelector("#resetButton").addEventListener("click", resetGame);
