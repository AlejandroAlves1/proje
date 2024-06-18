// Obtém os elementos do DOM necessários
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Define as dimensões do canvas
canvas.width = 320;
canvas.height = 480;

// Configura a força do pulo
const jumpStrength = -8;

// Carrega a imagem do pássaro (GIF)
const birdImg = new Image();
birdImg.src = 'bird.gif'; // Certifique-se de que o caminho para a imagem esteja correto

// Objeto bird que representa o pássaro no jogo
const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: jumpStrength,
    velocity: 0,
    // Desenha o pássaro no canvas
    draw() {
        context.drawImage(birdImg, this.x, this.y, this.width, this.height);
    },
    // Atualiza a posição do pássaro baseado na gravidade e velocidade
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        // Verifica se o pássaro toca o chão ou o topo do canvas
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    // Faz o pássaro pular
    flap() {
        this.velocity = this.lift;
    }
};

// Array para armazenar os canos
const pipes = [];
const pipeWidth = 52; // Largura do cano ajustada para o tamanho da imagem
const pipeGap = 100; // Gap entre os canos superior e inferior
let frame = 0;
let gameStarted = false;

// Carrega as imagens dos canos
const pipeTopImg = new Image();
pipeTopImg.src = 'pipeTop.png';
const pipeBottomImg = new Image();
pipeBottomImg.src = 'pipeBottom.png';
const pipeFillImg = new Image();
pipeFillImg.src = '/pipeBottom.png';

// Função para adicionar um novo cano ao jogo
function addPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        width: pipeWidth,
        height: pipeHeight
    });
}

// Atualiza a posição dos canos
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
        // Remove o cano do array se ele sair da tela
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
        }
    });
    // Adiciona um novo cano a cada 90 frames
    if (frame % 90 === 0) {
        addPipe();
    }
}

// Desenha os canos no canvas
function drawPipes() {
    if (pipeFillImg.complete && pipeTopImg.complete && pipeBottomImg.complete) {
        const pattern = context.createPattern(pipeFillImg, 'repeat');
        pipes.forEach(pipe => {
            context.save();
            context.fillStyle = pattern;
            context.fillRect(pipe.x, pipe.y - pipeTopImg.height, pipeWidth, pipeTopImg.height);
            context.drawImage(pipeTopImg, pipe.x, pipe.y - pipeTopImg.height);
            context.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));
            context.drawImage(pipeBottomImg, pipe.x, pipe.y + pipeGap);
            context.restore();
        });
    }
}

// Verifica se o pássaro colide com os canos
function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) {
            resetGame();
        }
    });
}

// Reseta o jogo para o estado inicial
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    gameStarted = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    context.font = "20px Arial";
    context.fillStyle = "#000";
    context.fillText("Pressione Espaço para Iniciar", 50, canvas.height / 2);
    startScreen.style.display = 'flex';
}

// Loop principal do jogo
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (gameStarted) {
        bird.update();
        bird.draw();
        updatePipes();
        drawPipes();
        checkCollision();
        frame++;
    } else {
        bird.draw();
        context.font = "20px Arial";
        context.fillStyle = "#000";
        context.fillText("Pressione Espaço para Iniciar", 50, canvas.height / 2);
    }
    requestAnimationFrame(gameLoop);
}

// Evento para iniciar o jogo ao pressionar a tecla Espaço
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            pipes.length = 0;
            frame = 0;
            bird.y = 150;
            bird.velocity = 0;
            startScreen.style.display = 'none';
        }
        bird.flap();
    }
});

// Evento para iniciar o jogo ao clicar no botão de iniciar
startButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        pipes.length = 0;
        frame = 0;
        bird.y = 150;
        bird.velocity = 0;
        startScreen.style.display = 'none';
    }
    bird.flap();
});

// Inicia o loop do jogo
gameLoop();
