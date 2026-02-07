import { Sus } from './game/Sus.js';
import { Alien } from './game/Alien.js';
import { Boomerang } from './game/Boomerang.js';
import { InputHandler } from './game/Input.js';
import { Powerup } from './game/Powerup.js';

window.addEventListener('load', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const input = new InputHandler();
  const sus = new Sus(canvas.width, canvas.height);

  let aliens = [];
  let boomerangs = [];
  let powerups = [];
  let alienTimer = 0;
  let alienInterval = 100; // Spawn rate

  let score = 0;
  let earthHealth = 100;
  let gameOver = false;
  let startTime = Date.now();
  let survivalTime = 0;

  // UI Elements
  const uiTimer = document.getElementById('timer');
  const uiScore = document.getElementById('score');
  const uiHealth = document.getElementById('health');
  const uiGameOver = document.getElementById('game-over');
  const btnRestart = document.getElementById('restart-btn');

  btnRestart.addEventListener('click', restartGame);

  // Restart Function
  function restartGame() {
    sus.x = canvas.width / 2 - sus.width / 2;
    sus.y = sus.initialY;
    aliens = [];
    boomerangs = [];
    powerups = [];
    score = 0;
    earthHealth = 100;
    gameOver = false;
    alienInterval = 100;
    startTime = Date.now();
    explosionTimer = 0; // Reset explosion
    uiGameOver.classList.add('hidden');
    uiHealth.style.color = '#4caf50';
    animate(0);
  }

  let lastTime = 0;
  let explosionTimer = 0; // For Nuke effect
  let kickedAliensCount = 0; // For Health Regen

  function animate(timeStamp) {
    if (gameOver) return;

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    // Update Timer
    survivalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    uiTimer.innerText = 'Time: ' + survivalTime + 's';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = 'white';
    // (Could add star rendering here efficiently)

    // Cheat Code Check
    if (input.checkCheat()) {
      // "kuur" triggered: Nuke all aliens, -50% health
      aliens = [];
      earthHealth -= 50;
      uiHealth.innerText = 'Earth Health: ' + earthHealth + '%';
      explosionTimer = 60; // 1 second visual effect (approx 60 frames)
    }

    // Atom Bomb Visual Effect
    if (explosionTimer > 0) {
      ctx.save();
      ctx.globalAlpha = explosionTimer / 60; // Fade out

      // Big yellow flash
      ctx.fillStyle = 'yellow';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mushroom cloud circle (simplified)
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100 + (60 - explosionTimer) * 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      explosionTimer--;
    }

    // Update Sus
    // Update Sus
    const action = sus.update(input);
    if (action && action.type === 'boomerang') {
      const b = new Boomerang(action.x, action.y, action.direction);
      boomerangs.push(b);
    }
    sus.draw(ctx);

    // Update Boomerangs
    [...boomerangs].forEach(b => {
      b.update();
      b.draw(ctx);
    });
    boomerangs = boomerangs.filter(b => !b.markedForDeletion);

    // Manage Aliens & Powerups
    if (alienTimer > alienInterval) {
      const rand = Math.random() * 100;
      if (rand < 1) {
        // 1% Black Powerup (Nuke + Damage)
        powerups.push(new Powerup(canvas.width, canvas.height, 'black'));
      } else if (rand < 6) { // 1 + 5
        // 5% Red Powerup (+Health)
        powerups.push(new Powerup(canvas.width, canvas.height, 'red'));
      } else {
        aliens.push(new Alien(canvas.width, canvas.height));
      }

      alienTimer = 0;
      if (alienInterval > 20) alienInterval -= 0.1; // Increase difficulty
    } else {
      alienTimer++;
    }

    // Update Powerups
    [...powerups].forEach(p => {
      p.update();
      p.draw(ctx);

      // Collision with Sus
      if (checkCollision(sus.getHitbox(), p)) {
        p.markedForDeletion = true;
        if (p.type === 'red') {
          earthHealth = Math.min(100, earthHealth + 10);
          uiHealth.innerText = 'Earth Health: ' + earthHealth + '%';
          uiHealth.style.color = earthHealth > 50 ? '#4caf50' : (earthHealth > 20 ? 'orange' : 'red');
        } else if (p.type === 'black') {
          // Nuke with 20 Damage
          aliens = [];
          earthHealth -= 20;
          uiHealth.innerText = 'Earth Health: ' + earthHealth + '%';
          if (earthHealth < 50) uiHealth.style.color = 'orange';
          if (earthHealth < 20) uiHealth.style.color = 'red';

          if (earthHealth <= 0) {
            gameOver = true;
            uiGameOver.classList.remove('hidden');
          }

          explosionTimer = 30;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    });
    powerups = powerups.filter(p => !p.markedForDeletion);

    [...aliens].forEach(alien => {
      alien.update();
      alien.draw(ctx);

      // Collision Detection
      // We check !alien.markedForDeletion because "landed" sets markedForDeletion too.
      // But we need to process "landed" damage first.
      // Wait, if Alien.js sets markedForDeletion immediately, we might miss this frame.
      // FIX: Alien.update() sets landed=true, markedForDeletion=true.
      // We should check 'alien.landed' regardless of 'markedForDeletion' FOR THIS FRAME.

      if (!alien.isKicked) {
        if (alien.landed) {
          // Alien hit ground!
          earthHealth -= 1;
          uiHealth.innerText = 'Earth Health: ' + earthHealth + '%';
          if (earthHealth < 50) uiHealth.style.color = 'orange';
          if (earthHealth < 20) uiHealth.style.color = 'red';

          if (earthHealth <= 0) {
            gameOver = true;
            uiGameOver.classList.remove('hidden');
          }
          // It is already marked for deletion by its own update, so we don't need to do anything else.
        }

        if (!alien.markedForDeletion) {
          // Check Collision with Boomerangs
          boomerangs.forEach(b => {
            if (checkCollision({ x: b.x, y: b.y, width: b.width, height: b.height }, alien)) {
              alien.kick();
              score += 5;
              uiScore.innerText = 'Score: ' + score;

              // Health Regen Logic
              kickedAliensCount++;
              if (kickedAliensCount % 5 === 0) {
                earthHealth = Math.min(100, earthHealth + 1);
                uiHealth.innerText = 'Earth Health: ' + earthHealth + '%';
                uiHealth.style.color = earthHealth > 50 ? '#4caf50' : (earthHealth > 20 ? 'orange' : 'red');
              }
            }
          });

          // Check if hit by Kick
          if (sus.isKicking && checkCollision(sus.getHitbox(), alien)) {
            alien.kick();
            score += 10;
            uiScore.innerText = 'Score: ' + score;

            // Health Regen Logic (Same as above)
            kickedAliensCount++;
            if (kickedAliensCount % 5 === 0) {
              earthHealth = Math.min(100, earthHealth + 1);
              uiHealth.innerText = 'Earth Health: ' + earthHealth + '%';
              uiHealth.style.color = earthHealth > 50 ? '#4caf50' : (earthHealth > 20 ? 'orange' : 'red');
            }
          }
        }
      }
    });

    aliens = aliens.filter(alien => !alien.markedForDeletion);

    requestAnimationFrame(animate);
  }

  function checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }

  animate(0);
});
