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
      t.text = bindIn;
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (state === 'play') {
    getInput();
    handleMovementAndRotation(delta);
    if (input.pause_press) {
      state = 'pause';
      t.text = 'PAUSED';
      t.style = { fontSize: 65, fill: textColor, letterSpacing: window.innerWidth / 10 };
      t.x = (window.innerWidth / 2) - (t.width / 2);
      t.visible = true;
      gameContainer.alpha = 0.3;
    }
    heroBulletCurrentCooldown -= delta;
    if (heroBulletCurrentCooldown < -1) {
      heroBulletCurrentCooldown = -(Math.abs(heroBulletCurrentCooldown) % 1);
    }
    if (input.fire_down) {
      if (heroBulletCurrentCooldown < 0) {
        fire();
        if (!muted) {
          sound.play('shoot');
        }
        heroBulletCurrentCooldown += heroBulletCooldown;
      }
    }
    if (input.ok_press) {
      spawnEnemy();
    }
    hitScan();
    moveBullets(delta);
    moveEnemies(delta);
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
      console.log(muted);
    }
  } else if (state === 'continue?') {
    // TODO
  } else if (state === 'won') {
    // TODO
  }
}

// This setup function will run when the images have loaded
function setup() {
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
  .add('shoot', 'sounds/shoot.mp3')
  .load(setup);
