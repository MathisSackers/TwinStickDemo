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
