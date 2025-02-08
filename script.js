const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const startButton = document.getElementById("startButton");

// Detectar si es un dispositivo móvil
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const SPEED_MULTIPLIER = isMobile ? 1.8 : 1.5; // Ajuste balanceado

// Configuración del juego
canvas.width = 320;
canvas.height = 480;

// Cargar imágenes
const birdImg = new Image();
birdImg.src = "bird.png";

const pipeTopImg = new Image();
pipeTopImg.src = "pipeTop.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "pipeBottom.png";

// Cargar música de fondo
const backgroundMusic = new Audio("background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

let bird = null;
let pipes = [];
let frame = 0;
let score = 0;
let lastRewardScore = 0;
let gameRunning = false;

const rewards = {
    50: "Cupón válido para ir a tomar un café",
    100: "Cupón válido para arreglarnos las uñas",
    150: "Cupón válido para ir a un restaurante",
    200: "Cupón válido para una compra irresponsable de Shein 🙈",
    250: "Cupón válido para un producto de skincare de su elección",
    300: "Cupón válido para ir al cine a ver una película juntos",
    350: "Cupón válido para una tarde de SPA juntos",
    400: "Cupón válido para recibir un libro ❤️",
    450: "Cupón válido para una cena juntos",
    500: "Cupón válido para una noche juntos en un pueblito",
    550: "Cupón válido para ir a brunchear juntos",
    600: "Cupón válido para ir a acampar juntos",
    650: "Cupón válido para ir a jugar bolos juntos",
    700: "Cupón válido para ir a un SPA",
    750: "Cupón válido para ir a una obra de teatro juntos",
    800: "Cupón válido para ir a un concierto juntos (de tu elección)",
    850: "Cupón válido para un día de deportes extremos",
    900: "Cupón válido para ir a karts a darnos en la madre",
    950: "Cupón válido para ir a una experiencia sorpresa 🙈",
    1000: "Cupón válido para un viaje..."
};

// Iniciar el juego
function startGame() {
    startButton.style.display = "none";

    bird = {
        x: 50,
        y: canvas.height / 2,
        width: 40,
        height: 30,
        gravity: 0.25 * SPEED_MULTIPLIER,
        lift: -6 * SPEED_MULTIPLIER,
        velocity: 0
    };

    pipes = [];
    frame = 0;
    score = 0;
    lastRewardScore = 0;
    scoreDisplay.textContent = "0";
    gameRunning = true;

    backgroundMusic.play();
    loop();
}

// Dibujar personaje
function drawBird() {
    if (bird) {
        ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
}

// Dibujar tubos
function drawPipes() {
    for (let pipe of pipes) {
        ctx.drawImage(pipeTopImg, pipe.x, pipe.yTop, pipe.width, pipe.heightTop);
        ctx.drawImage(pipeBottomImg, pipe.x, pipe.yBottom, pipe.width, pipe.heightBottom);
    }
}

// Verificar premios
function checkForReward() {
    for (let points in rewards) {
        if (score >= points && lastRewardScore < points) {
            lastRewardScore = points;
            showRewardMessage(points, rewards[points]);
            break;
        }
    }
}

// Mostrar mensaje de premio
function showRewardMessage(points, reward) {
    const rewardMessage = document.createElement("div");
    rewardMessage.classList.add("reward-message");
    rewardMessage.innerHTML = `<p>🎉 ¡Felicidades! Hiciste ${points} puntos.</p><p>🎁 ¡Has ganado: ${reward}!</p>`;
    
    document.body.appendChild(rewardMessage);

    setTimeout(() => {
        rewardMessage.remove();
    }, 3000);
}

// Actualizar juego
function update() {
    if (!gameRunning || !bird) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generar tubos más rápido pero no demasiado
    if (frame % 80 === 0) {
        let gap =200;
        let pipeHeightTop = Math.random() * (canvas.height - gap - 100) + 50;
        let pipeHeightBottom = canvas.height - pipeHeightTop - gap;
        pipes.push({
            x: canvas.width,
            yTop: 0,
            yBottom: canvas.height - pipeHeightBottom,
            width: 50,
            heightTop: pipeHeightTop,
            heightBottom: pipeHeightBottom
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2.5 * SPEED_MULTIPLIER; // Tubos más rápidos, pero equilibrados con el pájaro

        let margin = 10;
        if (
            bird.x + margin < pipes[i].x + pipes[i].width &&
            bird.x + bird.width - margin > pipes[i].x &&
            (bird.y + margin < pipes[i].heightTop || bird.y + bird.height - margin > pipes[i].yBottom)
        ) {
            gameOver();
        }

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            score++;
            scoreDisplay.textContent = score;
            checkForReward();
        }
    }

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }

    frame++;
}

// Dibujar juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
}

// Reiniciar juego
function gameOver() {
    alert("¡Game Over! Puntuación: " + score);

    let lastValidReward = 0;
    for (let points in rewards) {
        if (score >= points) {
            lastValidReward = points;
        }
    }
    if (lastValidReward > 0) {
        showRewardMessage(lastValidReward, rewards[lastValidReward]);
    }

    gameRunning = false;
    startButton.style.display = "block";
}

// Bucle de juego
function loop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(loop);
    }
}

// Controles
function jump() {
    if (gameRunning && bird) {
        bird.velocity = bird.lift;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

document.addEventListener("touchstart", () => {
    jump();
});

// Iniciar juego en DOM load
document.addEventListener("DOMContentLoaded", () => {
    startButton.addEventListener("click", startGame);
});
