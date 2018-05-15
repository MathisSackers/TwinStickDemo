// 'main' class, contains the game setup and loop

// Vars for this file
// color for background
const BACKGROUND_COLOR = 0x65635a;
// color for letterbox
const BAR_COLOR = 0x2d2c27;
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
app.renderer.resize(window.innerWidth, window.innerHeight);
// Set the background dark grey
app.renderer.backgroundColor = BACKGROUND_COLOR;
// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
document.onkeydown = (e) => {
  switch (e.key) {
    case 'f': {
      // toggle fullscreen with 'f'
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
      break;
    }
    case 'm':
      // toggle mute with 'm'
      muted = !muted;
      break;
    case 's':
      // save binding with 's'
      window.localStorage.setItem('bindings', JSON.stringify(GamepadUtil.bindingToString()));
      break;
    case 'l': {
      // load binding with 'l'
      const bindings = window.localStorage.getItem('bindings');
      if (bindings !== null) {
        GamepadUtil.bindingFromString(JSON.parse(bindings));
      }
      break;
    }
    default:
      // nothing
  }
};

// fit the play area to the window
function resize() {
  // resize the whole canvas
  app.renderer.resize(window.innerWidth, window.innerHeight);
  // update the filterarea
  game.filterArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
  heroes.forEach(h => h.screenResize());
  // update the game-area
  if (game.text !== undefined) {
    // we have gone through setup()
    const scale = Math.min(window.innerWidth / game.WIDTH, window.innerHeight / game.HEIGHT);
    gameContainer.scale.set(scale);
    barContainer.removeChild(bars[0]);
    barContainer.removeChild(bars[1]);
    bars.pop();
    bars.pop();
    bars.push(new PIXI.Graphics());
    bars.push(new PIXI.Graphics());
    barContainer.addChild(bars[0]);
    barContainer.addChild(bars[1]);
    if (window.innerWidth / game.WIDTH < window.innerHeight / game.HEIGHT) {
      // screen is too high => black bars top & bottom
      gameContainer.x = 0;
      gameContainer.y = (window.innerHeight - (game.HEIGHT * scale)) / 2;
      // top bar
      bars[0].beginFill(BAR_COLOR);
      bars[0].drawRect(0, 0, window.innerWidth, gameContainer.y);
      bars[0].endFill();
      // bottom bar
      bars[1].beginFill(BAR_COLOR);
      bars[1].drawRect(
        0, gameContainer.y + (game.HEIGHT * scale),
        window.innerWidth, window.innerHeight,
      );
      bars[1].endFill();
    } else {
      // screen is too wide => black bars left & right
      gameContainer.x = (window.innerWidth - (game.WIDTH * scale)) / 2;
      gameContainer.y = 0;
      // left bar
      bars[0].beginFill(BAR_COLOR);
      bars[0].drawRect(0, 0, gameContainer.x, window.innerHeight);
      bars[0].endFill();
      // right bar
      bars[1].beginFill(BAR_COLOR);
      bars[1].drawRect(
        gameContainer.x + (game.WIDTH * scale), 0,
        window.innerWidth, window.innerHeight,
      );
      bars[1].endFill();
    }
    // also scale the gametext
    textContainer.x = gameContainer.x;
    textContainer.y = gameContainer.y;
    textContainer.scale.set(scale);
  }
}

window.onresize = resize;

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
  // black bars for either top/bottom or left/right
  bars.push(new PIXI.Graphics());
  bars.push(new PIXI.Graphics());
  barContainer.addChild(bars[0]);
  barContainer.addChild(bars[1]);
  app.stage.addChild(barContainer);
  // defines the drawing order
  gameContainer.addChild(enemyBulletContainer);
  gameContainer.addChild(bulletContainer);
  gameContainer.addChild(enemyContainer);
  gameContainer.addChild(hitMarkerContainer);
  gameContainer.addChild(heroContainer);
  gameContainer.addChild(gametextContainer);
  // and for the text
  app.stage.addChild(textContainer);
  // text manager
  game.text = new GameText();
  // fit graphics to screen
  resize();
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
