import {Message} from '../message-box.js';
import { startAnimation } from "../speaker/speaker-box.js";

let wasGame6SpeakerPlayed = localStorage.getItem("wasGame6SpeakerPlayed");
        
if (wasGame6SpeakerPlayed != 'true') {
    startAnimation("Czas na finał! W tej wersji klasycznego Space Invaders stajesz się pilotem statku kosmicznego, którego zadaniem jest obrona systemu przed nadciągającymi cyberzagrożeniami. Każdy nadlatujący statek reprezentuje próbę włamania lub ataku na twoje dane. Twoim celem jest eliminacja wszystkich intruzów zanim dotrą do dolnej granicy ekranu, co symbolizuje kompromitację twojego systemu.", "../speaker/voice/Gra6.wav");
    localStorage.setItem("wasGame6SpeakerPlayed", "true");
}

document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Flaga przegranej gry
let gameOver = false;
// Flaga, która kontroluje wyświetlenie komunikatu (aby alert pojawił się tylko raz)
let messageShown = false;

// Ustawienia gracza (prędkość zmniejszona)
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60, // podniesienie pozycji gracza
    width: 50,
    height: 20,
    speed: 3,
    color: "green"
    };
    
    

// Sterowanie
const keys = {};

// Pociski gracza
const bullets = [];

// Pociski przeciwników (oraz bossa)
const enemyBullets = [];

// Ograniczenie tempa strzałów gracza (cooldown 300ms)
let lastShotTime = 0;
const shotCooldown = 300; // w milisekundach

// Poziom strzału – początkowo 1; maksymalnie 3
let shotLevel = 1;
const maxShotLevel = 3;

// Ustawienia przeciwników (zwykłych)
const enemyConfig = {
    rows: 3,
    cols: 8,
    width: 40,
    height: 20,
    padding: 20,
    offsetTop: 50,
    offsetLeft: 50,
    color: "red",
    speed: 1.3,
    drop: 20
};

let enemies = [];
let enemyDirection = 1; // 1 - w prawo, -1 - w lewo

// Bloki ochronne – gracz może się za nie schować; każdy blok znika po 10 trafieniach
const blocks = [];
const blockConfig = {
    width: 120,
    height: 40,
    hitsToDestroy: 10,
    y: canvas.height - 200
};

function createBlocks() {
    blocks.length = 0;
    const gap = (canvas.width - (3 * blockConfig.width)) / 4;
    for (let i = 0; i < 3; i++) {
    const blockX = gap + i * (blockConfig.width + gap);
    blocks.push({
        x: blockX,
        y: blockConfig.y,
        width: blockConfig.width,
        height: blockConfig.height,
        hits: 0
    });
    }
}

function createEnemies() {
    enemies = [];
    for (let row = 0; row < enemyConfig.rows; row++) {
    for (let col = 0; col < enemyConfig.cols; col++) {
        const enemyX = enemyConfig.offsetLeft + col * (enemyConfig.width + enemyConfig.padding);
        const enemyY = enemyConfig.offsetTop + row * (enemyConfig.height + enemyConfig.padding);
        enemies.push({
        x: enemyX,
        y: enemyY,
        width: enemyConfig.width,
        height: enemyConfig.height,
        color: enemyConfig.color,
        health: 1  // Każdy przeciwnik musi zostać trafiony 2 razy
        });
    }
    }
}

// Boss – obiekt globalny (na początku null)
let boss = null;
let bossShootInterval = null;
let bossSpawned = false;

function spawnBoss() {
    boss = {
    x: canvas.width / 2 - 75,
    y: 30,
    width: 150,
    height: 50,
    health: 30,
    dx: 2,
    color: "#940000"
    };
    bossSpawned = true;
    // Boss strzela co 800 ms (szybciej niż wcześniej)
    bossShootInterval = setInterval(bossShoot, 800);
}

function bossShoot() {
    if (!boss) return;
    const numBullets = 8;
    const gap = boss.width / (numBullets + 1);
    for (let i = 0; i < numBullets; i++) {
    enemyBullets.push({
        x: boss.x + gap * (i + 1) - 2.5,
        y: boss.y + boss.height,
        width: 5,
        height: 10,
        speed: 2  // Zmniejszona szybkość pocisków bossa
    });
    }
}

function updateBoss() {
    if (boss) {
    boss.x += boss.dx;
    if (boss.x < 0 || boss.x + boss.width > canvas.width) {
        boss.dx *= -1;
    }
    }
}

