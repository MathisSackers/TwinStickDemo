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
app.renderer.backgroundColor = 0x65635a;
// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// globals
const lightGrey = 0xe1ddcf;
let state = 'load';
let t;
let gameContainer;
let hero;
const shots = [];


// this calculates the new position given the current one
function calculateMovement(currx, curry, bounds, x, y, speed) {
  let len = Math.sqrt((x * x) + (y * y));
  const point = { x: currx, y: curry };
  // if we're not too fast no need to slow us
  if (len < 1) {
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

// This function calculates the rotation given x and y input and the
// current rotation
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

// Moves and rotates hero depending on input
function handleMovementAndRotation(delta) {
  // Movement
  const move = calculateMovement(
    hero.x, hero.y,
    hero.height,
    input.left_x, input.left_y,
    delta * hero.speed,
  );
  hero.x = move.x;
  hero.y = move.y;
  // Roatation
  if (Math.abs(input.right_y) > 0.5 || Math.abs(input.right_x) > 0.5) {
    // amount we can rotate _this_ frame
    const speed = hero.rotation_speed * delta;
    hero.rotation = calculateRotation(input.right_x, -input.right_y, hero.rotation, speed);
  }
}

// create shot
function createShot() {
  const shot = new Graphics();
  shot.beginFill(lightGrey);
  shot.drawRect(0, 0, 6, 12);
  shot.endFill();
  shot.pivot.set(3, 25);
  shot.x = hero.x;
  shot.y = hero.y;
  shot.rotation = hero.rotation;
  shot.dy = -Math.cos(shot.rotation);
  shot.dx = Math.sin(shot.rotation);
  shots.push(shot);
  gameContainer.addChild(shot);
}

// gets a shot or creates a new one
function fire() {
  let needNewShot = true;
  shots.forEach((shot) => {
    if (needNewShot && !shot.visible) {
      const s = shot;
      s.x = hero.x;
      s.y = hero.y;
      s.rotation = hero.rotation;
      s.dy = -Math.cos(s.rotation);
      s.dx = Math.sin(s.rotation);
      s.visible = true;
      needNewShot = false;
      return s;
    }
    return shot;
  });
  if (needNewShot) {
    createShot();
  }
}

// moves visible shots
function moveShots(delta) {
  shots.forEach((shot) => {
    if (shot.visible) {
      const s = shot;
      const p = calculateMovement(s.x, s.y, -2 * s.height, s.dx, s.dy, delta * hero.shot_speed);
      s.x = p.x;
      s.y = p.y;
      if (
        s.x < -s.height || s.x > window.innerWidth + s.height ||
        s.y < -s.height || s.y > window.innerHeight + s.height
      ) {
        s.visible = false;
      }
      return s;
    }
    return shot;
  });
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
      t.text = bindIn;
      t.x = (window.innerWidth / 2) - (t.width / 2);
    }
  } else if (state === 'play') {
    getInput();
    handleMovementAndRotation(delta);
    if (input.pause_press) {
      state = 'pause';
      t.text = 'PAUSED';
      t.style = { fontSize: 65, fill: lightGrey, letterSpacing: window.innerWidth / 10 };
      t.x = (window.innerWidth / 2) - (t.width / 2);
      t.visible = true;
      gameContainer.alpha = 0.3;
    }
    if (input.fire_down) {
      fire();
    }
    moveShots(delta);
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

// This function creates the graphic for the hero
function createHero() {
  hero = new Graphics();
  hero.beginFill(lightGrey);

  hero.drawPolygon([-15, 50, 15, 50, 0, 0]);
  hero.endFill();


  hero.x = window.innerWidth / 2;
  hero.y = window.innerHeight / 2;

  hero.pivot.set(0, 25);
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
  t.style = { fill: lightGrey };
  t.x = (window.innerWidth / 2) - (t.width / 2);
  t.y = window.innerHeight / 3;
  app.stage.addChild(t);

  state = 'control';

  // start the gameloop
  app.ticker.add(delta => gameLoop(delta));
}

// load the images and run the 'setup' function when it's done
loader
  .add([]) // nothing to load yet
  .load(setup);

// most pixels you can move per frame
hero.speed = 5;
// most pixels you can move per frame
hero.shot_speed = 7;
// most rads you can turn per frame
hero.rotation_speed = 0.2;

