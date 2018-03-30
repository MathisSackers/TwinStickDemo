// Create a Pixi Application
const app = new Application({
  width: 1,
  height: 1,
  antialias: true,
  transparent: false,
  resolution: 1,
});
// Fit to screen
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
window.addEventListener('resize', () => { app.renderer.resize(window.innerWidth, window.innerHeight); });
app.renderer.resize(window.innerWidth, window.innerHeight);
// Set the background dark grey
app.renderer.backgroundColor = backgroundColor;
// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


function setText(string) {
  t.text = string;
  t.x = (window.innerWidth / 2) - (t.width / 2);
  t.visible = true;
}

function gameOver() {
  enemies.forEach((enemy) => {
    const e = enemy;
    e.visible = false;
    return e;
  });
  markers.forEach((marker) => {
    const m = marker;
    m.visible = false;
    return m;
  });
  enemyBullets.forEach((bullet) => {
    const b = bullet;
    b.visible = false;
    return b;
  });
  bullets.forEach((bullet) => {
    const b = bullet;
    b.visible = false;
    return b;
  });
  hero.visible = false;
  setText('Hit ok to try again.');
}

// This function is called every frame
function gameLoop(delta) {
  if (state === 'control') {
    // get input
    const bindIn = bindControls();
    if (bindIn === true) {
      state = 'play';
      t.visible = false;
      gameContainer.visible = true;
    } else if (bindIn !== false) {
      setText(bindIn);
    }
  } else if (state === 'play') {
    getInput();
    handleMovementAndRotation(delta);
    if (input.pause_press) {
      state = 'pause';
      t.style = { fontSize: 65, fill: textColor, letterSpacing: window.innerWidth / 10 };
      setText('PAUSED');
      gameContainer.alpha = 0.3;
    }
    // hero shooting
    heroBulletCurrentCooldown -= delta;
    if (heroBulletCurrentCooldown < -1) {
      heroBulletCurrentCooldown = -(Math.abs(heroBulletCurrentCooldown) % 1);
    }
    if (input.fire_down) {
      if (heroBulletCurrentCooldown < 0) {
        fire();
        if (!muted) {
          shootSound.play(`shoot${Math.ceil(Math.random() * 8)}`);
        }
        heroBulletCurrentCooldown += heroBulletCooldown;
      }
    }
    // hero life
    if (hero.invincible > 0) {
      hero.invincible -= delta;
    }
    if (hero.invincible <= 0) {
      hero.invincible = 0;
      hero.tint = 0xffffff;
    }
    if (hero.hp <= 0) {
      gameOver();
      state = 'continue?';
    }
    if (input.ok_press) {
      spawnEnemy();
    }
    hitScan();
    moveBullets(delta);
    moveEnemyBullets(delta);
    moveEnemies(delta);
    enemiesFire(delta);
    moveHitMarkers();
  } else if (state === 'pause') {
    getInput();
    if (input.pause_press) {
      state = 'play';
      t.visible = false;
      t.style = { fill: textColor };
      gameContainer.alpha = 1;
    }
    if (input.ok_press) {
      muted = sound.toggleMuteAll();
    }
  } else if (state === 'continue?') {
    getInput();
    if (input.ok_press) {
      state = 'play';
      t.visible = false;
      createHero();
    }
  } else if (state === 'won') {
    // TODO
  }
}

// This setup function will run when the images have loaded
function setup() {
  // load additional sounds
  shootSound = sound.Sound.from({
    url: 'sounds/shoot_long.mp3',
    sprites: shootLongSprites,
    preload: true,
  });

  // create hero
  createHero();
  gameContainer = new Container();
  gameContainer.addChild(hero);
  gameContainer.visible = false;
  app.stage.addChild(gameContainer);

  t = new Text('...');
  t.style = { fill: textColor };
  t.x = (window.innerWidth / 2) - (t.width / 2);
  t.y = window.innerHeight / 3;
  app.stage.addChild(t);

  state = 'control';

  // start the gameloop
  app.ticker.add(delta => gameLoop(delta));
}


// load the images and run the 'setup' function when it's done
loader
  .add('opponentHit', 'sounds/opponentHit.mp3')
  .load(setup);
