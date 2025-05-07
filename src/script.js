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

let projectileInterval = 1200;
const minInterval = 500;
const intervalDecrement = 100;
let intervalId;
let projectilesPerInterval = 1;

recordElement.textContent = `Récord: ${record}`;

// Función para actualizar la puntuación
function updateScore() {
    if (gameOver) return;
    score++;
    scoreElement.textContent = `Puntuación: ${score}`;
}

// Función para actualizar el récord si es superado
function updateRecord() {
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
        recordElement.textContent = `Récord: ${record}`;
    }
}

// Función para generar proyectiles
function createProjectile() {
    if (gameOver) return;

    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    projectile.style.top = '-30px';
    gameContainer.appendChild(projectile);

    moveProjectile(projectile);
}

// Función para mover proyectiles hacia abajo
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

// Función para detectar colisiones
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

// Función para reiniciar el juego
function resetGame() {
    gameOver = true;

    updateRecord();

    intervals.forEach((interval) => clearInterval(interval));
    intervals = [];

    if (intervalId) clearInterval(intervalId);

    document.querySelectorAll('.projectile').forEach((projectile) => projectile.remove());

    createRestartButton();
}

// Función para crear el botón de reinicio
function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar';
    styleButton(restartButton, '#ff4d4d');

    gameContainer.appendChild(restartButton);

    restartButton.addEventListener('click', () => {
        restartButton.remove();
        startGame();
    });
}

// Función para generar proyectiles continuamente
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

// Función para crear el botón de inicio
function createStartButton() {
    if (document.querySelector('#start-button')) return;

    const startButton = document.createElement('button');
    startButton.id = 'start-button';
    startButton.textContent = 'Iniciar Juego';
    styleButton(startButton, '#4CAF50');

    gameContainer.appendChild(startButton);

    startButton.addEventListener('click', () => {
        startButton.remove();
        startGame();
    });
}

// Función para aplicar estilos a los botones
function styleButton(button, backgroundColor) {
    button.style.position = 'absolute';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '18px';
    button.style.backgroundColor = backgroundColor;
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
}

// Función para iniciar el juego
function startGame() {
    gameOver = false;
    score = 0;
    scoreElement.textContent = `Puntuación: ${score}`;

    // Reiniciar dificultad
    projectileInterval = 1200;
    projectilesPerInterval = 1;

    // Reiniciar posición del jugador
    playerPosition.x = gameContainer.clientWidth / 2 - 25;
    player.style.left = playerPosition.x + 'px';

    startProjectileGeneration();
}

// Manejo de movimiento del jugador
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

// Inicialización
setInterval(updateScore, 1000);
createStartButton();
