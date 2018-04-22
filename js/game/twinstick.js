// 'main' class, contains the game setup and loop

// Vars for this file
// color for background
const BACKGROUND_COLOR = 0x65635a;
// used controllers
game.usedPads = [];

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
document.onkeydown = (e) => {
  // toggle fullscreen with 'f'
  if (e.key === 'f') {
    const isFullscreen =
      document.fullScreenElement
      || document.mozFullScreen
      || document.webkitIsFullScreen
      || document.msIsFullScreen
      || false;
    app.view.requestFullScreen =
      app.view.requestFullScreen
      || app.view.webkitRequestFullScreen
      || app.view.mozRequestFullScreen
      || app.view.msRequestFullscreen
      || function () { return false; };
    document.cancelFullScreen =
      document.cancelFullScreen
      || document.webkitCancelFullScreen
      || document.mozCancelFullScreen
      || document.msCancelFullScreen
      || function () { return false; };
    if (isFullscreen) {
      document.cancelFullScreen();
    } else {
      app.view.requestFullScreen();
    }
  // toggle mute with 'm'
  } else if (e.key === 'm') {
    muted = !muted;
  // save binding with 's'
  } else if (e.key === 's') {
    window.localStorage.setItem('bindings', JSON.stringify(GamepadUtil.bindingToString()));
  // load binding with 'l'
  } else if (e.key === 'l') {
    const bindings = window.localStorage.getItem('bindings');
    if (bindings !== null) {
      GamepadUtil.bindingFromString(JSON.parse(bindings));
    }
  }
};

// This function is called every frame
function gameLoop(delta) {
  game.statemachine.update(delta);
}

// This setup function will run when the images have loaded
function setup() {
  // load additional sounds
  shootSound = sound.Sound.from({
    url: 'sounds/shoot_long.wav',
    sprites: shootLongSprites,
    preload: true,
  });
  muted = false;
  // easier access;
  game.stage = app.stage;
  // container for all graphics
  app.stage.addChild(gameContainer);
  gameContainer.visible = false;
  // and for the text
  app.stage.addChild(textContainer);
  // defines the drawing order
  gameContainer.addChild(enemyBulletContainer);
  gameContainer.addChild(bulletContainer);
  gameContainer.addChild(enemyContainer);
  gameContainer.addChild(hitMarkerContainer);
  gameContainer.addChild(heroContainer);
  // text manager
  game.text = new GameText();
  // current gamestate
  game.statemachine = new StateMachine();
  // current level
  game.levelmachine = new LevelMachine();
  // start the gameloop
  app.ticker.add(delta => gameLoop(delta));
}


// load the images and run the 'setup' function when it's done
loader
  .add('opponentHit', 'sounds/opponentHit.wav')
  .add('heroHit', 'sounds/heroHit.wav')
  .load(setup);
