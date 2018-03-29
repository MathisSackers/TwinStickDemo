// Aliases
const {
  Application, loader, Text, Container, Graphics,
} = PIXI;
// const resources = PIXI.loader.resources;
// const Sprite = PIXI.Sprite;

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
app.renderer.backgroundColor = 0x222222;

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


const lightGrey = 0xaaaaaa;

let state = 'load';

// load the images and run the 'setup' function when it's done
loader
  .add([]) // nothing to load yet
  .load(setup);

let t;
let gameContainer;
let hero;
// most pixels you can move per frame
hero.speed = 5;
// most rads you can turn per frame
hero.rotation_speed = 0.2;
const gamepad = {};
gamepad.bindings = {};
const input = {
  ok_press: false,
  ok_down: false,
  ok_release: false,
  fire_press: false,
  fire_down: false,
  fire_release: false,
  pause_press: false,
  pause_down: false,
  pause_release: false,
};

// This setup function will run when the images have loaded
function setup() {
  // create hero
  createHero();
  gameContainer = new Container();
  gameContainer.addChild(hero);
  gameContainer.visible = false;
  app.stage.addChild(gameContainer);

  t = new Text('...');
  t.style = { fill: lightGrey };
  t.x = (window.innerWidth / 2) - (t.width / 2);
  t.y = window.innerHeight / 3;
  app.stage.addChild(t);

  state = 'control';

  // start the gameloop
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  if (state === 'control') {
    // get input
    if (bindControls()) {
      state = 'play';
      t.visible = false;
      gameContainer.visible = true;
    }
  } else if (state === 'play') {
    getInput();
    const move = calculateMovement(
      hero.x, hero.y,
      hero.height,
      input.left_x, input.left_y,
      delta * hero.speed,
    );
    hero.x = move.x;
    hero.y = move.y;
    if (input.pause_press) {
      state = 'pause';
      t.text = 'PAUSED';
      t.style = { fontSize: 65, fill: lightGrey, letterSpacing: window.innerWidth / 10 };
      t.x = (window.innerWidth / 2) - (t.width / 2);
      t.visible = true;
      gameContainer.alpha = 0.3;
    }
    // if we want to turn
    if (Math.abs(input.right_y) > 0.5 || Math.abs(input.right_x) > 0.5) {
      // amount we can rotate _this_ frame
      const speed = hero.rotation_speed * delta;
      hero.rotation = calculateRotation(input.right_x, -input.right_y, hero.rotation, speed);
    }
  } else if (state === 'pause') {
    getInput();
    if (input.pause_press) {
      state = 'play';
      t.visible = false;
      t.style = { fill: lightGrey };
      gameContainer.alpha = 1;
    }
  } else if (state === 'continue?') {
    // TODO
  } else if (state === 'won') {
    // TODO
  }
}

function calculateMovement(currx, curry, bounds, x, y, speed) {
  let len = Math.sqrt((x * x) + (y * y));
  const point = { x: currx, y: curry };
  // if we're not too fast no need to slow us
  if (len < speed) {
    len = 1;
  }
  if (len !== 0) {
    point.x += (speed * x) / len;
    point.y += (speed * y) / len;
  }

  // check out of bounds
  point.x = Math.max(point.x, bounds);
  point.x = Math.min(point.x, window.innerWidth - bounds);
  point.y = Math.max(point.y, bounds);
  point.y = Math.min(point.y, window.innerHeight - bounds);
  return point;
}

function calculateRotation(x, y, curr, speed) {
  // thats the desired rotation
  let goal = Math.atan2(x, y);
  // 0 at top, pi/2 on right, pi at bottom and -pi/2 on left
  const pi = Math.PI;
  // goal distance from top
  let goalDistance = Math.abs(goal);
  if (goal < 0) {
    goalDistance = (2 * pi) + goal;
  }
  // hero.rotation distance from top
  let heroDistance = Math.abs(curr);
  if (curr < 0) {
    heroDistance = (2 * pi) + curr;
  }
  // distance between the two
  const hgoalDistance = Math.abs(goal - curr);
  // if the distance is too big
  if (hgoalDistance > speed && hgoalDistance < (2 * pi) - speed) {
    if (Math.abs(heroDistance - goalDistance) < pi) {
      if (heroDistance < goalDistance) {
        // turn right
        goal = curr + speed;
      } else {
        // turn left
        goal = curr - speed;
      }
    } else if (heroDistance > goalDistance) {
      // turn right
      goal = curr + speed;
    } else {
      // turn left
      goal = curr - speed;
    }
  }
  // fix if we went over the limit
  if (goal > pi) {
    goal -= 2 * pi;
  } else if (goal < -pi) {
    goal += 2 * pi;
  }
  return goal;
}

function createHero() {
  hero = new Graphics();
  hero.beginFill(lightGrey);

  hero.drawPolygon([-15, 50, 15, 50, 0, 0]);
  hero.endFill();


  hero.x = window.innerWidth / 2;
  hero.y = window.innerHeight / 2;

  hero.pivot.set(0, 25);
}

