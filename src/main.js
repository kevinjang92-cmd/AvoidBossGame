const PLAYER_WIDTH = 62;
const PLAYER_HEIGHT = 78;
const BOSS_WIDTH = 62;
const BOSS_HEIGHT = 78;
const PLAYER_SPEED = 350;
const BASE_BOSS_SPEED = 140;
const SPAWN_MIN_MS = 420;
const SPAWN_MAX_MS = 950;

const gameArea = document.getElementById('game-area');
const playerEl = document.getElementById('player');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const restartBtn = document.getElementById('restart-btn');
const bossTemplate = document.getElementById('boss-template');
const gameoverTemplate = document.getElementById('gameover-template');

let playerX = 0;
let movingLeft = false;
let movingRight = false;
let bosses = [];
let score = 0;
let startedAt = performance.now();
let lastFrame = performance.now();
let nextSpawnAt = performance.now() + randomSpawnDelay();
let gameOver = false;

function randomSpawnDelay() {
  return Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS) + SPAWN_MIN_MS;
}

function gameWidth() {
  return gameArea.clientWidth;
}

function gameHeight() {
  return gameArea.clientHeight;
}

function setPlayerPosition(newX) {
  const maxX = gameWidth() - PLAYER_WIDTH;
  playerX = Math.max(0, Math.min(maxX, newX));
  playerEl.style.left = `${playerX}px`;
}

function createBoss() {
  const node = bossTemplate.content.firstElementChild.cloneNode(true);
  const maxX = gameWidth() - BOSS_WIDTH;
  const x = Math.random() * maxX;
  const elapsed = (performance.now() - startedAt) / 1000;
  const speed = BASE_BOSS_SPEED + elapsed * 7 + Math.random() * 40;

  node.style.left = `${x}px`;
  node.style.top = `${-BOSS_HEIGHT}px`;
  gameArea.appendChild(node);

  bosses.push({ x, y: -BOSS_HEIGHT, speed, node });
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function showGameOver() {
  gameOver = true;
  const overlay = gameoverTemplate.content.firstElementChild.cloneNode(true);
  gameArea.appendChild(overlay);
  const overlayRestartBtn = overlay.querySelector('#overlay-restart-btn');
  overlayRestartBtn.addEventListener('click', restartGame);
}

function updateHud(now) {
  const aliveSec = (now - startedAt) / 1000;
  timeEl.textContent = `${aliveSec.toFixed(1)}s`;
  scoreEl.textContent = String(score);
}

function updateGame(now) {
  const dt = (now - lastFrame) / 1000;
  lastFrame = now;

  if (gameOver) {
    return;
  }

  if (movingLeft) {
    setPlayerPosition(playerX - PLAYER_SPEED * dt);
  }
  if (movingRight) {
    setPlayerPosition(playerX + PLAYER_SPEED * dt);
  }

  if (now >= nextSpawnAt) {
    createBoss();
    nextSpawnAt = now + randomSpawnDelay();
  }

  const playerBox = {
    x: playerX,
    y: gameHeight() - PLAYER_HEIGHT - 10,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT,
  };

  bosses = bosses.filter((boss) => {
    boss.y += boss.speed * dt;
    boss.node.style.top = `${boss.y}px`;

    const bossBox = { x: boss.x, y: boss.y, w: BOSS_WIDTH, h: BOSS_HEIGHT };
    if (isColliding(playerBox, bossBox)) {
      showGameOver();
      return true;
    }

    if (boss.y > gameHeight()) {
      boss.node.remove();
      score += 1;
      return false;
    }

    return true;
  });

  updateHud(now);
}

function loop(now) {
  updateGame(now);
  requestAnimationFrame(loop);
}

function clearBosses() {
  bosses.forEach((boss) => boss.node.remove());
  bosses = [];
}

function restartGame() {
  gameArea.querySelector('.gameover')?.remove();
  clearBosses();
  gameOver = false;
  score = 0;
  startedAt = performance.now();
  lastFrame = startedAt;
  nextSpawnAt = startedAt + randomSpawnDelay();
  setPlayerPosition((gameWidth() - PLAYER_WIDTH) / 2);
  updateHud(startedAt);
}

function setMovingByKey(key, isPressed) {
  if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
    movingLeft = isPressed;
  }
  if (key === 'ArrowRight' || key === 'd' || key === 'D') {
    movingRight = isPressed;
  }
}

window.addEventListener('keydown', (event) => {
  if (event.key.startsWith('Arrow')) {
    event.preventDefault();
  }
  setMovingByKey(event.key, true);
});

window.addEventListener('keyup', (event) => {
  setMovingByKey(event.key, false);
});

leftBtn.addEventListener('pointerdown', () => {
  movingLeft = true;
});
leftBtn.addEventListener('pointerup', () => {
  movingLeft = false;
});
leftBtn.addEventListener('pointerleave', () => {
  movingLeft = false;
});

rightBtn.addEventListener('pointerdown', () => {
  movingRight = true;
});
rightBtn.addEventListener('pointerup', () => {
  movingRight = false;
});
rightBtn.addEventListener('pointerleave', () => {
  movingRight = false;
});

restartBtn.addEventListener('click', restartGame);
window.addEventListener('resize', () => {
  setPlayerPosition(playerX);
});

restartGame();
requestAnimationFrame(loop);
