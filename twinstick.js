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
const bullets = [];
const enemies = [];
// most pixels enemies can move per frame
const enemySpeed = 4;
// most pixels you can move per frame
const heroSpeed = 5;
// most pixels your bullet can move per frame
const heroBulletSpeed = 7;
// frames until you can shoot again
const heroBulletCooldown = 3;
// most rads you can turn per frame
const heroRotationSpeed = 0.2;
// when the next bullet is possible
let heroBulletCurrentCooldown = -1;

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
    delta * heroSpeed,
  );
  hero.x = move.x;
  hero.y = move.y;
  // Roatation
  if (Math.abs(input.right_y) > 0.5 || Math.abs(input.right_x) > 0.5) {
    // amount we can rotate _this_ frame
    const speed = heroRotationSpeed * delta;
    hero.rotation = calculateRotation(input.right_x, -input.right_y, hero.rotation, speed);
  }
}

// moves single bullet
function moveBullet(bullet, delta) {
  const s = bullet;
  const p = calculateMovement(s.x, s.y, -2 * s.height, s.dx, s.dy, delta * heroBulletSpeed);
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

// moves visible bullets
function moveBullets(delta) {
  bullets.forEach((bullet) => {
    if (bullet.visible) {
      return moveBullet(bullet, delta);
    }
    return bullet;
  });
}

// create bullet
function createBullet() {
  const bullet = new Graphics();
  bullet.beginFill(lightGrey);
  bullet.drawRect(0, 0, 6, 12);
  bullet.endFill();
  bullet.pivot.set(3, 25);
  bullet.x = hero.x;
  bullet.y = hero.y;
  bullet.rotation = hero.rotation;
  bullet.dy = -Math.cos(bullet.rotation);
  bullet.dx = Math.sin(bullet.rotation);
  bullets.push(bullet);
  gameContainer.addChild(bullet);
}

// gets a bullet or creates a new one
function fire() {
  let needNewBullet = true;
  bullets.forEach((bullet) => {
    if (needNewBullet && !bullet.visible) {
      const s = bullet;
      s.x = hero.x;
      s.y = hero.y;
      s.rotation = hero.rotation;
      s.dy = -Math.cos(s.rotation);
      s.dx = Math.sin(s.rotation);
      s.visible = true;
      needNewBullet = false;
      return s;
    }
    return bullet;
  });
  if (needNewBullet) {
    createBullet();
  }
}

// moves single enemy
function moveEnemy(enemy, delta) {
  const s = enemy;
  const p = calculateMovement(s.x, s.y, -2 * s.height, s.dx, s.dy, delta * enemySpeed);
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

// moves visible enemies
function moveEnemies(delta) {
  enemies.forEach((enemy) => {
    if (enemy.visible) {
      return moveEnemy(enemy, delta);
    }
    return enemy;
  });
}

// create an Enemy
function createEnemy() {
  const enemy = new Graphics();
  enemy.beginFill(lightGrey);
  enemy.drawRect(0, 0, 50, 50);
  enemy.endFill();
  enemy.x = Math.random() * window.innerWidth;
  enemy.y = -10;
  enemy.dy = Math.random() * 5;
  enemy.dx = -5 + (Math.random() * 10);
  enemies.push(enemy);
  gameContainer.addChild(enemy);
}

// gets an enemy or creates a new one
function spawnEnemy() {
  let needNewEnemy = true;
  enemies.forEach((enemy) => {
    if (needNewEnemy && !enemy.visible) {
      const e = enemy;
      e.x = Math.random() * window.innerWidth;
      e.y = -10;
      e.dy = Math.random() * 5;
      e.dx = -5 + (Math.random() * 10);
      e.visible = true;
      needNewEnemy = false;
      return e;
    }
    return enemy;
  });
  if (needNewEnemy) {
    createEnemy();
  }
}

// adapted from https://github.com/kittykatattack/learningPixi#collision
function rectHit(rect1, rect2) {
  const r1 = rect1;
  const r2 = rect2;
  // Find the center points of each rectangle
  r1.centerX = r1.x + (r1.width / 2);
  r1.centerY = r1.y + (r1.height / 2);
  r2.centerX = r2.x + (r2.width / 2);
  r2.centerY = r2.y + (r2.height / 2);
  // Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  // Calculate the distance vector between the sprites
  const vx = r1.centerX - r2.centerX;
  const vy = r1.centerY - r2.centerY;
  // Figure out the combined half-widths and half-heights
  const combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  const combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  // Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    // A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      // There's definitely a collision happening
      return true;
    }
  }
  return false;
}

// detect whether a bullet touches an enemy
function hitScan() {
  enemies.forEach((enemy) => {
    if (enemy.visible) {
      const e = enemy;
      bullets.forEach((bullet) => {
        if (bullet.visible) {
          if (rectHit(enemy, bullet)) {
            const b = bullet;
            e.visible = false;
            b.visible = false;
            return b;
          }
        }
        return bullet;
      });
      return e;
    }
    return enemy;
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
    heroBulletCurrentCooldown -= delta;
    if (heroBulletCurrentCooldown < -1) {
      heroBulletCurrentCooldown = -(Math.abs(heroBulletCurrentCooldown) % 1);
    }
    if (input.fire_down) {
      if (heroBulletCurrentCooldown < 0) {
        fire();
        heroBulletCurrentCooldown += heroBulletCooldown;
      }
    }
    if (input.ok_press) {
      spawnEnemy();
    }
    hitScan();
    moveBullets(delta);
    moveEnemies(delta);
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
