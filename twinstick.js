// 'main' class, contains the game setup and loop

// Vars for this file
// connected controllers
let connectedPads = [];
// current gamestate
let state = 'load';
// text object
let t;
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
  setEntitiesInvisible();
  setText('Hit ok to try again.');
}

// This function is called every frame
function gameLoop(delta) {
  if (state === 'control') {
    if (connectedPads.length === 0) {
      connectedPads = connectedPads.concat(getPads());
    } else {
      // get input
      const bindIn = bindControls(connectedPads[0]);
      if (bindIn === true) {
        state = 'play';
        t.visible = false;
        setGameAlpha(1.0);
      } else if (bindIn !== false) {
        setText(bindIn);
      }
    }
  } else if (state === 'play') {
    const input = getInput(connectedPads[0]);
    if (input.B_press) {
      state = 'pause';
      t.style = { fontSize: 65, fill: textColor, letterSpacing: window.innerWidth / 10 };
      setText('PAUSED');
      setGameAlpha(0.3);
    }
    handleMovementAndRotation(input, delta);
    // hero shooting
    hero.bulletCooldown -= delta;
    if (hero.bulletCooldown < -1) {
      hero.bulletCooldown = -(Math.abs(hero.bulletCooldown) % 1);
    }
    if (input.R1_down) {
      if (hero.bulletCooldown < 0) {
        fire();
        if (!muted) {
          shootSound.play(`shoot${Math.ceil(Math.random() * 8)}`);
        }
        hero.bulletCooldown += hero.maxBulletCooldown;
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
    if (input.A_press) {
      spawnEnemy();
    }
    hitScan();
    moveBullets(delta);
    moveEnemyBullets(delta);
    moveEnemies(delta);
    enemiesFire(delta);
    moveHitMarkers();
  } else if (state === 'pause') {
    const input = getInput(connectedPads[0]);
    if (input.B_press) {
      state = 'play';
      t.visible = false;
      t.style = { fill: textColor };
      gameContainer.alpha = 1;
    }
    if (input.A_press) {
      muted = sound.toggleMuteAll();
    }
  } else if (state === 'continue?') {
    const input = getInput(connectedPads[0]);
    if (input.A_press) {
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
  app.stage.addChild(getContainer());
  setGameAlpha(0.0);

  t = new Text('Connect a controller (or press A to activate it)');
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