function getInput() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i += 1) {
    if (gamepads[i] !== null) {
      gamepad.pad = gamepads[i];
      break;
    }
  }

  input.left_x = 0;
  input.left_y = 0;
  input.right_x = 0;
  input.right_y = 0;

  // left stick - x axis - right
  let pos = gamepad.pad.axes[gamepad.bindings.left_h];
  let rest = gamepad.bindings.resting[gamepad.bindings.left_h];
  let maxDiff = gamepad.bindings.left_right;
  let pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.left_right = pos;
      pct = 1.0;
    }
    input.left_x = pct;
  }
  // left stick - x axis - left
  if (gamepad.bindings.left_h2 !== undefined) {
    pos = gamepad.pad.axes[gamepad.bindings.left_h2];
    rest = gamepad.bindings.resting[gamepad.bindings.left_h2];
  } else {
    pos = gamepad.pad.axes[gamepad.bindings.left_h];
    rest = gamepad.bindings.resting[gamepad.bindings.left_h];
  }
  maxDiff = gamepad.bindings.left_left;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.left_left = pos;
      pct = 1.0;
    }
    input.left_x -= pct;
  }
  // left stick - y axis - down
  pos = gamepad.pad.axes[gamepad.bindings.left_v];
  rest = gamepad.bindings.resting[gamepad.bindings.left_v];
  maxDiff = gamepad.bindings.left_down;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.left_down = pos;
      pct = 1.0;
    }
    input.left_y = pct;
  }
  // left stick - y axis - up
  if (gamepad.bindings.left_v2 !== undefined) {
    pos = gamepad.pad.axes[gamepad.bindings.left_v2];
    rest = gamepad.bindings.resting[gamepad.bindings.left_v2];
  } else {
    pos = gamepad.pad.axes[gamepad.bindings.left_v];
    rest = gamepad.bindings.resting[gamepad.bindings.left_v];
  }
  maxDiff = gamepad.bindings.left_up;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.left_up = pos;
      pct = 1.0;
    }
    input.left_y -= pct;
  }

  // right stick - x axis - right
  pos = gamepad.pad.axes[gamepad.bindings.right_h];
  rest = gamepad.bindings.resting[gamepad.bindings.right_h];
  maxDiff = gamepad.bindings.right_right;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.right_right = pos;
      pct = 1.0;
    }
    input.right_x = pct;
  }
  // right stick - x axis - left
  if (gamepad.bindings.right_h2 !== undefined) {
    pos = gamepad.pad.axes[gamepad.bindings.right_h2];
    rest = gamepad.bindings.resting[gamepad.bindings.right_h2];
  } else {
    pos = gamepad.pad.axes[gamepad.bindings.right_h];
    rest = gamepad.bindings.resting[gamepad.bindings.right_h];
  }
  maxDiff = gamepad.bindings.right_left;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.right_left = pos;
      pct = 1.0;
    }
    input.right_x -= pct;
  }
  // right stick - y axis - down
  pos = gamepad.pad.axes[gamepad.bindings.right_v];
  rest = gamepad.bindings.resting[gamepad.bindings.right_v];
  maxDiff = gamepad.bindings.right_down;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.right_down = pos;
      pct = 1.0;
    }
    input.right_y = pct;
  }
  // right stick - y axis - up
  if (gamepad.bindings.right_v2 !== undefined) {
    pos = gamepad.pad.axes[gamepad.bindings.right_v2];
    rest = gamepad.bindings.resting[gamepad.bindings.right_v2];
  } else {
    pos = gamepad.pad.axes[gamepad.bindings.right_v];
    rest = gamepad.bindings.resting[gamepad.bindings.right_v];
  }
  maxDiff = gamepad.bindings.right_up;
  pct = getPercentage(rest, maxDiff, pos);
  if (pct !== false) {
    if (pct > 1.0) {
      gamepad.bindings.right_up = pos;
      pct = 1.0;
    }
    input.right_y -= pct;
  }


  // ok button
  // last frame pressed? not this frame
  if (input.ok_press) {
    input.ok_press = false;
  }
  // last frame released? not this frame
  if (input.ok_release) {
    input.ok_release = false;
  }
  if (gamepad.bindings.ok_button.pressed) {
    if (!input.ok_down) {
      // just pressed
      input.ok_press = true;
      input.ok_down = true;
    }
  } else {
    if (input.ok_down) {
      // just released
      input.ok_release = true;
    }
    input.ok_down = false;
  }

  // fire button
  // last frame pressed? not this frame
  if (input.fire_press) {
    input.fire_press = false;
  }
  // last frame released? not this frame
  if (input.fire_release) {
    input.fire_release = false;
  }
  if (gamepad.bindings.fire_button.pressed) {
    if (!input.fire_down) {
      // just pressed
      input.fire_press = true;
      input.fire_down = true;
    }
  } else {
    if (input.fire_down) {
      // just released
      input.fire_release = true;
    }
    input.fire_down = false;
  }

  // pause button
  // last frame pressed? not this frame
  if (input.pause_press) {
    input.pause_press = false;
  }
  // last frame released? not this frame
  if (input.pause_release) {
    input.pause_release = false;
  }
  if (gamepad.bindings.pause_button.pressed) {
    if (!input.pause_down) {
      // just pressed
      input.pause_press = true;
      input.pause_down = true;
    }
  } else {
    if (input.pause_down) {
      // just released
      input.pause_release = true;
    }
    input.pause_down = false;
  }
  return input;
}

