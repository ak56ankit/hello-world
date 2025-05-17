const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const bird = { x: 50, y: canvas.height / 2, width: 20, height: 20, gravity: 0.6, lift: -10, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function reset() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
}

function createPipe() {
    const gap = 100;
    const top = Math.random() * (canvas.height - gap - 40) + 20;
    pipes.push({ x: canvas.width, top, bottom: top + gap, width: 40 });
}

function update() {
    if (gameOver) return;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (frame % 90 === 0) createPipe();

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    pipes.forEach(pipe => {
        if (pipe.x < bird.x + bird.width && pipe.x + pipe.width > bird.x) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) {
                gameOver = true;
            }
        }
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.passed = true;
        }
    });

    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f00';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = '#0f0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });

    ctx.fillStyle = '#000';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Score: ${score}`, 10, 25);

    if (gameOver) {
        ctx.textAlign = 'center';
        ctx.fillText('Game Over - Click to Restart', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'start';
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', () => {
    if (gameOver) return reset();
    bird.velocity = bird.lift;
});

document.addEventListener('click', () => {
    if (gameOver) return reset();
    bird.velocity = bird.lift;
});

loop();
