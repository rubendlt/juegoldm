const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const recordElement = document.getElementById('record'); // Nuevo elemento para mostrar el récord

// Crear la hitbox interna
const hitbox = document.createElement('div');
hitbox.classList.add('hitbox');
player.appendChild(hitbox);

let playerPosition = { x: gameContainer.clientWidth / 2 - 25, y: gameContainer.clientHeight - 60 };
const step = 5; // Reduce el paso para un movimiento más lento
let keysPressed = {}; // Almacena las teclas presionadas
let gameOver = false; // Indica si el juego ha terminado
let intervals = []; // Almacena los intervalos de movimiento de las gotas
let score = 0; // Puntuación actual
let record = localStorage.getItem('record') || 0; // Cargar el récord desde el almacenamiento local

// Mostrar el récord inicial
recordElement.textContent = `Récord: ${record}`;

// Actualizar la puntuación cada segundo
function updateScore() {
    if (gameOver) return;
    score++;
    scoreElement.textContent = `Puntuación: ${score}`;
}
setInterval(updateScore, 1000); // Incrementa la puntuación cada segundo

// Actualizar el récord si es superado
function updateRecord() {
    if (score > record) {
        record = score;
        localStorage.setItem('record', record); // Guardar el récord en el almacenamiento local
        recordElement.textContent = `Récord: ${record}`; // Actualizar el récord en la interfaz
    }
}

// Detectar teclas presionadas
document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

// Detectar teclas soltadas
document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Actualizar la posición del jugador continuamente
setInterval(() => {
    if (gameOver) return; // Detener el movimiento si el juego ha terminado
    if (keysPressed['ArrowLeft'] && playerPosition.x > 0) {
        playerPosition.x -= step;
    }
    if (keysPressed['ArrowRight'] && playerPosition.x < gameContainer.clientWidth - 70) { // Ajusta según el ancho del jugador
        playerPosition.x += step;
    }
    player.style.left = playerPosition.x + 'px';
}, 20); // Ajusta la frecuencia de actualización

// Generar proyectiles
function createProjectile() {
    if (gameOver) return; // No generar proyectiles si el juego ha terminado
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px'; // Ajusta el ancho
    projectile.style.top = '-30px'; // Asegúrate de que empiece fuera de la pantalla
    gameContainer.appendChild(projectile);

    moveProjectile(projectile);
}

// Mover proyectiles hacia abajo
function moveProjectile(projectile) {
    const fallInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(fallInterval); // Detener el movimiento si el juego ha terminado
            return;
        }

        const projectileTop = parseInt(projectile.style.top);
        projectile.style.top = projectileTop + 4 + 'px'; // Ajusta la velocidad de caída

        // Detectar colisión con el jugador
        if (checkCollision(projectile, player)) {
            clearInterval(fallInterval);
            projectile.remove();
            resetGame(); // Llama a la función de reinicio
            return; // Salir de la función después de la colisión
        }

        // Eliminar proyectil si sale del contenedor
        if (projectileTop > gameContainer.clientHeight) {
            clearInterval(fallInterval);
            projectile.remove();
        }
    }, 20); // Ajusta la frecuencia de actualización

    intervals.push(fallInterval); // Almacena el intervalo para detenerlo después
}

// Detectar colisión
function checkCollision(projectile, player) {
    const hitbox = player.querySelector('.hitbox'); // Selecciona la hitbox interna
    const projectileRect = projectile.getBoundingClientRect();
    const hitboxRect = hitbox.getBoundingClientRect();

    return !(
        projectileRect.bottom < hitboxRect.top ||
        projectileRect.top > hitboxRect.bottom ||
        projectileRect.right < hitboxRect.left ||
        projectileRect.left > hitboxRect.right
    );
}

// Reiniciar el juego
function resetGame() {
    gameOver = true; // Marcar el juego como terminado

    // Actualizar el récord si es necesario
    updateRecord();

    // Detener todos los intervalos de movimiento de las gotas
    intervals.forEach((interval) => clearInterval(interval));
    intervals = [];

    // Eliminar todas las gotas existentes
    document.querySelectorAll('.projectile').forEach((projectile) => projectile.remove());

    // Crear el botón de reinicio
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar';
    restartButton.style.position = 'absolute';
    restartButton.style.top = '50%';
    restartButton.style.left = '50%';
    restartButton.style.transform = 'translate(-50%, -50%)';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '18px';
    restartButton.style.backgroundColor = '#ff4d4d';
    restartButton.style.color = '#fff';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    restartButton.style.cursor = 'pointer';
    restartButton.style.zIndex = '1000';

    // Agregar el botón al contenedor del juego
    gameContainer.appendChild(restartButton);

    // Reiniciar el juego al hacer clic en el botón
    restartButton.addEventListener('click', () => {
        location.reload();
    });
}

// Generar proyectiles continuamente con intervalo decreciente
let projectileInterval = 1200; // Tiempo inicial entre proyectiles (en milisegundos)
let minInterval = 500; // Tiempo mínimo entre proyectiles
let intervalDecrement = 100; // Cantidad que se reduce el intervalo cada vez
let intervalId;
let projectilesPerInterval = 1; // Número inicial de gotas por intervalo

function startProjectileGeneration() {
    // Generar gotas rápidamente al inicio
    for (let i = 0; i < 2; i++) { // Generar gotas al inicio
        setTimeout(() => createProjectile(), i * 200); // Cada ms
    }

    // Iniciar el intervalo decreciente
    intervalId = setInterval(() => {
        // Generar múltiples gotas por intervalo
        for (let i = 0; i < projectilesPerInterval; i++) {
            createProjectile();
        }

        // Reducir el intervalo progresivamente
        if (projectileInterval > minInterval) {
            projectileInterval -= intervalDecrement;
            clearInterval(intervalId); // Reinicia el intervalo con el nuevo tiempo
            startProjectileGeneration();
        }

        // Incrementar el número de gotas con el tiempo
        if (projectilesPerInterval < 5) { // Límite máximo de 5 gotas por intervalo
            projectilesPerInterval += 0.1; // Incrementa lentamente
        }
    }, projectileInterval);
}

// Inicia la generación de proyectiles
startProjectileGeneration();
