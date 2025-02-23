const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4EC0CA',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let bird;
let pipes;
let spaceBar;
let gameOver = false;
let score = 0;
let scoreText;
let background;
let ground;
let bullets;
let xKey;

function preload() {
    // Carrega os sprites do Flappy Bird
    this.load.spritesheet('bird', 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/yellowbird-midflap.png', {
        frameWidth: 34,
        frameHeight: 24
    });
    
    // Carrega a imagem do cano
    this.load.image('pipe', 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/pipe-green.png');
    
    // Carrega o fundo e o chão
    this.load.image('background', 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/background-day.png');
    this.load.image('ground', 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/base.png');

    // Carrega a imagem do tiro
    this.load.image('bullet', 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/redbird-midflap.png');
}

function create() {
    // Adiciona o fundo
    background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background');
    background.setOrigin(0, 0);
    background.setScale(2);

    // Adiciona o chão
    ground = this.add.tileSprite(0, game.config.height - 112, game.config.width, 112, 'ground');
    ground.setOrigin(0, 0);
    ground.setScale(2);

    // Cria o pássaro
    bird = this.physics.add.sprite(100, 300, 'bird');
    bird.setScale(2);
    bird.setCollideWorldBounds(true);

    // Cria o grupo de canos
    pipes = this.physics.add.group();

    // Configura a colisão entre o pássaro e os canos
    this.physics.add.collider(bird, pipes, gameEnd, null, this);

    // Adiciona o texto da pontuação
    scoreText = this.add.text(16, 16, 'Score: 0', { 
        fontSize: '32px', 
        fill: '#fff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 6
    });

    // Configura a tecla de espaço
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Cria o grupo de tiros
    bullets = this.physics.add.group();

    // Configura a tecla X
    xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // Cria os canos iniciais
    createPipes.call(this);

    // Adiciona colisão entre tiros e canos
    this.physics.add.collider(bullets, pipes, destroyPipe, null, this);

    // Cria um temporizador para gerar novos canos
    this.time.addEvent({
        delay: 2000,
        callback: createPipes,
        callbackScope: this,
        loop: true
    });
}

function update() {
    if (gameOver) {
        return;
    }

    // Move o fundo e o chão
    background.tilePositionX += 0.5;
    ground.tilePositionX += 2;

    // Faz o pássaro pular quando a tecla de espaço é pressionada
    if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
        bird.setVelocityY(-400);
        // Rotaciona o pássaro para cima quando pula
        bird.angle = -20;
    } else {
        // Rotaciona o pássaro para baixo gradualmente
        if (bird.angle < 20) {
            bird.angle += 1;
        }
    }

    // Adiciona a lógica de tiro
    if (Phaser.Input.Keyboard.JustDown(xKey)) {
        shoot();
    }

    // Remove os canos que saíram da tela
    pipes.getChildren().forEach(function(pipe) {
        if (pipe.x < -50) {
            pipe.destroy();
        }
    });

    // Remove os tiros que saíram da tela
    bullets.getChildren().forEach(function(bullet) {
        if (bullet.x > 800) {
            bullet.destroy();
        }
    });
}

function createPipes() {
    if (gameOver) {
        return;
    }

    const gap = 150;
    const opening = Math.floor(Math.random() * (400 - 200)) + 200;

    // Cria o cano superior
    const topPipe = pipes.create(800, opening - gap, 'pipe');
    topPipe.setOrigin(0.5, 1);
    topPipe.body.allowGravity = false;
    topPipe.setVelocityX(-200);
    topPipe.setImmovable(true);
    // Gira o cano superior
    topPipe.flipY = true;

    // Cria o cano inferior
    const bottomPipe = pipes.create(800, opening + gap/2, 'pipe');
    bottomPipe.setOrigin(0.5, 0);
    bottomPipe.body.allowGravity = false;
    bottomPipe.setVelocityX(-200);
    bottomPipe.setImmovable(true);

    this.time.delayedCall(1500, function() {
        if (!gameOver) {
            score += 1;
            scoreText.setText('Score: ' + score);
        }
    }, [], this);
}

function gameEnd() {
    gameOver = true;
    this.physics.pause();
    
    const gameOverText = this.add.text(400, 300, 'Game Over\nClick to Restart', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 6
    });
    gameOverText.setOrigin(0.5);

    this.input.on('pointerdown', function() {
        gameOver = false;
        score = 0;
        this.scene.restart();
    }, this);
}

// Função para atirar
function shoot() {
    const bullet = bullets.create(bird.x + 30, bird.y, 'bullet');
    bullet.setScale(0.5);
    bullet.setVelocityX(400);
    bullet.body.allowGravity = false;
}

// Função para destruir o cano quando atingido
function destroyPipe(bullet, pipe) {
    bullet.destroy();
    pipe.destroy();
    
    // Adiciona pontos extras por destruir o cano
    score += 2;
    scoreText.setText('Score: ' + score);
} 