const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');

let playerPosition = { x: gameContainer.clientWidth / 2 - 25, y: gameContainer.clientHeight - 60 };

// Mover el jugador hacia los lados
document.addEventListener('keydown', (e) => {
    const step = 15;  
    if (e.key === 'ArrowLeft' && playerPosition.x > 0) {
        playerPosition.x -= step; 
    } else if (e.key === 'ArrowRight' && playerPosition.x < gameContainer.clientWidth - 50) {
        playerPosition.x += step;  
    }

    player.style.left = playerPosition.x + 'px';
});

// Generar proyectiles
function createProjectile() {
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
        const projectileTop = parseInt(projectile.style.top);
        projectile.style.top = projectileTop + 4 + 'px'; // Ajusta la velocidad de caída

        // Detectar colisión con el jugador
        if (checkCollision(projectile, player)) {
            alert('¡Has perdido!');
            clearInterval(fallInterval);
            projectile.remove();
            resetGame();
        }

        // Eliminar proyectil si sale del contenedor
        if (projectileTop > gameContainer.clientHeight) {
            clearInterval(fallInterval);
            projectile.remove();
        }
    }, 20); // Ajusta la frecuencia de actualización
}

// Detectar colisión
function checkCollision(projectile, player) {
    const projectileRect = projectile.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    return !(
        projectileRect.bottom < playerRect.top ||
        projectileRect.top > playerRect.bottom ||
        projectileRect.right < playerRect.left ||
        projectileRect.left > playerRect.right
    );
}

// Reiniciar el juego
function resetGame() {
    location.reload();
}

// Generar proyectiles continuamente
setInterval(createProjectile, 1000);
