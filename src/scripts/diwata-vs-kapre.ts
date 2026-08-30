const root = document.querySelector<HTMLElement>('[data-game-root]');

if (root) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const ctx = canvas.getContext('2d')!;
  const overlay = root.querySelector<HTMLElement>('[data-overlay]')!;
  const overlayTitle = root.querySelector<HTMLElement>('[data-overlay-title]')!;
  const overlayMessage = root.querySelector<HTMLElement>('[data-overlay-message]')!;
  const playButton = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const scoreText = root.querySelector<HTMLElement>('[data-score]')!;
  const healthFill = root.querySelector<HTMLElement>('[data-health]')!;
  const healthText = root.querySelector<HTMLElement>('[data-health-text]')!;
  const fullscreenButton = root.querySelector<HTMLButtonElement>('[data-fullscreen]')!;
  const frame = root.querySelector<HTMLElement>('.game-frame')!;
  const width = 800;
  const height = 450;
  const maxHealth = 10;

  type Sprite = { x: number; y: number; width: number; height: number };
  type MovingSprite = Sprite & { speed: number };
  const hero: Sprite = { x: 42, y: 172, width: 92, height: 92 };
  let bullets: MovingSprite[] = [];
  let enemies: MovingSprite[] = [];
  let score = 0;
  let health = maxHealth;
  let state: 'idle' | 'running' | 'over' = 'idle';
  let spawnTimer = 0;
  let lastTime = 0;
  const movement = { up: false, down: false };

  const loadImage = (source: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });

  const sources = [root.dataset.heroSrc, root.dataset.enemySrc, root.dataset.bulletSrc, root.dataset.backgroundSrc];
  Promise.all(sources.map((source) => loadImage(source!))).then(([heroImage, enemyImage, bulletImage, backgroundImage]) => {
    const images = { hero: heroImage, enemy: enemyImage, bullet: bulletImage, background: backgroundImage };

    function updateHud() {
      scoreText.textContent = String(score);
      healthText.textContent = String(health);
      healthFill.style.width = `${Math.max(0, health) / maxHealth * 100}%`;
    }

    function resetGame() {
      hero.y = (height - hero.height) / 2;
      bullets = [];
      enemies = [];
      score = 0;
      health = maxHealth;
      spawnTimer = 0;
      movement.up = false;
      movement.down = false;
      updateHud();
    }

    function startGame() {
      resetGame();
      state = 'running';
      overlay.hidden = true;
      lastTime = performance.now();
      canvas.focus();
    }

    function endGame() {
      state = 'over';
      overlayTitle.textContent = 'GAME OVER';
      overlayMessage.textContent = `Final Score: ${score}`;
      playButton.textContent = 'PLAY AGAIN';
      overlay.hidden = false;
      playButton.focus();
    }

    function fire() {
      if (state !== 'running' || bullets.length >= 8) return;
      bullets.push({ x: hero.x + hero.width - 6, y: hero.y + hero.height / 2 - 8, width: 22, height: 34, speed: 460 });
    }

    function overlaps(a: Sprite, b: Sprite) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function update(delta: number) {
      const heroSpeed = 280;
      if (movement.up) hero.y -= heroSpeed * delta;
      if (movement.down) hero.y += heroSpeed * delta;
      hero.y = Math.max(52, Math.min(height - hero.height - 8, hero.y));

      spawnTimer += delta;
      if (spawnTimer >= 1.25) {
        spawnTimer = 0;
        const size = 82 + Math.random() * 22;
        enemies.push({ x: width + 10, y: 56 + Math.random() * (height - size - 70), width: size, height: size, speed: 92 + Math.random() * 28 });
      }

      bullets.forEach((bullet) => { bullet.x += bullet.speed * delta; });
      enemies.forEach((enemy) => { enemy.x -= enemy.speed * delta; });

      for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
        let hit = false;
        for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
          if (overlaps(bullets[bulletIndex], enemies[enemyIndex])) {
            enemies.splice(enemyIndex, 1);
            bullets.splice(bulletIndex, 1);
            score += 1;
            hit = true;
            break;
          }
        }
        if (!hit && bullets[bulletIndex]?.x > width + 30) bullets.splice(bulletIndex, 1);
      }

      for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
        if (enemies[enemyIndex].x + enemies[enemyIndex].width < 0) {
          enemies.splice(enemyIndex, 1);
          health = Math.max(0, health - 1);
        }
      }

      updateHud();
      if (health === 0) endGame();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(images.background, 0, 0, width, height);
      ctx.drawImage(images.hero, hero.x, hero.y, hero.width, hero.height);
      bullets.forEach((bullet) => ctx.drawImage(images.bullet, bullet.x, bullet.y, bullet.width, bullet.height));
      enemies.forEach((enemy) => ctx.drawImage(images.enemy, enemy.x, enemy.y, enemy.width, enemy.height));
    }

    function loop(time: number) {
      const delta = Math.min((time - lastTime) / 1000, 0.05) || 0;
      lastTime = time;
      if (state === 'running') update(delta);
      draw();
      requestAnimationFrame(loop);
    }

    playButton.disabled = false;
    playButton.textContent = 'PLAY';
    playButton.addEventListener('click', startGame);
    requestAnimationFrame(loop);

    window.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) return;
      if (state === 'running') event.preventDefault();
      if (event.code === 'ArrowUp') movement.up = true;
      if (event.code === 'ArrowDown') movement.down = true;
      if (event.code === 'Space' && !event.repeat) fire();
    });
    window.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowUp') movement.up = false;
      if (event.code === 'ArrowDown') movement.down = false;
    });
    window.addEventListener('blur', () => { movement.up = false; movement.down = false; });

    root.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
      const direction = button.dataset.move as 'up' | 'down';
      const stop = () => { movement[direction] = false; };
      button.addEventListener('pointerdown', (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); movement[direction] = true; });
      button.addEventListener('pointerup', stop);
      button.addEventListener('pointercancel', stop);
      button.addEventListener('lostpointercapture', stop);
    });
    root.querySelector<HTMLButtonElement>('[data-fire]')!.addEventListener('pointerdown', (event) => { event.preventDefault(); fire(); });
  }).catch(() => {
    overlayMessage.textContent = 'The game assets could not be loaded. Please refresh and try again.';
    playButton.textContent = 'UNAVAILABLE';
  });

  fullscreenButton.addEventListener('click', async () => {
    if (!document.fullscreenElement) await frame.requestFullscreen();
    else await document.exitFullscreen();
  });
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    fullscreenButton.textContent = active ? 'Exit fullscreen' : 'Fullscreen';
    fullscreenButton.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
  });
}
