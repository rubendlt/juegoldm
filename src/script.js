// Variables globales
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const recordElement = document.getElementById('record');

const hitbox = document.createElement('div');
hitbox.classList.add('hitbox');
player.appendChild(hitbox);

let playerPosition = { x: gameContainer.clientWidth / 2 - 25, y: gameContainer.clientHeight - 60 };
const step = 5;
let keysPressed = {};
let gameOver = false;
let intervals = [];
let score = 0;
let record = localStorage.getItem('record') || 0;
let scoreIntervalId;

let projectileInterval = 1200;
const minInterval = 500;
const intervalDecrement = 100;
let intervalId;
let projectilesPerInterval = 1;

recordElement.textContent = `Récord: ${record}`;

function updateScore() {
    if (gameOver) return;
    score++;
    scoreElement.textContent = `Puntuación: ${score}`;
}

function updateRecord() {
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
        recordElement.textContent = `Récord: ${record}`;
    }
}

function createProjectile() {
    if (gameOver) return;

    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    projectile.style.top = '-30px';
    gameContainer.appendChild(projectile);

    moveProjectile(projectile);
}

function moveProjectile(projectile) {
    const fallInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallInterval);
            return;
        }

        const projectileTop = parseInt(projectile.style.top);
        projectile.style.top = projectileTop + 4 + 'px';

        if (checkCollision(projectile, player)) {
            clearInterval(fallInterval);
            projectile.remove();
            resetGame();
            return;
        }

        if (projectileTop > gameContainer.clientHeight) {
            clearInterval(fallInterval);
            projectile.remove();
        }
    }, 20);

    intervals.push(fallInterval);
}

function checkCollision(projectile, player) {
    const hitbox = player.querySelector('.hitbox');
    const projectileRect = projectile.getBoundingClientRect();
    const hitboxRect = hitbox.getBoundingClientRect();

    return !(
        projectileRect.bottom < hitboxRect.top ||
        projectileRect.top > hitboxRect.bottom ||
        projectileRect.right < hitboxRect.left ||
        projectileRect.left > hitboxRect.right
    );
}

function resetGame() {
    gameOver = true;

    updateRecord();

    clearInterval(intervalId);
    clearInterval(scoreIntervalId);
    intervals.forEach((interval) => clearInterval(interval));
    intervals = [];

    document.querySelectorAll('.projectile').forEach((projectile) => projectile.remove());

    createRestartButton();
}

function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar';
    restartButton.classList.add('game-button', 'restart');
    gameContainer.appendChild(restartButton);

    restartButton.addEventListener('click', () => {
        restartButton.remove();
        startGame();
    });
}

function startProjectileGeneration() {
    for (let i = 0; i < 2; i++) {
        setTimeout(() => createProjectile(), i * 200);
    }

    intervalId = setInterval(() => {
        for (let i = 0; i < projectilesPerInterval; i++) {
            createProjectile();
        }

        if (projectileInterval > minInterval) {
            projectileInterval -= intervalDecrement;
            clearInterval(intervalId);
            startProjectileGeneration();
        }

        if (projectilesPerInterval < 5) {
            projectilesPerInterval += 0.1;
        }
    }, projectileInterval);
}

function createStartButton() {
    if (document.querySelector('#start-button')) return;

    const startButton = document.createElement('button');
    startButton.id = 'start-button';
    startButton.textContent = 'Iniciar Juego';
    startButton.classList.add('game-button', 'start');
    gameContainer.appendChild(startButton);

    startButton.addEventListener('click', () => {
        startButton.remove();
        startGame();
    });
}

function startGame() {
    gameOver = false;
    score = 0;
    projectileInterval = 1200;
    projectilesPerInterval = 1;
    playerPosition.x = gameContainer.clientWidth / 2 - 25; // Centrar jugador
    player.style.left = playerPosition.x + 'px';
    scoreElement.textContent = `Puntuación: ${score}`;
    startProjectileGeneration();
    scoreIntervalId = setInterval(updateScore, 1000);
}

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

setInterval(() => {
    if (gameOver) return;

    if (keysPressed['ArrowLeft'] && playerPosition.x > 0) {
        playerPosition.x -= step;
    }
    if (keysPressed['ArrowRight'] && playerPosition.x < gameContainer.clientWidth - 70) {
        playerPosition.x += step;
    }

    player.style.left = playerPosition.x + 'px';
}, 20);

createStartButton();