function drawBoss() {
    if (boss) {
    ctx.fillStyle = boss.color;
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
    // Rysowanie punktów życia bossa
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(boss.health, boss.x + boss.width / 2 - 5, boss.y + boss.height / 2 + 5);
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
    ctx.fillStyle = "white";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach(bullet => {
    ctx.fillStyle = "orange";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawBlocks() {
    blocks.forEach(block => {
    const opacity = Math.max(0, 1 - block.hits / blockConfig.hitsToDestroy);
    ctx.fillStyle = `rgba(161, 253, 3, ${opacity})`;
    ctx.fillRect(block.x, block.y, block.width, block.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
}

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Space") {
    shoot();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function updatePlayer() {
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }
    // Zapewnienie, że gracz nie wychodzi poza granice canvasu
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    }
    

function isColliding(a, b) {
    return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
    );
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    if (bullet.y < 0 || bullet.x < 0 || bullet.x > canvas.width) {
        bullets.splice(i, 1);
        continue;
    }
    let hit = false;
    // Kolizja z przeciwnikami (zwykłymi)
    for (let j = enemies.length - 1; j >= 0; j--) {
        if (isColliding(bullet, enemies[j])) {
        // Zmniejszamy zdrowie przeciwnika
        enemies[j].health--;
        // Usuwamy przeciwnika, jeśli zdrowie spadnie do 0
        if (enemies[j].health <= 0) {
            enemies.splice(j, 1);
            // 33% szans na ulepszenie strzału (jeśli nie osiągnięto maksymalnego poziomu)
            if (Math.random() < 0.33 && shotLevel < maxShotLevel) {
            shotLevel++;
            }
        }
        bullets.splice(i, 1);
        hit = true;
        break;
        }
    }
    if (hit) continue;
    // Kolizja z blokami
    for (let k = blocks.length - 1; k >= 0; k--) {
        if (isColliding(bullet, blocks[k])) {
        blocks[k].hits++;
        if (blocks[k].hits >= blockConfig.hitsToDestroy) {
            blocks.splice(k, 1);
        }
        bullets.splice(i, 1);
        hit = true;
        break;
        }
    }
    if (hit) continue;
    // Kolizja z bossem
    if (boss && isColliding(bullet, boss)) {
        boss.health--;
        bullets.splice(i, 1);
        if (boss.health <= 0) {
        boss = null;
        clearInterval(bossShootInterval);
        }
        continue;
    }
    }
}

function updateEnemies() {
    let changeDirection = false;
    enemies.forEach(enemy => {
    enemy.x += enemyConfig.speed * enemyDirection;
    if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
        changeDirection = true;
    }
    });
    if (changeDirection) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
        enemy.y += enemyConfig.drop;
    });
    }
}

function updateEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    bullet.y += bullet.speed;
    if (bullet.y > canvas.height) {
        enemyBullets.splice(i, 1);
        continue;
    }
    let hitBlock = false;
    for (let k = blocks.length - 1; k >= 0; k--) {
        if (isColliding(bullet, blocks[k])) {
        blocks[k].hits++;
        if (blocks[k].hits >= blockConfig.hitsToDestroy) {
            blocks.splice(k, 1);
        }
        enemyBullets.splice(i, 1);
        hitBlock = true;
        break;
        }
    }
    if (hitBlock) continue;
    if (isColliding(bullet, player)) {
        gameOver = true;
    }
    }
}

function shoot() {
    const now = Date.now();
    if (now - lastShotTime >= shotCooldown) {
    if (shotLevel === 1) {
        bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        dx: 0,
        dy: -7
        });
    } else if (shotLevel === 2) {
        bullets.push({
        x: player.x + player.width / 2 - 10,
        y: player.y,
        width: 5,
        height: 10,
        dx: -0.5,
        dy: -7
        });
        bullets.push({
        x: player.x + player.width / 2 + 5,
        y: player.y,
        width: 5,
        height: 10,
        dx: 0.5,
        dy: -7
        });
    } else if (shotLevel === 3) {
        bullets.push({
        x: player.x + player.width / 2 - 15,
        y: player.y,
        width: 5,
        height: 10,
        dx: -0.5,
        dy: -7
        });
        bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 5,
        height: 10,
        dx: 0,
        dy: -7
        });
        bullets.push({
        x: player.x + player.width / 2 + 15,
        y: player.y,
        width: 5,
        height: 10,
        dx: 0.5,
        dy: -7
        });
    }
    lastShotTime = now;
    }
}

function enemyShoot() {
    if (enemies.length === 0) return;
    const count = Math.min(9, enemies.length);
    let availableIndices = enemies.map((enemy, index) => index);
    for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const enemyIndex = availableIndices.splice(randomIndex, 1)[0];
    const enemy = enemies[enemyIndex];
    enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 2.5,
        y: enemy.y + enemy.height,
        width: 5,
        height: 10,
        speed: 4
    });
    }
}

setInterval(enemyShoot, 2000);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Jeśli gra przegrana, wyświetl alert i zakończ pętlę
    if (gameOver) {
    if (!messageShown) {
        messageShown = true;
        Message(2, 'error', 'Przegrana. Spróbuj ponownie.');
    }
    return;
    }
    
    // Jeśli zwykli przeciwnicy są pokonani i boss jeszcze nie został stworzony, spawn bossa
    if (enemies.length === 0 && !bossSpawned) {
    spawnBoss();
    }
    
    // Jeśli boss został stworzony, aktualizujemy jego ruch i rysujemy go
    if (boss) {
    updateBoss();
    drawBoss();
    }
    
    // Jeśli boss został pokonany (bossSpawned true, ale boss null), to wygrywamy
    if (bossSpawned && boss === null) {
    if (!messageShown) {
        messageShown = true;
        if (localStorage.getItem("IsLevelSixFinished") != "true") {
            Message(1, "info", "Gratulacje ukończenia gry!!!");
            localStorage.setItem("IsLevelSixFinished", "true");
          } else {
            Message(1, "info", "Gratulacje! Wygrałeś!");
          }
    }
    return;
    }
    
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateEnemyBullets();
    
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawEnemyBullets();
    drawBlocks();
    
    requestAnimationFrame(gameLoop);
}

createEnemies();
createBlocks();
gameLoop();
});
