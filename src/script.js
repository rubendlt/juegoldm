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
