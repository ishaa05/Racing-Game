const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const level = document.querySelector('.level');

// AUDIO
let gameStart = new Audio("assets/audio/game_theme.mp3");
let gameOver = new Audio("assets/audio/gameOver_theme.mp3");

const levelSpeed = { easy: 3, moderate: 10, difficult: 14 };

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let player = { speed: 5, score: 0 };

// LEVEL SELECT
level.addEventListener('click', (e) => {
    player.speed = levelSpeed[e.target.id];
});

// START GAME
startScreen.addEventListener('click', () => {
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;

    gameStart.play();
    gameStart.loop = true;

    window.requestAnimationFrame(gamePlay);

    // ROAD LINES
    for (let i = 0; i < 5; i++) {
        let line = document.createElement('div');
        line.classList.add('roadLines');
        line.y = i * 150;
        line.style.top = line.y + "px";
        gameArea.appendChild(line);
    }

    // PLAYER CAR
    let car = document.createElement('div');
    car.classList.add('car');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // ENEMY CARS
    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemyCar');
        enemy.y = (i + 1) * -350;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * 350) + "px";
        enemy.style.backgroundColor = randomColor();
        gameArea.appendChild(enemy);
    }
});

// RANDOM COLOR
function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// COLLISION
function onCollision(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

// GAME OVER
function onGameOver() {
    player.start = false;
    gameStart.pause();
    gameOver.play();

    startScreen.classList.remove('hide');
    startScreen.innerHTML =
        "Game Over <br> Score: " + player.score + "<br> Tap to restart";
}

// ROAD MOVE
function moveRoadLines() {
    document.querySelectorAll('.roadLines').forEach(line => {
        if (line.y >= 700) line.y -= 750;
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

// ENEMY MOVE
function moveEnemyCars(car) {
    document.querySelectorAll('.enemyCar').forEach(enemy => {
        if (onCollision(car, enemy)) onGameOver();

        if (enemy.y >= 750) {
            enemy.y = -300;
            enemy.style.left = Math.floor(Math.random() * 350) + "px";
        }

        enemy.y += player.speed;
        enemy.style.top = enemy.y + "px";
    });
}

// GAME LOOP
function gamePlay() {
    let car = document.querySelector('.car');

    if (player.start) {
        moveRoadLines();
        moveEnemyCars(car);

        if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
        if (keys.ArrowDown && player.y < 600) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < 350) player.x += player.speed;

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        player.score++;
        score.innerHTML = "Score: " + player.score;

        window.requestAnimationFrame(gamePlay);
    }
}

// KEYBOARD
document.addEventListener('keydown', e => {
    keys[e.key] = true;
});
document.addEventListener('keyup', e => {
    keys[e.key] = false;
});

// 📱 MOBILE CONTROLS
function bindTouch(id, key) {
    const btn = document.getElementById(id);

    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys[key] = true;
    });

    btn.addEventListener('touchend', () => {
        keys[key] = false;
    });
}

bindTouch('up', 'ArrowUp');
bindTouch('down', 'ArrowDown');
bindTouch('left', 'ArrowLeft');
bindTouch('right', 'ArrowRight');