// 'main' class, contains the game setup and loop

// Vars for this file
// color for background
const BACKGROUND_COLOR = 0x65635a;
// color for texts
const TEXT_COLOR = 0xe1ddcf;
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
app.renderer.backgroundColor = BACKGROUND_COLOR;
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
        gameContainer.alpha = 1.0;
        gameContainer.visible = true;
      } else if (bindIn !== false) {
        setText(bindIn);
      }
    }
  } else if (state === 'play') {
    const input = getInput(connectedPads[0]);
    // global inputs
    // pause
    if (input.B_press) {
      state = 'pause';
      t.style = { fontSize: 65, fill: TEXT_COLOR, letterSpacing: window.innerWidth / 10 };
      setText('PAUSED');
      gameContainer.alpha = 0.3;
    }
    // spawning enemies
    if (input.A_press) {
      spawnEnemy();
    }
    // this guy handdles his own input
    hero.update(input, delta);
    if (hero.hp <= 0) {
      gameOver();
      state = 'continue?';
    }
    hitScan();
    moveBullets(delta);
    moveEnemyBullets(delta);
    updateEnemies(delta);
    moveHitMarkers();
  } else if (state === 'pause') {
    const input = getInput(connectedPads[0]);
    if (input.B_press) {
      state = 'play';
      t.visible = false;
      t.style = { fill: TEXT_COLOR };
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
  app.stage.addChild(gameContainer);
  gameContainer.visible = false;

  t = new Text('Connect a controller (or press A to activate it)');
  t.style = { fill: TEXT_COLOR };
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