function getPercentage(rest, max, curr) {
  if (max > rest) {
    if (curr < rest) { return false; }
    return (curr - rest) / Math.abs(max - rest);
  }
  if (curr > rest) { return false; }
  return (rest - curr) / Math.abs(max - rest);
}

function bindControls() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i += 1) {
    if (gamepads[i] !== null) {
      gamepad.pad = gamepads[i];
      break;
    }
  }
  if (gamepad.bindings.resting === undefined) {
    gamepad.bindings.resting = gamepad.pad.axes;
    t.text = 'Move the left stick up.';
    t.x = (window.innerWidth / 2) - (t.width / 2);
  } else if (gamepad.bindings.left_v === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2) {
      gamepad.bindings.left_v = axis;
      gamepad.bindings.left_up = gamepad.pad.axes[axis];
      t.text = 'Move the left stick right.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.left_h === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2 && axis !== gamepad.bindings.left_v) {
      gamepad.bindings.left_h = axis;
      gamepad.bindings.left_right = gamepad.pad.axes[axis];
      t.text = 'Move the left stick down.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.left_down === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2 && axis !== gamepad.bindings.left_h) {
      if (axis !== gamepad.bindings.left_v) {
        gamepad.bindings.left_v2 = axis;
      }
      gamepad.bindings.left_down = gamepad.pad.axes[axis];
      t.text = 'Move the left stick left.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.left_left === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2 && axis !== gamepad.bindings.left_v && axis !== gamepad.bindings.left_v2) {
      if (axis !== gamepad.bindings.left_h) {
        gamepad.bindings.left_h2 = axis;
      }
      gamepad.bindings.left_left = gamepad.pad.axes[axis];
      t.text = 'Move the right stick up.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.right_v === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (
      maxDiff > 0.2 && axis !== gamepad.bindings.left_h &&
      axis !== gamepad.bindings.left_h2 &&
      axis !== gamepad.bindings.left_v &&
      axis !== gamepad.bindings.left_v2
    ) {
      gamepad.bindings.right_v = axis;
      gamepad.bindings.right_up = gamepad.pad.axes[axis];
      t.text = 'Move the right stick right.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.right_h === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2 && axis !== gamepad.bindings.right_v) {
      gamepad.bindings.right_h = axis;
      gamepad.bindings.right_right = gamepad.pad.axes[axis];
      t.text = 'Move the right stick down.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.right_down === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2 && axis !== gamepad.bindings.right_h) {
      if (axis !== gamepad.bindings.right_v) {
        gamepad.bindings.right_v2 = axis;
      }
      gamepad.bindings.right_down = gamepad.pad.axes[axis];
      t.text = 'Move the right stick left.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.right_left === undefined) {
    let maxDiff = 0;
    let axis = 0;
    for (let i = 0; i < gamepad.pad.axes.length; i += 1) {
      const diff = Math.abs(gamepad.pad.axes[i] - gamepad.bindings.resting[i]);
      if (diff > maxDiff) {
        maxDiff = diff;
        axis = i;
      }
    }
    if (maxDiff > 0.2 && axis !== gamepad.bindings.right_v && axis !== gamepad.bindings.right_v2) {
      if (axis !== gamepad.bindings.right_h) {
        gamepad.bindings.right_h2 = axis;
      }
      gamepad.bindings.right_left = gamepad.pad.axes[axis];
      t.text = 'Press the ok button.';
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (gamepad.bindings.ok_button === undefined) {
    for (let i = 0; i < gamepad.pad.buttons.length; i += 1) {
      if (gamepad.pad.buttons[i].pressed) {
        gamepad.bindings.ok_button = gamepad.pad.buttons[i];
        t.text = 'Press the pause button.';
        t.x = (window.innerWidth / 2) - (t.width / 2);
      }
    }
  } else if (gamepad.bindings.pause_button === undefined) {
    for (let i = 0; i < gamepad.pad.buttons.length; i += 1) {
      if (gamepad.pad.buttons[i].pressed && gamepad.pad.buttons[i] !== gamepad.bindings.ok_button) {
        gamepad.bindings.pause_button = gamepad.pad.buttons[i];
        t.text = 'Press the fire button.';
        t.x = (window.innerWidth / 2) - (t.width / 2);
      }
    }
  } else if (gamepad.bindings.fire_button === undefined) {
    for (let i = 0; i < gamepad.pad.buttons.length; i += 1) {
      if (
        gamepad.pad.buttons[i].pressed &&
        gamepad.pad.buttons[i] !== gamepad.bindings.pause_button &&
        gamepad.pad.buttons[i] !== gamepad.bindings.ok_button
      ) {
        gamepad.bindings.fire_button = gamepad.pad.buttons[i];
        t.text = 'Press the ... button.';
        t.x = (window.innerWidth / 2) - (t.width / 2);
        return true;
      }
    }
  }
  return false;
}
